import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of, BehaviorSubject, Subscription, noop } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseRecordFileUploadService } from 'src/app/shared/components/base-record-file-upload/base-record-file-upload.service';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { DataInventoryService } from '../../data-inventory.service';
import { ToastService } from '@trustarc/ui-toolkit';
import { CanDeactivateTabInterface } from 'src/app/shared/components/tabset-guarded/can-deactivate-tab.model';
import { Router } from '@angular/router';

@AutoUnsubscribe([
  '_fileListUpdate$',
  '_validitySubscription$',
  '_isDeletingFile$'
])
@Component({
  selector: 'ta-inventory-attachments',
  templateUrl: './inventory-attachments.component.html',
  styleUrls: ['./inventory-attachments.component.scss']
})
export class InventoryAttachmentsComponent
  implements OnInit, OnDestroy, CanDeactivateTabInterface {
  @Input() baseDomainId;

  private _fileListUpdate$: Subscription;

  public attachmentsFormsGroup: FormGroup;
  public isDeletingFile: boolean;

  public countOfUploadedFiles = new BehaviorSubject<number>(0);
  public countOfFilesPendingUpload = new BehaviorSubject<number>(0);

  private _isDeletingFile$: Subscription;
  private _onCancelSubscription$: Subscription;
  private cancelChanges: boolean;

  private _validitySubscription$: Subscription;

  @Output() updateUploading = new EventEmitter<boolean>(false);

  @Output() updateValidity = new EventEmitter<boolean>(false);

  constructor(
    private formBuilder: FormBuilder,
    private baseRecordFileUploadService: BaseRecordFileUploadService,
    private dataInventoryService: DataInventoryService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.router.navigateByUrl(
      this.router.url.replace('new', this.baseDomainId)
    );
    this.attachmentsFormsGroup = this.formBuilder.group({ placeholder: '' });
    this.isDeletingFile = false;
  }

  ngOnInit() {
    this.createValidityUpdates();

    this._fileListUpdate$ = this.baseRecordFileUploadService
      .update(this.baseDomainId)
      .subscribe(noop, err => {
        const { status } = err;
        if (status === 403) {
          this.handleForbiddenError();
        }
      });

    this.baseRecordFileUploadService.setSaveOnEveryChange(true);

    this.countOfUploadedFiles = this.baseRecordFileUploadService.countOfUploadedFiles;
    this.countOfFilesPendingUpload = this.baseRecordFileUploadService.countOfFilesPendingUpload;

    this.onCancelChanges();
    if (this._isDeletingFile$) {
      this._isDeletingFile$.unsubscribe();
    }
    this._isDeletingFile$ = this.baseRecordFileUploadService.isDeletingFile
      .asObservable()
      .subscribe(
        isDeleting => {
          this.isDeletingFile = isDeleting;
        },
        err => {
          const { status } = err;
          if (status === 403) {
            this.handleForbiddenError();
          }
        }
      );
  }

  public save(): Observable<any> {
    if (this.cancelChanges) {
      return of(false);
    }
    // NOTE: We do not specify the version here because the file service currently does not use the base record version.
    return this.baseRecordFileUploadService.saveIgnoreVersion();
  }

  private onCancelChanges() {
    this.onCancelChangesSubscriber();
    this._onCancelSubscription$ = this.dataInventoryService.getCancelFormChanges.subscribe(
      (value: boolean) => {
        if (value) {
          this.cancelChanges = true;
          this.dataInventoryService.goBackDataInventoryListPage();
        }
      }
    );
  }

  private onCancelChangesSubscriber() {
    if (this._onCancelSubscription$) {
      this._onCancelSubscription$.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.onCancelChangesSubscriber();
  }

  canDeactivateTab(): Observable<boolean> {
    if (this.baseRecordFileUploadService.isCurrentlySaving.getValue()) {
      // NOTE: If we create the toast directly in the current context, it will be lost immediatly on route change.
      setTimeout(() => {
        // [i18n-tobeinternationalized]
        this.toastService.warn(
          'Files are currently being uploaded in the background.  They will appear after the uploads complete.'
        );
      }, 100);
    }

    return this.save().pipe(
      map(() => true),
      catchError(err => {
        const { status } = err;
        if (status === 403) {
          this.handleForbiddenError();
        }

        return of(false);
      })
    );
  }

  private createValidityUpdates() {
    if (this._validitySubscription$) {
      this._validitySubscription$.unsubscribe();
    }
    this._validitySubscription$ = this.baseRecordFileUploadService
      .getIsCurrentlySaving()
      .subscribe(status => {
        this.updateUploading.emit(status);
        this.updateValidity.emit(!status);
      });
  }

  private handleForbiddenError() {
    // [i18n-tobeinternationalized]
    this.toastService.error(
      'You do not have the access permissions needed to edit this record',
      null,
      5000
    );
  }
}
