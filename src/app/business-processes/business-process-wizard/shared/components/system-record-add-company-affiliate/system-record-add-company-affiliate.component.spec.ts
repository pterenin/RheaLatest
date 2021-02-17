import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';
import { SystemRecordAddCompanyAffiliateComponent } from './system-record-add-company-affiliate.component';
import { TabsetGuardedModule } from '../../../../../shared/components/tabset-guarded/tabset-guarded.module';
import { DataInventoryModule } from '../../../../../data-inventory/data-inventory.module';
import { RiskFieldIndicatorModule } from '../../../../../shared/components/risk-field-indicator/risk-field-indicator.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  TaModal,
  TaSvgIconModule,
  TaTabsetModule,
  TaToastModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { CompanyAffiliateControllerService } from '../../../../../shared/_services/rest-api/company-affiliate-controller/company-affiliate-controller.service';
import { NotificationService } from '../../../../../shared/services/notification/notification.service';

describe('SystemRecordAddCompanyAffiliateComponent', () => {
  let component: SystemRecordAddCompanyAffiliateComponent;
  let fixture: ComponentFixture<SystemRecordAddCompanyAffiliateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemRecordAddCompanyAffiliateComponent],
      imports: [
        RouterTestingModule,
        TaToastModule,
        TaSvgIconModule,
        TaTabsetModule,
        HttpClientTestingModule,
        TabsetGuardedModule,
        DataInventoryModule,
        RiskFieldIndicatorModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRecordAddCompanyAffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initNotificationServiceSubscription()', () => {
    it('should call initNotificationServiceSubscription() correctly - getData/valid', inject(
      [NotificationService, CompanyAffiliateControllerService],
      (
        notificationService: NotificationService,
        companyAffiliateService: CompanyAffiliateControllerService
      ) => {
        const fakeValue = {
          action: 'NEW_IT_SYSTEM_SAVE_START'
        };
        const fakeRes = {
          version: 'version',
          id: 'id',
          name: 'name'
        };

        const serviceSpy = spyOn(
          notificationService,
          'getData'
        ).and.returnValue(of(fakeValue));

        const thirdPartySpy = spyOn(
          companyAffiliateService,
          'createNewCompanyAffiliateFull'
        ).and.returnValue(of(fakeRes));

        component.companyAffiliateDetailsData = {
          dataControllerOrProcessor: 'dataControllerOrProcessor',
          entityType: {
            id: 'id'
          },
          companyName: 'companyName',
          notes: 'notes',
          legalEntity: {
            id: 'id'
          },
          contactRole: {
            id: 'id'
          },
          industrySectors: [
            {
              id: 'id'
            }
          ]
        };
        component.isCurrentFormValid = true;

        component.initNotificationServiceSubscription();
        fixture.detectChanges();

        expect(serviceSpy).toHaveBeenCalledTimes(1);
        expect(thirdPartySpy).toHaveBeenCalledTimes(1);
      }
    ));
    it('should call initNotificationServiceSubscription() correctly - getData/not valid', inject(
      [NotificationService, ToastService],
      (
        notificationService: NotificationService,
        toastService: ToastService
      ) => {
        const fakeValue = {
          action: 'NEW_IT_SYSTEM_SAVE_START'
        };
        const serviceSpy = spyOn(
          notificationService,
          'getData'
        ).and.returnValue(of(fakeValue));
        const toastClearSpy = spyOn(toastService, 'clear');
        const toastErrorSpy = spyOn(toastService, 'error');

        component.isCurrentFormValid = false;

        component.initNotificationServiceSubscription();
        fixture.detectChanges();

        expect(serviceSpy).toHaveBeenCalledTimes(1);
        expect(toastClearSpy).toHaveBeenCalledTimes(1);
        expect(toastErrorSpy).toHaveBeenCalledTimes(1);
      }
    ));
  });

  describe('handleBack()', () => {
    it('should call handleBack() correctly', () => {
      const spy = spyOn(component, 'handleCancelAdding');
      component.handleBack();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(true);
    });
  });

  describe('handleSaveAddingCompanyAffiliate()', () => {
    it('should call handleSaveAddingCompanyAffiliate()', inject(
      [TaModal, CompanyAffiliateControllerService],
      (
        taModal: TaModal,
        companyAffiliateService: CompanyAffiliateControllerService
      ) => {
        const fakeModal = {
          componentInstance: {},
          result: new Promise((resolve, reject) => {
            return resolve();
          })
        };
        const fakeRes = {
          version: 'version',
          id: 'id',
          name: 'name'
        };

        const modalSpy = spyOn(taModal, 'open').and.returnValue(fakeModal);
        const companyAffiliateSpy = spyOn(
          companyAffiliateService,
          'createNewCompanyAffiliateFull'
        ).and.returnValue(of(fakeRes));

        component.contactIds = ['contactIds1', 'contactIds2'];
        component.companyAffiliateDetailsData = {
          dataControllerOrProcessor: 'dataControllerOrProcessor',
          entityType: {
            id: 'id'
          },
          companyName: 'companyName',
          notes: 'notes',
          legalEntity: {
            id: 'id'
          },
          contactRole: {
            id: 'id'
          }
        };

        component.handleSaveAddingCompanyAffiliate();
        fixture.detectChanges();

        expect(modalSpy).toHaveBeenCalledTimes(1);

        fakeModal.result.then(() => {
          expect(companyAffiliateSpy).toHaveBeenCalledTimes(1);
        });
      }
    ));
    it('should call handleSaveAddingThirdParty() - open and close modal', inject(
      [TaModal],
      (taModal: TaModal) => {
        const fakeModal = {
          componentInstance: {},
          result: new Promise((resolve, reject) => {
            return reject();
          })
        };

        const modalSpy = spyOn(taModal, 'open').and.returnValue(fakeModal);

        component.handleSaveAddingCompanyAffiliate();
        fixture.detectChanges();

        expect(modalSpy).toHaveBeenCalledTimes(1);
      }
    ));
  });

  describe('handleCancelAdding()', () => {
    it('should call handleCancelAdding() - discard', () => {
      const spy = spyOn(component.discarded, 'emit');
      component.isCurrentFormDirty = false;
      component.selectedRecordId = 'id';
      component.handleCancelAdding();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          selectedRecordId: 'id'
        })
      );
    });
    it('should call handleCancelAdding() - open modal and confirm', inject(
      [TaModal, CompanyAffiliateControllerService, ToastService],
      (
        taModal: TaModal,
        companyAffiliateService: CompanyAffiliateControllerService,
        toastService: ToastService
      ) => {
        const fakeModal = {
          componentInstance: {},
          result: new Promise((resolve, reject) => {
            return resolve('CONFIRM');
          })
        };

        const discardedSpy = spyOn(component.discarded, 'emit');
        const modalSpy = spyOn(taModal, 'open').and.returnValue(fakeModal);
        const companyAffiliateSpy = spyOn(
          companyAffiliateService,
          'createNewCompanyAffiliateFull'
        );
        const toastClearSpy = spyOn(toastService, 'clear');
        const toastErrorSpy = spyOn(toastService, 'error');

        component.isCurrentFormDirty = true;
        component.handleCancelAdding();
        fixture.detectChanges();

        // expect
        expect(discardedSpy).toHaveBeenCalledTimes(0);
        expect(modalSpy).toHaveBeenCalledTimes(1);

        fakeModal.result.then(() => {
          expect(companyAffiliateSpy).toHaveBeenCalledTimes(0);
          expect(toastClearSpy).toHaveBeenCalledTimes(1);
          expect(toastErrorSpy).toHaveBeenCalledTimes(1);
        });
      }
    ));
    it('should call handleCancelAdding() - open modal and confirm/add', inject(
      [TaModal, CompanyAffiliateControllerService, ToastService],
      (
        taModal: TaModal,
        companyAffiliateService: CompanyAffiliateControllerService,
        toastService: ToastService
      ) => {
        const fakeModal = {
          componentInstance: {},
          result: new Promise((resolve, reject) => {
            return resolve('CONFIRM');
          })
        };
        const fakeRes = {
          version: 'version',
          id: 'id',
          name: 'name'
        };
        const discardedSpy = spyOn(component.discarded, 'emit');
        const modalSpy = spyOn(taModal, 'open').and.returnValue(fakeModal);
        const companyAffiliateSpy = spyOn(
          companyAffiliateService,
          'createNewCompanyAffiliateFull'
        ).and.returnValue(of(fakeRes));
        const toastClearSpy = spyOn(toastService, 'clear');
        const toastErrorSpy = spyOn(toastService, 'error');
        const toastSuccessSpy = spyOn(toastService, 'success');

        component.isCurrentFormDirty = true;
        component.isCurrentFormValid = true;
        component.companyAffiliateDetailsData = {
          dataControllerOrProcessor: 'dataControllerOrProcessor',
          entityType: {
            id: 'id'
          },
          companyName: 'companyName',
          notes: 'notes',
          legalEntity: {
            id: 'id'
          },
          contactRole: {
            id: 'id'
          }
        };

        component.handleCancelAdding();
        fixture.detectChanges();

        // expect
        expect(discardedSpy).toHaveBeenCalledTimes(0);
        expect(modalSpy).toHaveBeenCalledTimes(1);

        fakeModal.result.then(() => {
          expect(companyAffiliateSpy).toHaveBeenCalledTimes(1);
          expect(toastClearSpy).toHaveBeenCalledTimes(0);
          expect(toastErrorSpy).toHaveBeenCalledTimes(0);
          expect(toastSuccessSpy).toHaveBeenCalledTimes(1);
        });
      }
    ));
    it('should call handleCancelAdding() - open modal and confirm/add/error', inject(
      [TaModal, CompanyAffiliateControllerService, ToastService],
      (
        taModal: TaModal,
        companyAffiliateService: CompanyAffiliateControllerService,
        toastService: ToastService
      ) => {
        const fakeModal = {
          componentInstance: {},
          result: new Promise((resolve, reject) => {
            return resolve('CONFIRM');
          })
        };
        const fakeErr = 'fakeError';
        const discardedSpy = spyOn(component.discarded, 'emit');
        const modalSpy = spyOn(taModal, 'open').and.returnValue(fakeModal);
        const companyAffiliateSpy = spyOn(
          companyAffiliateService,
          'createNewCompanyAffiliateFull'
        ).and.returnValue(throwError(fakeErr));
        const toastClearSpy = spyOn(toastService, 'clear');
        const toastErrorSpy = spyOn(toastService, 'error');
        const toastSuccessSpy = spyOn(toastService, 'success');

        component.isCurrentFormDirty = true;
        component.isCurrentFormValid = true;
        component.companyAffiliateDetailsData = {
          dataControllerOrProcessor: 'dataControllerOrProcessor',
          entityType: {
            id: 'id'
          },
          companyName: 'companyName',
          notes: 'notes',
          legalEntity: {
            id: 'id'
          },
          contactRole: {
            id: 'id'
          }
        };
        component.handleCancelAdding();
        fixture.detectChanges();

        // expect
        expect(discardedSpy).toHaveBeenCalledTimes(0);
        expect(modalSpy).toHaveBeenCalledTimes(1);

        fakeModal.result.then(() => {
          expect(companyAffiliateSpy).toHaveBeenCalledTimes(1);
          expect(toastClearSpy).toHaveBeenCalledTimes(0);
          expect(toastErrorSpy).toHaveBeenCalledTimes(0);
          expect(toastSuccessSpy).toHaveBeenCalledTimes(0);
        });
      }
    ));
    it('should call handleCancelAdding() - open modal and discard', inject(
      [TaModal],
      (taModal: TaModal) => {
        const fakeModal = {
          componentInstance: {},
          result: new Promise((resolve, reject) => {
            return resolve('DISCARD');
          })
        };
        const discardedSpy = spyOn(component.discarded, 'emit');
        const backRedirectSpy = spyOn(component.backRedirect, 'emit');
        const modalSpy = spyOn(taModal, 'open').and.returnValue(fakeModal);

        component.isCurrentFormDirty = true;
        component.selectedRecordId = 'id';
        component.handleCancelAdding();
        fixture.detectChanges();

        expect(modalSpy).toHaveBeenCalledTimes(1);

        fakeModal.result.then(() => {
          expect(discardedSpy).toHaveBeenCalledTimes(1);
          expect(discardedSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
              selectedRecordId: 'id'
            })
          );
          expect(backRedirectSpy).toHaveBeenCalledTimes(0);
        });
      }
    ));
    it('should call handleCancelAdding() - open modal and discard/redirect', inject(
      [TaModal],
      (taModal: TaModal) => {
        const fakeModal = {
          componentInstance: {},
          result: new Promise((resolve, reject) => {
            return resolve('DISCARD');
          })
        };
        const discardedSpy = spyOn(component.discarded, 'emit');
        const backRedirectSpy = spyOn(component.backRedirect, 'emit');
        const modalSpy = spyOn(taModal, 'open').and.returnValue(fakeModal);

        component.isCurrentFormDirty = true;
        component.selectedRecordId = 'id';
        component.handleCancelAdding(true);
        fixture.detectChanges();

        // expect
        expect(modalSpy).toHaveBeenCalledTimes(1);

        fakeModal.result.then(() => {
          expect(discardedSpy).toHaveBeenCalledTimes(0);
          expect(backRedirectSpy).toHaveBeenCalledTimes(1);
          expect(backRedirectSpy).toHaveBeenCalledWith('add-system');
        });
      }
    ));
    it('should call handleCancelAdding() - open modal and close', inject(
      [TaModal],
      (taModal: TaModal) => {
        const fakeModal = {
          componentInstance: {},
          result: new Promise((resolve, reject) => {
            return reject();
          })
        };
        const modalSpy = spyOn(taModal, 'open').and.returnValue(fakeModal);

        component.isCurrentFormDirty = true;
        component.handleCancelAdding(true);
        fixture.detectChanges();

        // expect
        expect(modalSpy).toHaveBeenCalledTimes(1);
      }
    ));
  });

  describe('getFormData()', () => {
    it('should call getFormData() correctly - with emit', () => {
      const event = {
        valid: true,
        dirty: true,
        value: true
      };
      const spy = spyOn(component.contentChanged, 'emit');

      component.getFormData(event);
      fixture.detectChanges();

      expect(component.isDisabledSave).toEqual(!event.valid);
      expect(component.isCurrentFormValid).toEqual(event.valid);
      expect(component.isCurrentFormDirty).toEqual(event.dirty);
      expect(component.companyAffiliateDetailsData).toEqual(event.value);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(true);
    });
    it('should call getFormData() correctly - without emit', () => {
      const event = {
        valid: false,
        dirty: false,
        value: true
      };
      const spy = spyOn(component.contentChanged, 'emit');
      component.companyAffiliateDetailsData = 'data';

      component.getFormData(event);
      fixture.detectChanges();

      expect(component.isDisabledSave).toEqual(!event.valid);
      expect(component.isCurrentFormValid).toEqual(event.valid);
      expect(component.isCurrentFormDirty).toEqual(event.dirty);
      expect(spy).toHaveBeenCalledTimes(0);
      expect(component.companyAffiliateDetailsData).toEqual('data');
    });
  });

  describe('setContacts()', () => {
    it('should call setContacts() correctly - non-empty array', () => {
      const contacts = [
        {
          id: 'fake_id1'
        },
        {
          id: 'fake_id2'
        }
      ];
      component.setContacts(contacts);
      fixture.detectChanges();

      expect(component.contactIds).toEqual(
        jasmine.objectContaining(['fake_id1', 'fake_id2'])
      );
    });
    it('should call setContacts() correctly - empty array', () => {
      const contacts = [];
      component.setContacts(contacts);
      fixture.detectChanges();

      expect(component.contactIds).toEqual([]);
    });
    it('should call setContacts() correctly - emit true', () => {
      const spy = spyOn(component.contentChanged, 'emit');
      const contacts = [
        {
          id: 'fake_id1'
        },
        {
          id: 'fake_id2'
        }
      ];
      component.setContacts(contacts);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(true);
    });
  });

  describe('handleTagsUpdated()', () => {
    it('should call handleTagsUpdated() correctly', () => {
      component.handleTagsUpdated(true);
      fixture.detectChanges();
      expect(component.selectedTags).toBeTruthy();
    });
  });
});
