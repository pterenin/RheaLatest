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
import { isNullOrUndefined } from '../../../../../shared/utils/basic-utils';
import {
  ModalConfirmationBasicComponent,
  ModalConfirmationThreeButtonComponent
} from '../..';
import { TaModal, ToastService } from '@trustarc/ui-toolkit';
import { NotificationService } from '../../../../../shared/services/notification/notification.service';
import { Subscription } from 'rxjs';
import { TagGroupInterface } from '../../../../../shared/models/tags.model';
import { ThirdPartyType } from '../../../../../app.constants';
import { ThirdPartyDetailsFullPutRequest } from '../../../../../data-inventory/my-inventory/third-party/details-form/details-form.model';

// tslint:disable-next-line:max-line-length
import { ThirdPartyControllerService } from '../../../../../shared/_services/rest-api/third-party-controller/third-party-controller.service';
import { getDateFromProperties } from '../../../../../shared/utils/datetime-utils';

declare const _: any;

@Component({
  selector: 'ta-system-record-add-third-party-component',
  templateUrl: './system-record-add-third-party.component.html',
  styleUrls: ['./system-record-add-third-party.component.scss']
})
export class SystemRecordAddThirdPartyComponent implements OnInit, OnDestroy {
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
  baseDomainType = BaseDomainTypeEnum.ThirdParty;
  thirdPartyDetailsData: any;
  selectedTags: TagGroupInterface[];

  @Input() public selectedRecordId: string;
  @Output() public thirdPartyAdded = new EventEmitter();
  @Output() public contentChanged = new EventEmitter();
  @Output() public discarded = new EventEmitter();
  @Output() public backRedirect = new EventEmitter<string>();

  constructor(
    private notificationService: NotificationService,
    private itSystemService: ItSystemControllerService,
    private thirdPartyService: ThirdPartyControllerService,
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
    this.initNotificationServiceSubscription();
  }

  ngOnDestroy() {
    this.cancelNotificationServiceSubscription();
  }

  public initNotificationServiceSubscription() {
    if (this._notificationSubscription$) {
      this._notificationSubscription$.unsubscribe();
    }

    this._notificationSubscription$ = this.notificationService
      .getData()
      .subscribe(value => {
        const { action } = value;
        if (action === 'NEW_IT_SYSTEM_SAVE_START') {
          if (this.isCurrentFormValid) {
            return this.processAddingThirdPartyRecord();
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

  public handleBack() {
    this.handleCancelAdding(true);
  }

  public handleSaveAddingThirdParty() {
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
        this.processAddingThirdPartyRecord();
      },
      reason => {}
    );
  }

  public handleCancelAdding(redirectBack = false) {
    if (!this.isCurrentFormDirty) {
      return this.discarded.emit({ selectedRecordId: this.selectedRecordId });
    }

    const modalRef = this.taModal.open(ModalConfirmationThreeButtonComponent, {
      windowClass: 'ta-modal-confirmation-basic',
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
            return this.processAddingThirdPartyRecord();
          }
          // [i18n-tobeinternationalized]
          const message = 'Please, fill all the required fields before saving';
          return this.errorToastMessage(message);
        }
        if (result === 'DISCARD') {
          if (redirectBack) {
            return this.backRedirect.emit('add-system');
          } else {
            return this.discarded.emit({
              selectedRecordId: this.selectedRecordId
            });
          }
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
    if (event.valid) {
      this.thirdPartyDetailsData = event.value;
    }
  }

  public setContactValue(event) {
    this.contactId = event ? event.id : '';
    this.contentChanged.emit(true);
  }

  public handleTagsUpdated(event) {
    this.selectedTags = event;
  }

  private buildRequestObject(
    thirdPartyData,
    contactData
  ): ThirdPartyDetailsFullPutRequest {
    const payload: ThirdPartyDetailsFullPutRequest = {
      details: {
        id: null,
        version: this.version || 0
      },
      tags: []
    };

    payload.details.name = thirdPartyData.vendorName.trim();

    const allItems = [];
    thirdPartyData.companyEntityResponses.forEach(group =>
      allItems.push(...group.items)
    );
    payload.details.owningCompanyEntityIds = allItems
      .filter(item => item.selected)
      .map(item => item.value);

    payload.details.industrySectorIds = thirdPartyData.industrySectors.map(
      item => item.id
    );

    payload.details.type = thirdPartyData.vendorOrPartner
      ? thirdPartyData.vendorOrPartner.id
      : null;

    if (
      _.isObject(thirdPartyData.customEntityType) &&
      thirdPartyData.customEntityType.value
    ) {
      payload.details.type = thirdPartyData.customEntityType.value;
    }

    // Apply only for type = VENDOR
    if (
      payload.details.type === ThirdPartyType.VENDOR &&
      thirdPartyData.ccpaQuestionIds
    ) {
      const ids = thirdPartyData.ccpaQuestionIds as string[];
      const finalQuestionIds = ids.filter(id => id.length > 0);
      payload.details.ccpaQuestionIds =
        finalQuestionIds.length > 0 ? finalQuestionIds : [];
    }

    payload.details.role = thirdPartyData.dataControllerOrProcessor
      ? thirdPartyData.dataControllerOrProcessor.id
      : null;

    payload.details.locations = thirdPartyData.locationForms;

    payload.details.contactId = contactData.contactId;

    thirdPartyData.startDate
      ? (payload.details.contractStartDate = getDateFromProperties(
          thirdPartyData.startDate
        ))
      : (payload.details.contractStartDate = null);

    thirdPartyData.expirationDate
      ? (payload.details.contractEndDate = getDateFromProperties(
          thirdPartyData.expirationDate
        ))
      : (payload.details.contractEndDate = null);

    payload.details.notes = thirdPartyData.notes;
    payload.details.version = this.version || 0;

    payload.tags = this.selectedTags || [];

    return payload;
  }

  private processAddingThirdPartyRecord() {
    const data = this.buildRequestObject(this.thirdPartyDetailsData, {
      contactId: this.contactId
    });
    const payload = _.omitBy(data, isNullOrUndefined);
    this.thirdPartyService.createNewThirdPartyFull(payload).subscribe(
      res => {
        this.version = res.version;
        this.baseDomainId = res.id;
        this.thirdPartyAdded.emit(res);

        const { name } = res;
        // [i18n-tobeinternationalized]
        const message = `<strong>Success</strong><br>'${name}' has been successfully added in the data inventory.`;
        this.toastService.success(message, null, 5000);
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
}
