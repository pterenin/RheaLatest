import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { BaseDomainTypeEnum } from '../../../../../shared/models/base-domain-model';
import { ItSystemControllerService } from '../../../../../shared/_services/rest-api';
import {
  exists,
  isNullOrUndefined
} from '../../../../../shared/utils/basic-utils';
import {
  ModalConfirmationBasicComponent,
  ModalConfirmationThreeButtonComponent
} from '../..';
import { ItSystemDetailsPutRequest } from '../../../../../data-inventory/my-inventory/it-system/it-system-details/it-system-details.model';

import { TaModal, ToastService } from '@trustarc/ui-toolkit';
import { SystemRecordAddService } from './system-record-add.service';
import { NotificationService } from '../../../../../shared/services/notification/notification.service';
import { TagGroupInterface } from '../../../../../shared/models/tags.model';
import { Subscription } from 'rxjs';
import { RetentionPeriodValues } from 'src/app/shared/_interfaces';

declare const _: any;

@Component({
  selector: 'ta-system-record-add-component',
  templateUrl: './system-record-add.component.html',
  styleUrls: ['./system-record-add.component.scss']
})
export class SystemRecordAddComponent implements OnInit, OnDestroy {
  _notificationSubscription$: Subscription;
  version: number;
  activeTabAdded: string;
  isCurrentFormValid: boolean;
  isCurrentFormDirty: boolean;
  isDisabledSave: boolean;
  showRiskFields: boolean;
  tabToRedirect: string;
  contactId: string;
  baseDomainId: string;
  baseDomainType = BaseDomainTypeEnum.ItSystem;
  itSystemDetailsData: any;
  selectedDataElements: string[];
  selectedProcessingPurposes: string[];
  selectedTags: TagGroupInterface[];
  state: {
    details: any;
    selectedDataElements: string[];
    selectedProcessingPurposes: string[];
    selectedTags: TagGroupInterface[];
  } = {
    details: {},
    selectedDataElements: [],
    selectedProcessingPurposes: [],
    selectedTags: []
  };

  private contactIds: string[];
  private retentionPeriodChanges: RetentionPeriodValues;

  @Input() public selectedRecordId: string;
  @Output() public systemAdded = new EventEmitter();
  @Output() public contentChanged = new EventEmitter();
  @Output() public discarded = new EventEmitter();
  @Output() public addNewEntity = new EventEmitter<string>();

  constructor(
    private notificationService: NotificationService,
    private itSystemService: ItSystemControllerService,
    private systemRecordAddService: SystemRecordAddService,
    private taModal: TaModal,
    private toastService: ToastService
  ) {
    this.activeTabAdded = 'tabSystemRecordAddDetails';
    this.isCurrentFormValid = false;
    this.isCurrentFormDirty = false;
    this.isDisabledSave = true;
    this.showRiskFields = false;
  }

  ngOnInit() {
    this.contactIds = [];
    this.state = this.systemRecordAddService.getState() || {};

    const {
      selectedDataElements,
      selectedProcessingPurposes,
      selectedTags
    } = this.state;

    this.selectedDataElements = selectedDataElements || [];
    this.selectedProcessingPurposes = selectedProcessingPurposes || [];
    this.selectedTags = selectedTags || [];

    this.initNotificationServiceSubscription();
  }

  ngOnDestroy() {
    this.cancelNotificationServiceSubscription();
  }

  public resetState() {
    this.systemRecordAddService.clearState();
    this.state = this.systemRecordAddService.getState();
  }

  public initNotificationServiceSubscription() {
    if (this._notificationSubscription$) {
      this._notificationSubscription$.unsubscribe();
    }

    this._notificationSubscription$ = this.notificationService
      .getData()
      .subscribe(value => {
        const { action, payload = {} } = value;
        if (action === 'NEW_IT_SYSTEM_SAVE_START') {
          if (this.isCurrentFormValid) {
            const { confirmModalFunction = {} } = payload;

            const options: any = {};
            if (confirmModalFunction.method === 'navigate') {
              options.navigateUrl = confirmModalFunction.target;
            }
            return this.processAddingRecord(options);
          }
          // [i18n-tobeinternationalized]
          const message = 'Please, fill all the required fields before saving';
          return this.errorToastMessage(message);
        }
      });
  }

  public cancelNotificationServiceSubscription() {
    this.notificationService.emit({});
    this._notificationSubscription$.unsubscribe();
  }

  public handleSaveAdding() {
    const modalRef = this.taModal.open(ModalConfirmationBasicComponent, {
      windowClass: 'ta-modal-confirmation-basic',
      backdrop: 'static',
      keyboard: true,
      size: 'sm'
    });

    // [i18n-tobeinternationalized]
    modalRef.componentInstance.title =
      'This record will be added to your data inventory.';
    modalRef.componentInstance.description =
      'Do you want to create this record?';
    modalRef.componentInstance.type = 'question';
    modalRef.componentInstance.icon = 'help';
    modalRef.componentInstance.btnLabelCancel = 'Cancel';
    modalRef.componentInstance.btnLabelConfirm = 'Add Record';

    modalRef.result.then(
      result => {
        this.processAddingRecord({});
      },
      reason => {}
    );
  }

