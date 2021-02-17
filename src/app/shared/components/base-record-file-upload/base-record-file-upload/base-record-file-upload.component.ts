import { Component, OnInit, Input } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';
import { BaseRecordFileUploadService } from '../base-record-file-upload.service';
import { BehaviorSubject } from 'rxjs';
import { AttachmentLink } from '../file-upload/attachment.model';
import { TaModal, ToastService } from '@trustarc/ui-toolkit';
// tslint:disable-next-line: max-line-length
import { ModalConfirmationBasicComponent } from 'src/app/business-processes/business-process-wizard/shared/components/modals/modal-confirmation-basic/modal-confirmation-basic.component';

declare const _: any;

@Component({
  selector: 'ta-base-record-file-upload',
  templateUrl: './base-record-file-upload.component.html',
  styleUrls: ['./base-record-file-upload.component.scss']
})
export class BaseRecordFileUploadComponent implements OnInit {
  @Input() public isDeletingFile: boolean;
  public fileUploadFormGroup: FormGroup;
  public fileForms: FormArray;

  public countOfUploadedFiles: BehaviorSubject<number>;
  public countOfFilesPendingUpload: BehaviorSubject<number>;

  constructor(
    private controlContainer: ControlContainer,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private modalService: TaModal,
    public baseRecordFileUploadService: BaseRecordFileUploadService
  ) {
    this.fileForms = this.formBuilder.array([]);
    baseRecordFileUploadService.setFileUploadFormArray(this.fileForms);
  }

  ngOnInit() {
    this.fileUploadFormGroup = <FormGroup>this.controlContainer.control;
    this.fileUploadFormGroup.registerControl('fileForms', this.fileForms);
    this.countOfUploadedFiles = this.baseRecordFileUploadService.countOfUploadedFiles;
    this.countOfFilesPendingUpload = this.baseRecordFileUploadService.countOfFilesPendingUpload;
  }

  public addFileForm(file): void {
    this.baseRecordFileUploadService.addFileForm(file);
  }

  public downloadFileFrom(fileControl: FormControl) {
    const fileId = fileControl.get('id').value;
    const fileName = fileControl.get('fileName').value;

    this.baseRecordFileUploadService.downloadFile(fileId).subscribe(
      (fileLink: AttachmentLink) => {
        window.open(fileLink.fileUrl, '_blank');
      },
      error => {
        this.toastService.error(
          `Error retrieving file with filename "${fileName}"`
        );
      }
    );
  }

  public deleteFile(file, index) {
    const fileName = file.value.fileName;
    const fileIndexAndName = { index: index, fileName: fileName + '?' };
    const modalRef = this.modalService.open(ModalConfirmationBasicComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'sm'
    });
    // [i18n-tobeinternationalized]
    modalRef.componentInstance.title = `Delete ${fileIndexAndName.fileName}`;
    modalRef.componentInstance.type = 'delete';
    modalRef.componentInstance.icon = 'delete';
    // [i18n-tobeinternationalized]
    modalRef.componentInstance.description = 'You cannot undo this action.';
    modalRef.componentInstance.btnLabelConfirm = 'Delete';
    modalRef.componentInstance.confirm.subscribe(confirm => {
      this.baseRecordFileUploadService.removeFile(index);
      modalRef.close('deleted');
    });
    modalRef.componentInstance.cancel.subscribe(cancel => {
      modalRef.close('canceled');
    });
  }

  public isFileStatusVisible(fileControl: FormControl) {
    return this.baseRecordFileUploadService.isFileStatusVisible(fileControl);
  }

  public isFileStatusPendingUpload(fileControl: FormControl) {
    return this.baseRecordFileUploadService.isFileStatusPendingUpload(
      fileControl
    );
  }

  public isFileStatusError(fileControl: FormControl) {
    return this.baseRecordFileUploadService.isFileStatusError(fileControl);
  }
}
