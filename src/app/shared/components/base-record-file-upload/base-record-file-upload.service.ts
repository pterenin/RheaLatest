import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
  OperatorFunction,
  UnaryFunction
} from 'rxjs';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { AttachmentService } from './file-upload/attachment.service';
import { catchError, first, flatMap, map, tap } from 'rxjs/operators';
import { AttachmentInterface } from 'src/app/shared/components/base-record-file-upload/file-upload/attachment.model';
import { setFormArrayControls } from '../../utils/form-utils';
import { ToastService } from '@trustarc/ui-toolkit';
import { createPipeFromArray } from '../../utils/rxjs-utils';
import { TranslateService } from '@ngx-translate/core';
import { ToastType } from '../../_constant';
import { UtilsClass } from 'src/app/shared/_classes';

declare const _: any;

export enum FileUploadStatus {
  AWAITING_UPLOAD = 1,
  UPLOADING = 2,
  UPLOADED = 3,
  UPLOAD_ERROR = 4,
  AWAITING_DELETION = 5,
  DELETING = 6,
  DELETED = 7,
  DELETION_ERROR = 8,
  UPLOAD_ERROR_DUPLICATE = 9,
  UPLOAD_ERROR_FORBIDDEN = 10,
  UPLOAD_ERROR_NOT_FOUND = 11
}

type FileFormBaseRecordOperatorGenerator = (
  fileForm: AbstractControl
) => OperatorFunction<BaseDomainInterface, BaseDomainInterface>;

type BaseDomainUpdateFunction = UnaryFunction<
  Observable<BaseDomainInterface>,
  Observable<BaseDomainInterface>
>;

@Injectable({
  providedIn: 'root'
})
export class BaseRecordFileUploadService {
  private baseDomainId: string;
  private fileUploadFormArray: FormArray;
  private isSavingOnEveryChange = false;
  private isSavePending = false;

  public isCurrentlySaving: BehaviorSubject<boolean>;
  public countOfUploadedFiles: BehaviorSubject<number>;
  public countOfFilesPendingUpload: BehaviorSubject<number>;
  public isDeletingFile: BehaviorSubject<boolean>;