  public handleCancelAdding() {
    if (!this.isCurrentFormDirty) {
      this.resetState();
      return this.discarded.emit({ selectedRecordId: this.selectedRecordId });
    }

    const modalRef = this.taModal.open(ModalConfirmationThreeButtonComponent, {
      windowClass: 'ta-modal-confirmation',
      backdrop: 'static',
      keyboard: true,
      size: 'sm'
    });

    // [i18n-tobeinternationalized]
    modalRef.componentInstance.title = 'You have unsaved new record.';
    modalRef.componentInstance.description =
      'Do you want to create this record?';
    modalRef.componentInstance.type = 'question';
    modalRef.componentInstance.icon = 'help';
    modalRef.componentInstance.btnLabelCancel = 'Cancel';
    modalRef.componentInstance.btnLabelDiscard = 'Discard';
    modalRef.componentInstance.btnLabelConfirm = 'Add Record';

    modalRef.result.then(
      result => {
        if (result === 'CONFIRM') {
          if (this.isCurrentFormValid) {
            return this.processAddingRecord({});
          }
          // [i18n-tobeinternationalized]
          const message = 'Please, fill all the required fields before saving';
          return this.errorToastMessage(message);
        }
        if (result === 'DISCARD') {
          this.resetState();
          return this.discarded.emit({
            selectedRecordId: this.selectedRecordId
          });
        }
      },
      reason => {}
    );
  }

  public getFormData(event) {
    this.isDisabledSave = !event.valid;
    this.isCurrentFormValid = event.valid;
    this.isCurrentFormDirty = event.dirty;
    if (event.dirty) {
      this.contentChanged.emit(true);
    }
    this.itSystemDetailsData = event.value;
  }

  public setContactValue(event) {
    this.contactIds = event;
    this.contentChanged.emit(true);
  }

  public handleDataElementsUpdated(event) {
    this.selectedDataElements = event;
  }

  public handleProcessingPurposesUpdated(event) {
    this.selectedProcessingPurposes = event;
  }

  public handleTagsUpdated(event) {
    this.selectedTags = event;
  }

  public handleAddNewEntity(entityType) {
    this.state = {
      details: {
        data: this.itSystemDetailsData
      },
      selectedDataElements: this.selectedDataElements || [],
      selectedProcessingPurposes: this.selectedProcessingPurposes || [],
      selectedTags: this.selectedTags || []
    };

    this.systemRecordAddService.setState(this.state);
    this.addNewEntity.emit(entityType);
  }

  private buildRequestObject(
    itSystemData,
    contactData
  ): ItSystemDetailsPutRequest {
    const payload: ItSystemDetailsPutRequest = { version: this.version || 0 };

    payload.id = null;
    payload.contactIds = contactData.contactIds;
    payload.name = itSystemData.name.trim();
    payload.notes = itSystemData.notes;
    payload.legalEntityId = itSystemData.legalEntity.id;
    payload.locations = itSystemData.locationForms;
    payload.description = itSystemData.description;

    payload.dataSubjectTypes = exists(itSystemData.dataSubjectTypes)
      ? itSystemData.dataSubjectTypes
      : [];

    payload.dataSubjectVolumeId = exists(itSystemData.dataSubjectVolume)
      ? itSystemData.dataSubjectVolume.id
      : '';

    payload.dataElementIds = this.selectedDataElements || [];
    payload.processingPurposeIds = this.selectedProcessingPurposes || [];
    payload.tags = this.selectedTags || [];
    payload.dataRetention = this.validateRetentionPeriod()
      ? this.getDataRetentionPutRequest()
      : null;

    return payload;
  }

  public handleRetentionPeriodChange(changes: RetentionPeriodValues): void {
    this.retentionPeriodChanges = changes;
    this.contentChanged.emit(true);
  }

  private processAddingRecord(options) {
    const data = this.buildRequestObject(this.itSystemDetailsData, {
      contactIds: this.contactIds
    });
    const payload = _.omitBy(data, isNullOrUndefined);
    this.itSystemService.createNewItSystemFull(payload).subscribe(
      res => {
        this.version = res.version;
        this.baseDomainId = res.id;
        this.systemAdded.emit({
          res,
          options
        });

        // After successfully adding new it-system record - clear state
        this.systemRecordAddService.clearState();
      },
      err => {
        console.error(err);
      }
    );
  }

  private errorToastMessage(message) {
    this.toastService.clear();
    this.toastService.error(message, null, 3000);
  }

  private validateRetentionPeriod() {
    const retentionPeriodInfo = this.getDataRetentionPutRequest();
    if (
      retentionPeriodInfo &&
      retentionPeriodInfo.type === 'Other' &&
      retentionPeriodInfo.description
    ) {
      return true;
    }

    if (
      retentionPeriodInfo &&
      retentionPeriodInfo.type !== 'Other' &&
      retentionPeriodInfo.value
    ) {
      return true;
    }

    return false;
  }

  private getDataRetentionPutRequest() {
    const type = this.retentionPeriodChanges
      ? this.retentionPeriodChanges.retentionPeriodUnits
      : null;
    if (!type) {
      return null;
    }
    if (type === 'Other') {
      return {
        type,
        description: this.retentionPeriodChanges.retentionPeriodUnitsOther
      };
    }

    return {
      type,
      value: this.retentionPeriodChanges.retentionPeriodValue
    };
  }
}
