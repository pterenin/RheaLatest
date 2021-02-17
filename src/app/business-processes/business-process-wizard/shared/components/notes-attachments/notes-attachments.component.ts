import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import { TaActiveModal } from '@trustarc/ui-toolkit';
import { BaseRecordFileUploadService } from 'src/app/shared/components/base-record-file-upload/base-record-file-upload.service';
import { BusinessProcessControllerService } from 'src/app/shared/_services/rest-api';
import { NotesInterface } from 'src/app/shared/_interfaces';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { Subscription } from 'rxjs';
import { UtilsClass } from 'src/app/shared/_classes';
import { tap } from 'rxjs/operators';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';

@AutoUnsubscribe([
  '_attachmentUpdate$',
  '_saveNotes$',
  '_loadNotes$',
  '_attachmentCounts$',
  '_saveUploadFilesComments$',
  '_isDeletingFile'
])
@Component({
  selector: 'ta-notes-attachments',
  templateUrl: './notes-attachments.component.html',
  styleUrls: ['./notes-attachments.component.scss']
})
export class NotesAttachmentsComponent implements OnInit, OnDestroy {
  // subscriptions
  private _attachmentUpdate$: Subscription;
  private _attachmentCounts$: Subscription;
  private _saveNotes$: Subscription;
  private _loadNotes$: Subscription;
  private _saveUploadFilesComments$: Subscription;
  private _isDeletingFile$: Subscription;
  // business object
  private note: NotesInterface;
  private attachmentsCount: number;

  @Input() businessProcessId: string;

  public notesAndAttachmentsFormsGroup: FormGroup;
  public attachmentsFormsGroup: FormGroup;

  public notes: FormControl;
  public isDeletingFile: boolean;

  constructor(
    public activeModal: TaActiveModal,
    private formBuilder: FormBuilder,
    private baseRecordFileUploadService: BaseRecordFileUploadService,
    private businessProcessControllerService: BusinessProcessControllerService
  ) {
    this.isDeletingFile = false;
  }

  ngOnInit() {
    this.baseRecordFileUploadService.setSaveOnEveryChange(true);

    this.notes = new FormControl('', Validators.maxLength(1024));
    this.attachmentsFormsGroup = this.formBuilder.group({
      placeholder: ''
    });
    this.notesAndAttachmentsFormsGroup = this.formBuilder.group({
      notes: this.notes,
      fileFormsGroup: this.attachmentsFormsGroup
    });

    UtilsClass.unSubscribe(this._attachmentCounts$);
    this._attachmentCounts$ = this.baseRecordFileUploadService.countOfUploadedFiles
      .asObservable()
      .subscribe(files => {
        this.attachmentsCount = files;
      });

    if (this.businessProcessId) {
      this.loadBusinessProcessNotes();

      UtilsClass.unSubscribe(this._attachmentUpdate$);
      this._attachmentUpdate$ = this.baseRecordFileUploadService
        .update(this.businessProcessId)
        .subscribe();
    }

    UtilsClass.unSubscribe(this._isDeletingFile$);
    this._isDeletingFile$ = this.baseRecordFileUploadService.isDeletingFile
      .asObservable()
      .subscribe(isDeleting => {
        this.isDeletingFile = isDeleting;
      });
  }

  public get isValid(): boolean {
    return this.notesAndAttachmentsFormsGroup
      ? this.notesAndAttachmentsFormsGroup.valid
      : false;
  }

  // #region  GET, SAVE notes

  loadBusinessProcessNotes() {
    UtilsClass.unSubscribe(this._loadNotes$);
    this._loadNotes$ = this.businessProcessControllerService
      .getBusinessProcessNotes(this.businessProcessId)
      .subscribe(notesContent => {
        this.note = notesContent;
        this.notes.patchValue(this.note.notes);
      });
  }

  saveNotes() {
    this.note.notes = this.notes.value;
    UtilsClass.unSubscribe(this._saveNotes$);
    this._saveNotes$ = this.businessProcessControllerService
      .updateBusinessProcessNotes(this.note, this.businessProcessId)
      .pipe(
        tap(response => {
          const baseDomain: BaseDomainInterface = {
            id: this.businessProcessId,
            version: response.version
          };
          UtilsClass.unSubscribe(this._saveUploadFilesComments$);
          this._saveUploadFilesComments$ = this.baseRecordFileUploadService
            .save(baseDomain)
            .subscribe(() => {
              this.closeModal();
            });
        })
      )
      .subscribe(notes => {});
  }

  //#endregion

  public onSubmit() {
    if (this.isValid) {
      this.saveNotes();
    }
  }

  public closeModal() {
    this.activeModal.close(this.attachmentsCount);
  }

  public onCancel() {
    this.activeModal.dismiss();
  }

  public dismissModal() {
    this.activeModal.dismiss();
  }

  ngOnDestroy() {}
}
