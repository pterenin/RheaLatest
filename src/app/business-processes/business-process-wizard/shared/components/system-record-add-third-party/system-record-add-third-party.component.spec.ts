import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';
import { SystemRecordAddThirdPartyComponent } from './system-record-add-third-party.component';
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
// tslint:disable-next-line:max-line-length
import { ThirdPartyControllerService } from '../../../../../shared/_services/rest-api/third-party-controller/third-party-controller.service';
import { NotificationService } from '../../../../../shared/services/notification/notification.service';
import { of, throwError } from 'rxjs';

describe('SystemRecordAddThirdPartyComponent', () => {
  let component: SystemRecordAddThirdPartyComponent;
  let fixture: ComponentFixture<SystemRecordAddThirdPartyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemRecordAddThirdPartyComponent],
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
    fixture = TestBed.createComponent(SystemRecordAddThirdPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initNotificationServiceSubscription()', () => {
    it('should call initNotificationServiceSubscription() correctly - getData/valid', inject(
      [NotificationService, ThirdPartyControllerService],
      (
        notificationService: NotificationService,
        thirdPartyService: ThirdPartyControllerService
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
          thirdPartyService,
          'createNewThirdPartyFull'
        ).and.returnValue(of(fakeRes));

        component.thirdPartyDetailsData = {
          vendorName: 'vendorName',
          companyEntityResponses: [
            {
              items: [
                {
                  selected: true,
                  value: 'value1'
                },
                {
                  selected: false,
                  value: 'value2'
                }
              ]
            },
            {
              items: [
                {
                  selected: true,
                  value: 'value3'
                },
                {
                  selected: false,
                  value: 'value4'
                }
              ]
            }
          ],
          industrySectors: [
            {
              id: 'id1'
            },
            {
              id: 'id2'
            }
          ],
          vendorOrPartner: {
            id: 'id'
          },
          customEntityType: {
            value: 'VENDOR'
          },
          ccpaQuestionIds: ['id1', 'id2', '']
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

  describe('handleSaveAddingThirdParty()', () => {
    it('should call handleSaveAddingThirdParty()', inject(
      [TaModal, ThirdPartyControllerService],
      (taModal: TaModal, thirdPartyService: ThirdPartyControllerService) => {
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
        const thirdPartySpy = spyOn(
          thirdPartyService,
          'createNewThirdPartyFull'
        ).and.returnValue(of(fakeRes));

        component.thirdPartyDetailsData = {
          vendorName: 'vendorName',
          companyEntityResponses: [],
          industrySectors: [],
          vendorOrPartner: {
            id: 'id'
          },
          customEntityType: {
            value: 'value'
          }
        };

        component.handleSaveAddingThirdParty();
        fixture.detectChanges();

        expect(modalSpy).toHaveBeenCalledTimes(1);

        fakeModal.result.then(() => {
          expect(thirdPartySpy).toHaveBeenCalledTimes(1);
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

        component.handleSaveAddingThirdParty();
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
      [TaModal, ThirdPartyControllerService, ToastService],
      (
        taModal: TaModal,
        thirdPartyService: ThirdPartyControllerService,
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
        const thirdPartySpy = spyOn(
          thirdPartyService,
          'createNewThirdPartyFull'
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
          expect(thirdPartySpy).toHaveBeenCalledTimes(0);
          expect(toastClearSpy).toHaveBeenCalledTimes(1);
          expect(toastErrorSpy).toHaveBeenCalledTimes(1);
        });
      }
    ));
    it('should call handleCancelAdding() - open modal and confirm/add', inject(
      [TaModal, ThirdPartyControllerService, ToastService],
      (
        taModal: TaModal,
        thirdPartyService: ThirdPartyControllerService,
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
        const thirdPartySpy = spyOn(
          thirdPartyService,
          'createNewThirdPartyFull'
        ).and.returnValue(of(fakeRes));
        const toastClearSpy = spyOn(toastService, 'clear');
        const toastErrorSpy = spyOn(toastService, 'error');
        const toastSuccessSpy = spyOn(toastService, 'success');

        component.isCurrentFormDirty = true;
        component.isCurrentFormValid = true;
        component.thirdPartyDetailsData = {
          vendorName: 'vendorName',
          companyEntityResponses: [
            {
              items: [
                {
                  selected: true,
                  value: 'value1'
                },
                {
                  selected: false,
                  value: 'value2'
                }
              ]
            },
            {
              items: [
                {
                  selected: true,
                  value: 'value3'
                },
                {
                  selected: false,
                  value: 'value4'
                }
              ]
            }
          ],
          industrySectors: [
            {
              id: 'id1'
            },
            {
              id: 'id2'
            }
          ],
          vendorOrPartner: {
            id: 'id'
          },
          customEntityType: {
            value: 'VENDOR'
          },
          ccpaQuestionIds: ['id1', 'id2', '']
        };

        component.handleCancelAdding();
        fixture.detectChanges();

        // expect
        expect(discardedSpy).toHaveBeenCalledTimes(0);
        expect(modalSpy).toHaveBeenCalledTimes(1);

        fakeModal.result.then(() => {
          expect(thirdPartySpy).toHaveBeenCalledTimes(1);
          expect(toastClearSpy).toHaveBeenCalledTimes(0);
          expect(toastErrorSpy).toHaveBeenCalledTimes(0);
          expect(toastSuccessSpy).toHaveBeenCalledTimes(1);
        });
      }
    ));
    it('should call handleCancelAdding() - open modal and confirm/add/error', inject(
      [TaModal, ThirdPartyControllerService, ToastService],
      (
        taModal: TaModal,
        thirdPartyService: ThirdPartyControllerService,
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
        const thirdPartySpy = spyOn(
          thirdPartyService,
          'createNewThirdPartyFull'
        ).and.returnValue(throwError(fakeErr));
        const toastClearSpy = spyOn(toastService, 'clear');
        const toastErrorSpy = spyOn(toastService, 'error');
        const toastSuccessSpy = spyOn(toastService, 'success');

        component.isCurrentFormDirty = true;
        component.isCurrentFormValid = true;
        component.thirdPartyDetailsData = {
          vendorName: 'vendorName',
          companyEntityResponses: [],
          industrySectors: [],
          vendorOrPartner: {
            id: 'id'
          },
          customEntityType: {
            value: 'value'
          }
        };
        component.handleCancelAdding();
        fixture.detectChanges();

        // expect
        expect(discardedSpy).toHaveBeenCalledTimes(0);
        expect(modalSpy).toHaveBeenCalledTimes(1);

        fakeModal.result.then(() => {
          expect(thirdPartySpy).toHaveBeenCalledTimes(1);
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
      expect(component.thirdPartyDetailsData).toEqual(event.value);
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
      component.thirdPartyDetailsData = 'data';

      component.getFormData(event);
      fixture.detectChanges();

      expect(component.isDisabledSave).toEqual(!event.valid);
      expect(component.isCurrentFormValid).toEqual(event.valid);
      expect(component.isCurrentFormDirty).toEqual(event.dirty);
      expect(spy).toHaveBeenCalledTimes(0);
      expect(component.thirdPartyDetailsData).toEqual('data');
    });
  });

  describe('setContactValue()', () => {
    it('should call setContactValue() correctly - non-empty value', () => {
      const event = {
        id: 'fake_id'
      };
      component.setContactValue(event);
      fixture.detectChanges();

      expect(component.contactId).toEqual(event.id);
    });
    it('should call setContactValue() correctly - empty value', () => {
      const event = undefined;
      component.setContactValue(event);
      fixture.detectChanges();

      expect(component.contactId).toEqual('');
    });
    it('should call setContactValue() correctly - emit true', () => {
      const spy = spyOn(component.contentChanged, 'emit');
      component.setContactValue(true);
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