  constructor(
    private attachmentService: AttachmentService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {
    this.isCurrentlySaving = new BehaviorSubject<boolean>(false);
    this.countOfUploadedFiles = new BehaviorSubject<number>(0);
    this.countOfFilesPendingUpload = new BehaviorSubject<number>(0);
    this.isDeletingFile = new BehaviorSubject<boolean>(false);
  }

  public setFileUploadFormArray(newFileUploadFormArray: FormArray) {
    this.fileUploadFormArray = newFileUploadFormArray;
  }

  public setSaveOnEveryChange(isSaving: boolean) {
    this.isSavingOnEveryChange = isSaving;
  }

  public update(newBaseDomainId: string): Observable<AttachmentInterface[]> {
    if (!this.fileUploadFormArray) {
      // [i18n-tobeinternationalized]
      throw new Error('A form must be set before updating file list.');
    }
    this.baseDomainId = newBaseDomainId;

    return this.attachmentService.getAttachments(this.baseDomainId).pipe(
      tap(attachments => {
        const formArrayControls = attachments.map(attachment =>
          this.createFileFormFromAttachment(attachment)
        ); // TODO: TIMF-4619: Bind using less code clutter
        setFormArrayControls(this.fileUploadFormArray, formArrayControls);
        this.broadcastCountUpdates();
      })
    );
  }

  private createFileFormFromAttachment(
    attachment: AttachmentInterface
  ): FormGroup {
    return this.formBuilder.group({
      file: null,
      fileName: attachment.fileName,
      comment: new FormControl(attachment.comment, Validators.maxLength(1024)),
      uploadStatus: FileUploadStatus.UPLOADED,
      errorMessage: '',
      id: attachment.id
    });
  }

  private saveOnEveryChange() {
    if (this.isSavingOnEveryChange) {
      this.saveIgnoreVersion()
        .pipe(first()) // NOTE: first() unsubscribes on the first result.
        .subscribe(
          res => {
            this.isDeletingFile.next(false);
          },
          err => {
            const { status } = err;
            if (status === 403) {
              // [i18n-tobeinternationalized]
              return this.toastService.error(
                'You do not have the access permissions needed to edit this record',
                null,
                5000
              );
            }

            // [i18n-tobeinternationalized]
            this.toastService.error('Error saving data');
          }
        );
    } else {
      this.isDeletingFile.next(false);
    }
  }

  public saveIgnoreVersion(): Observable<BaseDomainInterface> {
    return this.save({ id: this.baseDomainId, version: -1 });
  }

  private removeDeletedFiles() {
    this.fileUploadFormArray.value.forEach((file, index) => {
      if (file.uploadStatus === 6) {
        this.fileUploadFormArray.removeAt(index);
      }
    });
  }

  private removeFileWithUploadError() {
    this.fileUploadFormArray.value.forEach((file, index) => {
      if (file.errorMessage) {
        this.fileUploadFormArray.removeAt(index);
        let errorMessageKey = '';
        let logError = false;
        switch (file.uploadStatus) {
          case FileUploadStatus.UPLOAD_ERROR_FORBIDDEN:
            errorMessageKey = 'ERROR_FORBIDDEN';
            break;
          case FileUploadStatus.UPLOAD_ERROR_NOT_FOUND:
            errorMessageKey = 'ERROR_NOT_FOUND';
            break;
          case FileUploadStatus.UPLOAD_ERROR_DUPLICATE:
            errorMessageKey = 'ERROR_EXISTING_NAME';
            break;
          case FileUploadStatus.UPLOADED:
            errorMessageKey = 'ERROR';
            logError = true;
            break;
        }

        const templateStringVariables = [
          { key: '@@fileName', value: file.fileName }
        ];

        this.showLocaleToastMessage(
          errorMessageKey,
          ToastType.Error,
          templateStringVariables,
          logError ? file.errorMessage : null
        );
      }
    });
  }

  public save(
    baseDomain: BaseDomainInterface
  ): Observable<BaseDomainInterface> {
    // If a save call comes in while a save is running, queue up another save.
    // Running two parallel saves will start a race and result in duplicate records.
    if (this.isCurrentlySaving.getValue()) {
      this.isSavePending = true;
      return of(baseDomain as BaseDomainInterface);
    }

    this.isSavePending = false;
    this.isCurrentlySaving.next(true);

    return of(baseDomain as BaseDomainInterface).pipe(
      this.createUploadCalls(),
      this.createUpdateCommentCalls(),
      this.createDeleteAttachmentCalls(),
      flatMap(updatedBaseDomain => {
        this.isCurrentlySaving.next(false);
        // If save was called during a running save, trigger another save.
        if (this.isSavePending) {
          return this.save(updatedBaseDomain);
        } else {
          return of(updatedBaseDomain);
        }
      })
    );
  }

  private createUploadCalls(): BaseDomainUpdateFunction {
    const uploadFileForms = this.fileUploadFormArray.controls.filter(
      (fileForm: AbstractControl) =>
        fileForm.get('uploadStatus').value === FileUploadStatus.AWAITING_UPLOAD
    );

    // TODO: TIMF-5010: Refactor to create shared util that handles the repeated parts of these save functions.
    const operatorGenerator: FileFormBaseRecordOperatorGenerator = (
      fileForm: AbstractControl
    ) =>
      flatMap(baseDomain => {
        this.setFileStatus(fileForm, FileUploadStatus.UPLOADING);
        fileForm.get('comment').markAsPristine();

        return this.attachmentService
          .addAttachment(
            baseDomain.id,
            fileForm.value.file,
            fileForm.value.comment
          )
          .pipe(
            tap(addAttachmentResponse => {
              // Set the attachment's id:  Attachments don't have an ID until they've finished uploading.
              fileForm.patchValue(
                {
                  uploadStatus: FileUploadStatus.UPLOADED,
                  id: addAttachmentResponse.newAttachment.id
                },
                { emitEvent: false }
              );
              this.broadcastCountUpdates();
            }),
            catchError(err => {
              const { status, error } = err;

              // Set defaults
              let uploadStatus = FileUploadStatus.UPLOAD_ERROR;
              let errorMessage = error.message;

              // Handle Forbidden error
              if (status === 403) {
                uploadStatus = FileUploadStatus.UPLOAD_ERROR_FORBIDDEN;
                // [i18n-tobeinternationalized]
                errorMessage =
                  'You do not have the access permissions needed to edit this record';
                this.toastService.error(errorMessage, null, 5000);
              }

              // Handle Not found error
              if (status === 404) {
                uploadStatus = FileUploadStatus.UPLOAD_ERROR_NOT_FOUND;
              }

              // Handle Duplicate error
              if (status === 409) {
                uploadStatus = FileUploadStatus.UPLOAD_ERROR_DUPLICATE;
              }

              // Patch form value
              fileForm.patchValue(
                {
                  uploadStatus,
                  errorMessage
                },
                { emitEvent: false }
              );

              // Update counters
              this.broadcastCountUpdates();
              return of(baseDomain);
            })
          );
      });

    const operatorArray = uploadFileForms.map(operatorGenerator);
    const combinedFunction = createPipeFromArray(operatorArray);
    return combinedFunction;
  }

  private createUpdateCommentCalls(): BaseDomainUpdateFunction {
    const updateCommentFileForms = this.fileUploadFormArray.controls.filter(
      (fileForm: AbstractControl) => fileForm.get('comment').dirty
    );

    // TODO: TIMF-5010: Refactor to create shared util that handles the repeated parts of these save functions.
    const operatorGenerator: FileFormBaseRecordOperatorGenerator = (
      fileForm: AbstractControl
    ) =>
      flatMap(baseDomain => {
        fileForm.get('comment').markAsPristine();
        return this.attachmentService
          .updateComment(
            baseDomain.id,
            fileForm.value.id,
            fileForm.value.comment
          )
          .pipe(
            // This operation does not change the version of the parent, so just
            // forward the version from the last call.
            map(() => baseDomain),
            catchError(err => {
              const { status } = err;
              if (status === 403) {
                this.showLocaleToastMessage('ERROR_FORBIDDEN', ToastType.Error);
              } else {
                // [i18n-tobeinternationalized]
                this.toastService.error('Error updating file comment.');
              }

              return of(baseDomain);
            })
          );
      });

    const operatorArray = updateCommentFileForms.map(operatorGenerator);
    const combinedFunction = createPipeFromArray(operatorArray);
    return combinedFunction;
  }

  private createDeleteAttachmentCalls(): BaseDomainUpdateFunction {
    const deleteFileForms = this.fileUploadFormArray.controls.filter(
      (fileForm: AbstractControl) =>
        fileForm.get('uploadStatus').value ===
        FileUploadStatus.AWAITING_DELETION
    );

    // TODO: TIMF-5010: Refactor to create shared util that handles the repeated parts of these save functions.
    const operatorGenerator: FileFormBaseRecordOperatorGenerator = (
      fileForm: AbstractControl
    ) =>
      flatMap(baseDomain => {
        fileForm.patchValue(
          { uploadStatus: FileUploadStatus.DELETING },
          { emitEvent: false }
        );

        return this.attachmentService
          .deleteAttachment(baseDomain.id, fileForm.value.id)
          .pipe(
            tap(() => {
              fileForm.patchValue(
                { uploadStatus: FileUploadStatus.DELETED },
                { emitEvent: false }
              );

              this.removeDeletedFiles();
              this.removeFileWithUploadError();
            }),
            catchError(err => {
              const { status } = err;
              if (status === 403) {
                this.showLocaleToastMessage('ERROR_FORBIDDEN', ToastType.Error);
              } else {
                // [i18n-tobeinternationalized]
                this.toastService.error('Error deleting file.');
              }

              // If deletion was unsuccessful - mark back as Uploaded
              fileForm.patchValue(
                { uploadStatus: FileUploadStatus.UPLOADED },
                { emitEvent: false }
              );

              // Update counters
              this.broadcastCountUpdates();
              return of(baseDomain);
            })
          );
      });

    const operatorArray = deleteFileForms.map(operatorGenerator);
    const combinedFunction = createPipeFromArray(operatorArray);
    return combinedFunction;
  }

  private setFileStatus(fileForm: AbstractControl, status: FileUploadStatus) {
    fileForm.patchValue({ uploadStatus: status }, { emitEvent: false });
  }

  private createFileFormFromFile(file: File): FormGroup {
    return this.formBuilder.group({
      file: file,
      fileName: file.name,
      comment: new FormControl('', Validators.maxLength(1024)),
      uploadStatus: FileUploadStatus.AWAITING_UPLOAD,
      errorMessage: '',
      id: _.uniqueId('file-') // NOTE: Reactive form groups should have unique ids.
    });
  }

  public addFileForm(file): void {
    this.fileUploadFormArray.push(this.createFileFormFromFile(file));

    // NOTE: Mark this as dirty to trigger a form save.
    this.fileUploadFormArray.markAsDirty();
    this.broadcastCountUpdates();
    this.saveOnEveryChange();
  }

  public addFileFormWithoutSave(file): void {
    this.fileUploadFormArray.push(this.createFileFormFromFile(file));

    // NOTE: Mark this as dirty to trigger a form save.
    this.fileUploadFormArray.markAsDirty();
    this.broadcastCountUpdates();
  }

  public removeFile(index) {
    this.isDeletingFile.next(true);
    this.fileUploadFormArray
      .at(index)
      .patchValue({ uploadStatus: FileUploadStatus.AWAITING_DELETION });

    // NOTE: Mark this as dirty to trigger a form save.
    this.fileUploadFormArray.markAsDirty();
    this.broadcastCountUpdates();
    this.saveOnEveryChange();
  }

  public removeFileWithoutSave(index) {
    this.fileUploadFormArray.removeAt(index);
    // NOTE: Mark this as dirty to trigger a form save.
    this.fileUploadFormArray.markAsDirty();
    this.broadcastCountUpdates();
  }

  private broadcastCountUpdates() {
    const countOfUploadedFiles = this.getCountOfUploadedFiles();
    const countOfFilesPendingUpload = this.getCountOfFilesPendingUpload();

    this.countOfUploadedFiles.next(countOfUploadedFiles);
    this.countOfFilesPendingUpload.next(countOfFilesPendingUpload);
  }

  public isFileStatusVisible(fileControl: AbstractControl) {
    const status: FileUploadStatus = fileControl.get('uploadStatus').value;
    return (
      status !== FileUploadStatus.AWAITING_DELETION &&
      status !== FileUploadStatus.DELETING &&
      status !== FileUploadStatus.DELETED
    );
  }

  public isFileStatusPendingUpload(fileControl: AbstractControl) {
    const status: FileUploadStatus = fileControl.get('uploadStatus').value;
    return (
      status === FileUploadStatus.AWAITING_UPLOAD ||
      status === FileUploadStatus.UPLOADING
    );
  }

  public isFileStatusError(fileControl: AbstractControl) {
    const status: FileUploadStatus = fileControl.get('uploadStatus').value;
    return (
      status === FileUploadStatus.UPLOAD_ERROR ||
      status === FileUploadStatus.UPLOAD_ERROR_FORBIDDEN ||
      status === FileUploadStatus.UPLOAD_ERROR_NOT_FOUND ||
      status === FileUploadStatus.UPLOAD_ERROR_DUPLICATE
    );
  }

  public getCountOfUploadedFiles() {
    if (!this.fileUploadFormArray.value) {
      return 0;
    }
    return this.fileUploadFormArray.controls.filter(
      (fileForm: AbstractControl) =>
        fileForm.get('uploadStatus').value === FileUploadStatus.UPLOADED
    ).length;
  }

  public getCountOfFilesPendingUpload() {
    if (!this.fileUploadFormArray.value) {
      return 0;
    }

    return this.fileUploadFormArray.controls.filter(
      (fileForm: AbstractControl) => this.isFileStatusPendingUpload(fileForm)
    ).length;
  }

  public downloadFile(fileId: string) {
    return this.attachmentService.downloadAttachment(this.baseDomainId, fileId);
  }

  public getIsCurrentlySaving(): Observable<boolean> {
    return this.isCurrentlySaving.asObservable();
  }

  private showLocaleToastMessage(
    templateMessageKey,
    toastType: ToastType,
    templateStringVariables?: { key: string; value: string }[],
    error?
  ) {
    const keyString = `FILE_ATTACHMENTS.TOAST_MESSAGES.${templateMessageKey}`;
    this.translateService.get(keyString).subscribe(messageTemplate => {
      const toastMessage = templateStringVariables
        ? UtilsClass.updateTemplateString(
            messageTemplate,
            templateStringVariables
          )
        : messageTemplate;

      if (toastType === ToastType.Success) {
        this.toastService.success(toastMessage);
      }
      if (toastType === ToastType.Error) {
        if (error) {
          console.error(toastMessage, error);
        }
        this.toastService.error(toastMessage, null, 5000);
      }
      if (toastType === ToastType.Info) {
        this.toastService.info(toastMessage);
      }
      if (toastType === ToastType.Warning) {
        this.toastService.warn(toastMessage);
      }
    });
  }
}
