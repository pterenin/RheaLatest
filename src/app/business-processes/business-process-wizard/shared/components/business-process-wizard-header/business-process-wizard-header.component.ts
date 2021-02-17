import {
  Component,
  OnInit,
  HostBinding,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { BUSINESS_PROCESS_NAVIGATION } from 'src/app/shared/_constant';
import { Subscription, noop, BehaviorSubject } from 'rxjs';
import { BusinessProcessWizardService } from '../../../business-process-wizard.service';
import { TaModal, ToastService } from '@trustarc/ui-toolkit';
import { NotesAttachmentsComponent } from '../notes-attachments/notes-attachments.component';
import { TagsComponent } from '../tags/tags.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AttachmentService } from 'src/app/shared/components/base-record-file-upload/file-upload/attachment.service';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { UtilsClass } from 'src/app/shared/_classes';
import {
  BusinessProcessControllerService,
  FeatureFlagControllerService
} from 'src/app/shared/_services/rest-api';
import { BaseRecordsControllerService } from 'src/app/shared/_services/rest-api/base-records-controller/base-records-controller.service';
import { FeatureFlagAllInterface } from 'src/app/shared/_interfaces';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { StatusInterface } from 'src/app/shared/_interfaces';

const BP_STATUS = [
  { id: 'DRAFT', name: 'Draft' },
  { id: 'IN_REVIEW', name: 'In review' },
  { id: 'PUBLISH', name: 'Publish' },
  { id: 'REVISE', name: 'Revise' }
];

import { ClipboardService } from 'ngx-clipboard';
import { ModalRevalidationDateEditComponent } from '../modals/modal-revalidation-date-edit/modal-revalidation-date-edit.component';
import { CreateBusinessProcessesService } from 'src/app/business-processes/create-bp/create-business-processes.service';
import { DataFlowView } from 'src/app/app.constants';

declare const _: any;

@AutoUnsubscribe([
  '_attachmentsInfo$',
  '_bpName$',
  '_bpId$',
  '_loadBPDetail$',
  '_tagsInfo$',
  '_getStatus$',
  '_updateStatus$'
])
@Component({
  selector: 'ta-business-process-wizard-header',
  templateUrl: './business-process-wizard-header.component.html',
  styleUrls: ['./business-process-wizard-header.component.scss']
})
export class BusinessProcessWizardHeaderComponent implements OnInit, OnDestroy {
  @HostBinding('class') public readonly classes =
    'bg-white pl-3 pr-3 pt-0 pb-2 d-block';

  @ViewChild('attachmentButton') attachmentButton;
  @ViewChild('tagsButton') tagsButton;

  private _attachmentsInfo$: Subscription;
  private _bpName$: Subscription;
  private _bpId$: Subscription;
  private _loadBPDetail$: Subscription;
  private _tagsInfo$: Subscription;
  private _featuresLicense$: Subscription;
  private _getStatus$: Subscription;
  private _updateStatus$: Subscription;

  @Input() public currentRoute: any;
  @Input() public record = { name: 'Untitled' };
  @Output() public isClickSteps: EventEmitter<string>;
  @Output() public viewUpdated: EventEmitter<{
    step: string;
    view: string;
  }>;
  @Output() public customItemClicked: EventEmitter<{
    itemName: string;
    state: string;
  }>;
  /**
   * BUSINESS PROCESS PROPERTIES
   */
  public businessProcessId: string;
  public attachmentsCount = new BehaviorSubject<number>(0);
  public attachmentsCount$ = this.attachmentsCount.asObservable();
  public tagsCount = new BehaviorSubject<number>(0);
  public tagsCount$ = this.tagsCount.asObservable();
  public readonly businessProcessNavigation = BUSINESS_PROCESS_NAVIGATION;
  public readonly dataFlowView = DataFlowView;
  public bpName: string;
  public licenses: FeatureFlagAllInterface;
  public bpStatuses: { id: string; name: string }[];
  public statusForm: FormGroup;
  public status: FormControl;
  public selectedStatus: StatusInterface;
  public isShowingSpinner: boolean;
  public isIE: boolean;

  constructor(
    private businessProcessWizardService: BusinessProcessWizardService,
    private modalService: TaModal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private featureFlagControllerService: FeatureFlagControllerService,
    private attachmentService: AttachmentService,
    private businessProcessControllerService: BusinessProcessControllerService,
    private baseRecordsControllerService: BaseRecordsControllerService,
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private formBuilder: FormBuilder,
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    private taModal: TaModal
  ) {
    this.isClickSteps = new EventEmitter();
    this.viewUpdated = new EventEmitter();
    this.customItemClicked = new EventEmitter();
    this.bpStatuses = BP_STATUS;
    this.status = new FormControl('');
    this.statusForm = formBuilder.group({
      status: this.status
    });
    this.isIE = !UtilsClass.isIE();
  }

  ngOnInit() {
    this.getFeatureLicenses();
    this.isShowingSpinner = false;
    this._bpName$ = this.businessProcessWizardService.getBpName.subscribe(
      latest => {
        this.bpName = latest;
      },
      noop
    );

    this._bpId$ = this.activatedRoute.parent.params
      ? this.activatedRoute.parent.params.subscribe(params => {
          this.businessProcessId = params.id;
        })
      : null;

    this.loadBusinessProcessDetail();
    this.loadAttachmentsCount();
    this.loadTagsCount();
  }

  ngOnDestroy() {}

  getFeatureLicenses() {
    UtilsClass.unSubscribe(this._featuresLicense$);
    this._featuresLicense$ = this.featureFlagControllerService
      .getAllFeatureFlags()
      .subscribe(allLicenses => {
        this.licenses = allLicenses;
      });
  }

  //#region Navigation

  public isVisible(name: string) {
    if (!this.licenses) {
      return false;
    }
    if (!name.includes('data-flow')) {
      return true;
    }
    return (
      (this.licenses.RHEA_NEW_UI_STEPS_5_LICENSE &&
        name === 'build-data-flow') ||
      (!this.licenses.RHEA_NEW_UI_STEPS_5_LICENSE && name === 'data-flow')
    );
  }

  public onClickStep(name: string) {
    this.isClickSteps.emit(name);
  }

  public onCustomItemClick(itemName: string, state: string) {
    // listen this event in any container component
    this.customItemClicked.emit({ itemName: itemName, state: state });

    if (itemName === 'attachments') {
      this.openNotesAndAttachmentsModal();
    }

    if (itemName === 'tags') {
      this.openTagsModal();
    }
  }

  //#endregion

  //#region Details

  loadBusinessProcessDetail() {
    UtilsClass.unSubscribe(this._loadBPDetail$);
    this._loadBPDetail$ = this.businessProcessControllerService
      .getBusinessProcessDetails(this.businessProcessId)
      .subscribe(detail => {
        this.businessProcessWizardService.getBpName.next(detail.name);
      });
    this.getBusinessProcessStatus();
  }

  public loadAttachmentsCount() {
    if (this.businessProcessId) {
      UtilsClass.unSubscribe(this._attachmentsInfo$);
      this._attachmentsInfo$ = this.attachmentService
        .getAttachments(this.businessProcessId)
        .subscribe(attachments => {
          this.attachmentsCount.next(attachments.length);
        });
    }
  }

  public openNotesAndAttachmentsModal() {
    const modalRef = this.modalService.open(NotesAttachmentsComponent);
    modalRef.componentInstance.businessProcessId = this.businessProcessId;
    modalRef.result.then(
      success => {
        this.attachmentsUpdated(success);
        this.attachmentButton.el.nativeElement.blur();
      },
      error => {
        this.modalError(error);
        this.attachmentButton.el.nativeElement.blur();
      }
    );
  }

  attachmentsUpdated(notesAndAttachments) {
    this.attachmentsCount.next(notesAndAttachments);
  }

  public copyBPIDtoClipboard() {
    if (window && window.location.href) {
      this.clipboardService.copyFromContent(window.location.href);

      // [i18n-tobeinternationalized]
      this.toastService.success(
        'Record link copied to clipboard.',
        null,
        10000
      );
    }
  }

  public openEditRevalidationDateModal() {
    const modalRef = this.taModal.open(ModalRevalidationDateEditComponent, {
      windowClass: 'ta-modal-revalidation-date-edit',
      backdrop: 'static',
      keyboard: true,
      size: 'md'
    });

    const { ALERT_NOTIFICATION = false } = this.licenses;
    modalRef.componentInstance.baseRecordId = this.businessProcessId;
    modalRef.componentInstance.alertsEnabled = ALERT_NOTIFICATION === true;

    modalRef.result.then(
      () => {
        // [i18n-tobeinternationalized]
        this.toastService.success('Successfully updated revalidation date');
      },
      reason => {}
    );
  }

  //#endregion

  modalError(error) {
    if (error) {
      console.error(error);
    }
  }

  //#region statuses

  public getBusinessProcessStatus(): void {
    this.isShowingSpinner = true;
    UtilsClass.unSubscribe(this._getStatus$);
    this._getStatus$ = this.businessProcessControllerService
      .getBusinessProcessStatus(this.businessProcessId)
      .subscribe(
        bpStatus => {
          const selected = this.bpStatuses.find(
            item => item.id === bpStatus.status
          );
          this.statusForm.get('status').patchValue(selected.name);
          this.selectedStatus = bpStatus;
          this.isShowingSpinner = false;
        },
        err => {
          console.error(err);
          this.isShowingSpinner = true;
        }
      );
  }

  public bpStatusChange(): void {
    this.isShowingSpinner = true;
    this.selectedStatus.status = this.statusForm.get('status').value.id;
    UtilsClass.unSubscribe(this._updateStatus$);
    this._updateStatus$ = this.businessProcessControllerService
      .putBusinessProcessStatus(this.businessProcessId, this.selectedStatus)
      .subscribe(
        status => {
          this.isShowingSpinner = false;
          this.businessProcessControllerService.versionAfterUpdateStatus.next({
            version: status.version,
            status: this.selectedStatus.status
          });
        },
        err => {
          console.error(err);
          this.isShowingSpinner = false;
        }
      );
  }

  //#endregion

  //#region tags
  public loadTagsCount() {
    if (this.businessProcessId) {
      UtilsClass.unSubscribe(this._tagsInfo$);
      this._tagsInfo$ = this.baseRecordsControllerService
        .getTags(this.businessProcessId)
        .subscribe(tags => {
          this.tagsCount.next(this.getTagsCount(tags));
        });
    }
  }

  public openTagsModal(): void {
    const modalRef = this.modalService.open(TagsComponent);
    modalRef.componentInstance.businessProcessId = this.businessProcessId;
    modalRef.result.then(
      success => {
        this.tagsUpdate(success);
        this.tagsButton.el.nativeElement.blur();
      },
      error => {
        this.modalError(error);
        this.tagsButton.el.nativeElement.blur();
      }
    );
  }

  private tagsUpdate(tags): void {
    this.tagsCount.next(tags);
  }

  private getTagsCount(tags): number {
    return tags.length > 0
      ? tags.reduce((aa, tag) => {
          return (aa += tag.values.length);
        }, 0)
      : 0;
  }

  //#endregion

  //#region data-flow

  public onClickView(view: string) {
    this.createBusinessProcessesService.setDataFlowView(view);
    this.viewUpdated.emit({
      step: 'build-data-flow',
      view
    });
  }

  //#endregion
}
