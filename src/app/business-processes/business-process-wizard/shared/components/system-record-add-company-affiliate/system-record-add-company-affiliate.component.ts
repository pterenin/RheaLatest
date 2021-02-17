import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { BaseDomainTypeEnum } from 'src/app/shared/models/base-domain-model';
import { ItSystemControllerService } from 'src/app/shared/_services/rest-api';
import { exists, isNullOrUndefined } from 'src/app/shared/utils/basic-utils';
import {
  ModalConfirmationBasicComponent,
  ModalConfirmationThreeButtonComponent
} from '../..';
import { TaModal, ToastService } from '@trustarc/ui-toolkit';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Subscription } from 'rxjs';
import { TagGroupInterface } from 'src/app/shared/models/tags.model';

// tslint:disable-next-line:max-line-length
import { CompanyAffiliateControllerService } from 'src/app/shared/_services/rest-api/company-affiliate-controller/company-affiliate-controller.service';
// tslint:disable-next-line:max-line-length
import { CompanyAffiliateDetailsFullPutRequest } from 'src/app/data-inventory/my-inventory/company-affiliate/details-form/details-form.model';

declare const _: any;

@Component({
  selector: 'ta-system-record-add-company-affiliate-component',
  templateUrl: './system-record-add-company-affiliate.component.html',
  styleUrls: ['./system-record-add-company-affiliate.component.scss']
})
export class SystemRecordAddCompanyAffiliateComponent
  implements OnInit, OnDestroy {
  _notificationSubscription$: Subscription;
  version: number;
  activeTabAdded: string;
  isCurrentFormValid: boolean;
  isCurrentFormDirty: boolean;
  isDisabledSave: boolean;
  showRiskFields: boolean;
  tabToRedirect: string;
  contactIds: string[];
  baseDomainId: string;
  baseDomainType = BaseDomainTypeEnum.CompanyEntity;
  companyAffiliateDetailsData: any;
  selectedTags: TagGroupInterface[];

  @Input() public selectedRecordId: string;
  @Output() public companyAffiliateAdded = new EventEmitter();
  @Output() public contentChanged = new EventEmitter();
  @Output() public discarded = new EventEmitter();
  @Output() public backRedirect = new EventEmitter<string>();

  constructor(
    private notificationService: NotificationService,
    private itSystemService: ItSystemControllerService,
    private companyAffiliateService: CompanyAffiliateControllerService,
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
            return this.processAddingCompanyAffiliateRecord();
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

  public handleSaveAddingCompanyAffiliate() {
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
        this.processAddingCompanyAffiliateRecord();
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
            return this.processAddingCompanyAffiliateRecord();
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
      this.companyAffiliateDetailsData = event.value;
    }
  }

  public setContacts(event) {
    this.contactIds = event.map(item => item.id);
    this.contentChanged.emit(true);
  }

  public handleTagsUpdated(event) {
    this.selectedTags = event;
  }

  private buildRequestObject(
    companyAffiliateData,
    contactData
  ): CompanyAffiliateDetailsFullPutRequest {
    const payload: CompanyAffiliateDetailsFullPutRequest = {
      details: {
        id: null,
        version: this.version || 0
      },
      tags: []
    };

    if (contactData && contactData.contactIds) {
      payload.details.contactIds = contactData.contactIds;
    }

    if (companyAffiliateData.dataControllerOrProcessor) {
      payload.details.entityRole =
        companyAffiliateData.dataControllerOrProcessor.id;
    }

    if (companyAffiliateData.entityType) {
      payload.details.businessStructureId = companyAffiliateData.entityType.id;
    }

    payload.details.industrySectorIds = (
      companyAffiliateData.industrySectors || []
    ).map(item => item.id);

    if (companyAffiliateData.companyAddress) {
      const { companyAddress } = companyAffiliateData;

      payload.details.companyAddress = {
        email: companyAddress.emailAddress,
        phone: companyAddress.phoneNumber,
        address: companyAddress.address,
        city: companyAddress.city,
        zip: companyAddress.zipCode,
        location: {
          countryId: companyAddress.country.id,
          stateOrProvinceId: companyAddress.stateOrProvince.id
        }
      };
    }

    payload.details.locations = companyAffiliateData.locationForms;

    if (companyAffiliateData.companyName) {
      payload.details.name = companyAffiliateData.companyName.trim();
    }

    if (companyAffiliateData.notes) {
      payload.details.note = companyAffiliateData.notes;
    }

    if (companyAffiliateData.legalEntity) {
      payload.details.legalEntityId = companyAffiliateData.legalEntity.id;
    }

    if (exists(companyAffiliateData.contactRole)) {
      payload.details.contactTypeId = companyAffiliateData.contactRole.id;
    }

    payload.tags = this.selectedTags || [];

    return payload;
  }

  private processAddingCompanyAffiliateRecord() {
    const data = this.buildRequestObject(this.companyAffiliateDetailsData, {
      contactIds: this.contactIds
    });
    const payload = _.omitBy(data, isNullOrUndefined);
    this.companyAffiliateService
      .createNewCompanyAffiliateFull(payload)
      .subscribe(
        res => {
          this.version = res.version;
          this.baseDomainId = res.id;
          this.companyAffiliateAdded.emit(res);

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
