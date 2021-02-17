import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRevalidationDateEditComponent } from './modal-revalidation-date-edit.component';
import {
  TaActiveModal,
  TableService,
  TaButtonsModule,
  TaCheckboxModule,
  TaDatepickerModule,
  TaDropdownModule,
  TaModalModule,
  TaSvgIconModule,
  TaTableModule,
  TaTagsModule,
  TaToastModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
// tslint:disable-next-line:max-line-length
import { RevalidationNotificationControllerService } from 'src/app/shared/_services/rest-api/revalidation-notification-controller/revalidation-notification-controller.service';
// tslint:disable-next-line:max-line-length
import { of, throwError } from 'rxjs';

describe('ModalRevalidationDateEditComponent', () => {
  let component: ModalRevalidationDateEditComponent;
  let fixture: ComponentFixture<ModalRevalidationDateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalRevalidationDateEditComponent],
      imports: [
        RouterTestingModule,
        TaModalModule,
        HttpClientTestingModule,
        TaSvgIconModule,
        TaButtonsModule,
        TaTableModule,
        TaTooltipModule,
        TaTagsModule,
        TaCheckboxModule,
        TaDatepickerModule,
        TaTagsModule,
        TaToastModule,
        TaDropdownModule,
        FormsModule
      ],
      providers: [TaActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRevalidationDateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initData()', () => {
    it('should call initData() correctly - success', () => {
      const revalidationDetails = {
        id: '92c69571-f0fb-4178-8353-38c601542392',
        date: '2023-11-26T00:00:00.000+0000',
        recurrence: 'Repeats every 3 years',
        comments: 'comment',
        notificationTask: false,
        notificationAlert: false,
        notificationEmail: true,
        notificationTimings: [
          {
            id: 'ONE_MONTH',
            name: '1 month prior to due date'
          }
        ],
        users: [
          {
            userId: 'userId',
            fullName: 'fullName',
            email: 'email@trustarc.com'
          }
        ]
      };
      const recurrenceOptions = [
        {
          id: 'NONE',
          name: 'Does not repeat'
        },
        {
          id: 'EVERY_YEAR',
          name: 'Repeats annually'
        }
      ];
      const timingOptions = [
        {
          id: 'THREE_MONTH',
          name: '3 months prior to due date'
        },
        {
          id: 'ONE_MONTH',
          name: '1 month prior to due date'
        },
        {
          id: 'DUE_DATE',
          name: 'On due date'
        },
        {
          id: 'ONE_WEEK',
          name: '1 week prior to due date'
        }
      ];
      const usersRes = {
        content: [
          {
            userId: 'id1',
            email: 'email1',
            fullName: 'fullName1'
          },
          {
            userId: 'id2',
            email: 'email2',
            fullName: 'fullName2'
          },
          {
            userId: 'id3',
            email: 'email3',
            fullName: 'fullName3'
          }
        ],
        last: true
      };
      const revalidationService = TestBed.get(
        RevalidationNotificationControllerService
      );

      const getRevalidationDetailsSpy = spyOn(
        revalidationService,
        'getRevalidationDetails'
      ).and.returnValue(of(revalidationDetails));
      const getRecurrenceOptionsSpy = spyOn(
        revalidationService,
        'getRecurrenceOptions'
      ).and.returnValue(of(recurrenceOptions));
      const getTimingOptionsSpy = spyOn(
        revalidationService,
        'getTimingOptions'
      ).and.returnValue(of(timingOptions));
      const getUsersSpy = spyOn(component, 'getUsers').and.returnValue(
        of(usersRes)
      );
      const mapUsersSpy = spyOn(component, 'mapUsers');

      component.initData();
      fixture.detectChanges();

      expect(getRevalidationDetailsSpy).toHaveBeenCalledTimes(1);
      expect(getRecurrenceOptionsSpy).toHaveBeenCalledTimes(1);
      expect(getTimingOptionsSpy).toHaveBeenCalledTimes(1);
      expect(getUsersSpy).toHaveBeenCalledTimes(1);
      expect(mapUsersSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('dismiss()', () => {
    it('should call dismiss() correctly', () => {
      const activeModal = TestBed.get(TaActiveModal);
      const activeModalSpy = spyOn(activeModal, 'dismiss');

      component.dismiss();
      fixture.detectChanges();

      expect(activeModalSpy).toHaveBeenCalledTimes(1);
      expect(activeModalSpy).toHaveBeenCalledWith('Cancel');
    });
  });

  describe('sortContacts()', () => {
    it('should call sortContacts() correctly - no order', () => {
      component.contacts = [
        {
          userId: 'id2',
          email: 'email2',
          fullName: 'fullName2'
        },
        {
          userId: 'id1',
          email: 'email1',
          fullName: 'fullName1'
        },
        {
          userId: 'id3',
          email: 'email3',
          fullName: 'fullName3'
        }
      ];

      component.sortContacts('email', '');
      fixture.detectChanges();

      expect(component.contacts[0]).toEqual(
        jasmine.objectContaining({
          userId: 'id1',
          email: 'email1',
          fullName: 'fullName1'
        })
      );
    });
    it('should call sortContacts() correctly - asc', () => {
      component.contacts = [
        {
          userId: 'id2',
          email: 'email2',
          fullName: 'fullName2'
        },
        {
          userId: 'id1',
          email: 'email1',
          fullName: 'fullName1'
        },
        {
          userId: 'id3',
          email: 'email3',
          fullName: 'fullName3'
        }
      ];

      component.sortContacts('email', 'asc');
      fixture.detectChanges();

      expect(component.contacts[0]).toEqual(
        jasmine.objectContaining({
          userId: 'id1',
          email: 'email1',
          fullName: 'fullName1'
        })
      );
    });
    it('should call sortContacts() correctly - desc', () => {
      component.contacts = [
        {
          userId: 'id2',
          email: 'email2',
          fullName: 'fullName2'
        },
        {
          userId: 'id1',
          email: 'email1',
          fullName: 'fullName1'
        },
        {
          userId: 'id3',
          email: 'email3',
          fullName: 'fullName3'
        }
      ];

      component.sortContacts('email', 'desc');
      fixture.detectChanges();

      expect(component.contacts[0]).toEqual(
        jasmine.objectContaining({
          userId: 'id3',
          email: 'email3',
          fullName: 'fullName3'
        })
      );
    });
  });

  describe('deleteContacts()', () => {
    it('should call deleteContacts() correctly', () => {
      const selectedUsers = [
        {
          userId: 'id1'
        },
        {
          userId: 'id2'
        }
      ];
      const tableService = TestBed.get(TableService);
      spyOn(tableService, 'getSelected').and.returnValue(selectedUsers);

      const clearAllSelectedSpy = spyOn(
        tableService,
        'clearAllSelected'
      ).and.returnValue(selectedUsers);

      const mapUsersSpy = spyOn(component, 'mapUsers');

      component.contacts = [
        {
          userId: 'id1'
        },
        {
          userId: 'id2'
        },
        {
          userId: 'id3'
        }
      ];

      component.deleteContacts();
      fixture.detectChanges();

      expect(clearAllSelectedSpy).toHaveBeenCalledTimes(1);
      expect(mapUsersSpy).toHaveBeenCalledTimes(1);
      expect(component.contacts.length).toEqual(1);
      expect(component.contacts[0].userId).toEqual('id3');
    });
  });

  describe('onSearchUsers()', () => {
    it('should call onSearchUsers() correctly - success', () => {
      const event = 'event';
      const fakeRes = {
        content: [
          {
            userId: 'id1',
            email: 'email1',
            fullName: 'fullName1'
          },
          {
            userId: 'id2',
            email: 'email2',
            fullName: 'fullName2'
          },
          {
            userId: 'id3',
            email: 'email3',
            fullName: 'fullName3'
          }
        ],
        last: true
      };

      const getUsersSpy = spyOn(component, 'getUsers').and.returnValue(
        of(fakeRes)
      );
      const mapUsersSpy = spyOn(component, 'mapUsers');

      component.onSearchUsers(event);
      fixture.detectChanges();

      expect(getUsersSpy).toHaveBeenCalledTimes(1);
      expect(mapUsersSpy).toHaveBeenCalledTimes(1);
      expect(component.searchTerm).toEqual(event);
      expect(component.userPageNumber).toEqual(0);
      expect(component.isLast).toEqual(fakeRes.last);
      expect(component.totalUsers).toEqual(
        jasmine.arrayContaining(fakeRes.content)
      );
    });
    it('should call onSearchUsers() correctly - error', () => {
      const event = 'event';
      const fakeError = 'fakeError';
      component.totalUsers = [];

      const getUsersSpy = spyOn(component, 'getUsers').and.returnValue(
        throwError(fakeError)
      );
      const mapUsersSpy = spyOn(component, 'mapUsers');

      component.onSearchUsers(event);
      fixture.detectChanges();

      expect(getUsersSpy).toHaveBeenCalledTimes(1);
      expect(mapUsersSpy).toHaveBeenCalledTimes(0);
      expect(component.searchTerm).toEqual(event);
      expect(component.userPageNumber).toEqual(0);
      expect(component.isLast).toEqual(false);
      expect(component.totalUsers).toEqual(jasmine.arrayContaining([]));
    });
  });

  describe('buildPutRequest()', () => {
    it('should call buildPutRequest() correctly', () => {
      component.alertsEnabled = true;
      component.baseRecordId = 'baseRecordId';
      component.revalidationDateModel = { year: 2020, month: 12, day: 3 };
      component.comment = 'comment';
      component.optionsNotificationType = [
        {
          id: 'notificationEmail',
          name: 'Email reminder',
          checked: true
        },
        {
          id: 'notificationTask',
          name: 'In-app task',
          checked: true
        },
        {
          id: 'notificationAlert',
          name: 'In-app alert',
          checked: true
        }
      ];
      component.optionsNotificationTiming = [
        {
          id: 'id1',
          name: 'name1',
          checked: true
        },
        {
          id: 'id2',
          name: 'name2',
          checked: false
        }
      ];
      component.selectedOptionRecurrence = {
        id: 'id',
        name: 'name'
      };
      component.contacts = [
        {
          userId: 'id1',
          email: 'email',
          fullName: 'fullName'
        }
      ];

      spyOn(component, 'getDateISO').and.returnValue(
        '2020-12-03T08:00:00.000Z'
      );

      const request = component.buildPutRequest();
      fixture.detectChanges();

      expect(request).toEqual({
        id: 'baseRecordId',
        date: '2020-12-03T08:00:00.000Z',
        comments: 'comment',
        notificationEmail: true,
        notificationTask: true,
        notificationAlert: true,
        notificationTimings: [
          {
            id: 'id1',
            name: 'name1',
            checked: true
          }
        ],
        recurrence: 'name',
        users: [
          {
            userId: 'id1',
            email: 'email',
            fullName: 'fullName'
          }
        ]
      });
    });
  });

  describe('getDateISO()', () => {
    it('should call getDateISO() correctly', () => {
      component.revalidationDateModel = {
        year: 2020,
        month: 12,
        day: 3
      };

      const dateISO = component.getDateISO();
      fixture.detectChanges();

      expect(dateISO).toEqual(new Date(2020, 11, 3).toISOString());
    });
    it('should call getDateISO() correctly', () => {
      component.revalidationDateModel = undefined;

      const dateISO = component.getDateISO();
      fixture.detectChanges();

      expect(dateISO).toEqual(null);
    });
  });

  describe('getMinDate()', () => {
    it('should call getMinDate() correctly', () => {
      const minDate = component.getMinDate();
      fixture.detectChanges();

      const now = new Date();

      const today = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate()
      };

      expect(minDate).toEqual(jasmine.objectContaining(today));
    });
  });

  describe('populateNotificationTypeOptions(details)', () => {
    it('populateNotificationTypeOptions(details) called correctly, details true', () => {
      const details = {
        notificationEmail: true,
        notificationTask: true,
        notificationAlert: true
      };

      component.alertsEnabled = true;
      const results = component.populateNotificationTypeOptions(details);
      fixture.detectChanges();

      expect(results.length).toEqual(3);
      expect(results).toEqual(
        jasmine.objectContaining([
          {
            id: 'notificationTask',
            name: 'In-app task', // [i18n-tobeinternationalized]
            checked: true
          },
          {
            id: 'notificationEmail',
            name: 'Email reminder',
            checked: true
          },
          {
            id: 'notificationAlert',
            name: 'In-app alert', // [i18n-tobeinternationalized]
            checked: true
          }
        ])
      );
    });
    it('populateNotificationTypeOptions(details) called correctly, details false', () => {
      const details = {
        notificationEmail: false,
        notificationTask: false,
        notificationAlert: false
      };

      component.alertsEnabled = true;
      const results = component.populateNotificationTypeOptions(details);
      fixture.detectChanges();

      expect(results.length).toEqual(3);
      expect(results).toEqual(
        jasmine.objectContaining([
          {
            id: 'notificationTask',
            name: 'In-app task', // [i18n-tobeinternationalized]
            checked: false
          },
          {
            id: 'notificationEmail',
            name: 'Email reminder',
            checked: false
          },
          {
            id: 'notificationAlert',
            name: 'In-app alert', // [i18n-tobeinternationalized]
            checked: false
          }
        ])
      );
    });
    it('populateNotificationTypeOptions(details) called correctly details null', () => {
      const details = null;

      component.alertsEnabled = false;
      const results = component.populateNotificationTypeOptions(details);
      fixture.detectChanges();

      expect(results.length).toEqual(2);
      expect(results).toEqual(
        jasmine.objectContaining([
          {
            id: 'notificationTask',
            name: 'In-app task', // [i18n-tobeinternationalized]
            checked: false
          },
          {
            id: 'notificationEmail',
            name: 'Email reminder', // [i18n-tobeinternationalized]
            checked: false
          }
        ])
      );
    });
  });

  describe('populateNotificationTimingOptions(details, options)', () => {
    it('populateNotificationTimingOptions(details, options)', () => {
      const details = {
        notificationTimings: [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }]
      };

      const options = [
        {
          id: 'id1',
          name: 'name1',
          checked: false
        },
        {
          id: 'id2',
          name: 'name2',
          checked: false
        },
        {
          id: 'id3',
          name: 'name3',
          checked: false
        }
      ];

      const results = component.populateNotificationTimingOptions(
        details,
        options
      );
      fixture.detectChanges();

      const checked = results.map(result => result.checked);

      expect(checked).toEqual(jasmine.objectContaining([true, true, true]));
    });
    it('populateNotificationTimingOptions(details, options - empty details)', () => {
      const details = null;

      const options = [
        {
          id: 'id1',
          name: 'name1',
          checked: false
        },
        {
          id: 'id2',
          name: 'name2',
          checked: false
        },
        {
          id: 'id3',
          name: 'name3',
          checked: false
        }
      ];

      const results = component.populateNotificationTimingOptions(
        details,
        options
      );
      fixture.detectChanges();

      const checked = results.map(result => result.checked);

      expect(checked).toEqual(jasmine.objectContaining([]));
    });
  });

  describe('getSelectedOptionRecurrence(details, options)', () => {
    it('getSelectedOptionRecurrence(details, options) called correct', () => {
      const options = [
        {
          name: 'name'
        }
      ];
      const details = {
        recurrence: 'name'
      };

      const compare = component.getSelectedOptionRecurrence(details, options);
      fixture.detectChanges();

      expect(compare).toEqual(
        jasmine.objectContaining({
          name: 'name'
        })
      );
    });
    it('getSelectedOptionRecurrence(details, options) called correct, no details', () => {
      const options = [
        {
          name: 'name'
        }
      ];
      const details = {
        recurrence: 'recurrence'
      };

      const compare = component.getSelectedOptionRecurrence(details, options);
      fixture.detectChanges();

      expect(compare).toEqual(undefined);
    });
  });

  describe('populateDate() ', () => {
    xit('should call populateDate() correctly', () => {
      const data = '2020-11-26T00:00:00.000+0000';

      const date = component.populateDate(data);
      fixture.detectChanges();

      expect(date).toEqual(
        jasmine.objectContaining({
          year: 2020,
          month: 11,
          day: 26
        })
      );
    });
  });

  describe('getSelectedNotificationTimings()', () => {
    it('getSelectedNotificationTimings() correctly - non empty selected', () => {
      component.optionsNotificationTiming = [
        { id: 'id1', name: 'name1', checked: true },
        { id: 'id2', name: 'name2', checked: false },
        { id: 'id3', name: 'name3', checked: false }
      ];

      const selected = component.getSelectedNotificationTimings();
      fixture.detectChanges();

      expect(selected.length).toEqual(1);
    });
  });

  describe('selectRecurrence() ', () => {
    it('should call selectRecurrence() correctly', () => {
      const opt = {
        id: 'id',
        name: 'name'
      };
      component.selectRecurrence(opt);
      fixture.detectChanges();
      expect(component.selectedOptionRecurrence).toEqual(
        jasmine.objectContaining({
          id: 'id',
          name: 'name'
        })
      );
    });
  });

  describe('selectToday() ', () => {
    it('should call selectToday() correctly', () => {
      component.selectToday();
      fixture.detectChanges();

      const now = new Date();

      const today = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate()
      };

      expect(component.revalidationDateModel).toEqual(
        jasmine.objectContaining(today)
      );
    });
  });

  describe('clearDate() ', () => {
    it('should call clearDate() correctly', () => {
      component.clearDate();
      fixture.detectChanges();
      expect(component.revalidationDateModel).toEqual(null);
    });
  });

  describe('isSaveDisabled()', () => {
    it('should call isSaveDisabled() correctly', () => {
      component.revalidationDateModel = undefined;
      spyOn(component, 'getSelectedNotificationTimings').and.returnValue([]);
      spyOn(component, 'isInvalidOptionsNotificationType').and.returnValue(
        true
      );

      const isSaveDisabled = component.isSaveDisabled();
      fixture.detectChanges();

      expect(isSaveDisabled).toEqual(true);
    });
    it('should call isSaveDisabled() correctly - disabled no timings', () => {
      component.revalidationDateModel = {
        year: 2020,
        month: 11,
        day: 11
      };
      spyOn(component, 'getSelectedNotificationTimings').and.returnValue([]);
      spyOn(component, 'isInvalidOptionsNotificationType').and.returnValue(
        true
      );

      const isSaveDisabled = component.isSaveDisabled();
      fixture.detectChanges();

      expect(isSaveDisabled).toEqual(true);
    });
    it('should call isSaveDisabled() correctly - disabled no notification type', () => {
      component.revalidationDateModel = {
        year: 2020,
        month: 11,
        day: 11
      };
      spyOn(component, 'getSelectedNotificationTimings').and.returnValue([
        'timing'
      ]);
      spyOn(component, 'isInvalidOptionsNotificationType').and.returnValue(
        true
      );

      const isSaveDisabled = component.isSaveDisabled();
      fixture.detectChanges();

      expect(isSaveDisabled).toEqual(true);
    });
  });

  describe('isInvalidOptionsNotificationType()', () => {
    it('isInvalidOptionsNotificationType() correctly - non empty selected, empty contacts', () => {
      component.optionsNotificationType = [
        { id: 'id1', name: 'name1', checked: true },
        { id: 'id2', name: 'name2', checked: false },
        { id: 'id3', name: 'name3', checked: false }
      ];

      component.contacts = [];

      const isInvalidOptions = component.isInvalidOptionsNotificationType();
      fixture.detectChanges();

      expect(isInvalidOptions).toEqual(true);
    });
    it('isInvalidOptionsNotificationType() correctly - empty selected, empty contacts', () => {
      component.optionsNotificationType = [
        { id: 'id1', name: 'name1', checked: false },
        { id: 'id2', name: 'name2', checked: false },
        { id: 'id3', name: 'name3', checked: false }
      ];

      component.contacts = [];

      const isInvalidOptions = component.isInvalidOptionsNotificationType();
      fixture.detectChanges();

      expect(isInvalidOptions).toEqual(true);
    });
    it('isInvalidOptionsNotificationType() correctly - empty selected, non empty contacts', () => {
      component.optionsNotificationType = [
        { id: 'id1', name: 'name1', checked: false },
        { id: 'id2', name: 'name2', checked: false },
        { id: 'id3', name: 'name3', checked: false }
      ];

      component.contacts = [
        {
          userId: 'id1'
        },
        {
          userId: 'id2'
        },
        {
          userId: 'id3'
        }
      ];

      const isInvalidOptions = component.isInvalidOptionsNotificationType();
      fixture.detectChanges();

      expect(isInvalidOptions).toEqual(true);
    });
    it('isInvalidOptionsNotificationType() correctly - non empty selected, non empty contacts', () => {
      component.optionsNotificationType = [
        { id: 'id1', name: 'name1', checked: true },
        { id: 'id2', name: 'name2', checked: false },
        { id: 'id3', name: 'name3', checked: false }
      ];

      component.contacts = [
        {
          userId: 'id1'
        },
        {
          userId: 'id2'
        },
        {
          userId: 'id3'
        }
      ];

      const isInvalidOptions = component.isInvalidOptionsNotificationType();
      fixture.detectChanges();

      expect(isInvalidOptions).toEqual(false);
    });
  });

  describe('onScroll()', () => {
    it('should call onScroll() correctly - success', () => {
      component.userPageNumber = 1;
      component.isLast = false;
      component.isLoading = false;
      const event = {
        target: {
          scrollTop: 100,
          offsetHeight: 20,
          scrollHeight: 120
        }
      };

      const totalUsers = [
        {
          userId: 'id1',
          email: 'email1',
          fullName: 'fullName1'
        },
        {
          userId: 'id2',
          email: 'email2',
          fullName: 'fullName2'
        },
        {
          userId: 'id3',
          email: 'email3',
          fullName: 'fullName3'
        }
      ];
      component.totalUsers = totalUsers;

      const fakeRes = {
        content: [
          {
            userId: 'id4',
            email: 'email4',
            fullName: 'fullName4'
          },
          {
            userId: 'id5',
            email: 'email5',
            fullName: 'fullName5'
          },
          {
            userId: 'id6',
            email: 'email6',
            fullName: 'fullName6'
          }
        ],
        last: true
      };

      const getUsersSpy = spyOn(component, 'getUsers').and.returnValue(
        of(fakeRes)
      );
      const mapUsersSpy = spyOn(component, 'mapUsers');

      component.onScroll(event);
      fixture.detectChanges();

      expect(getUsersSpy).toHaveBeenCalledTimes(1);
      expect(mapUsersSpy).toHaveBeenCalledTimes(1);
      expect(component.isLast).toEqual(fakeRes.last);
      expect(component.isLoading).toEqual(false);
      expect(component.userPageNumber).toEqual(2);
      expect(component.totalUsers).toEqual(
        jasmine.arrayContaining([...totalUsers, ...fakeRes.content])
      );
    });
    it('should call onScroll() correctly - error', () => {
      component.userPageNumber = 1;
      component.isLast = false;
      component.isLoading = false;
      const event = {
        target: {
          scrollTop: 100,
          offsetHeight: 20,
          scrollHeight: 120
        }
      };

      const totalUsers = [
        {
          userId: 'id1',
          email: 'email1',
          fullName: 'fullName1'
        },
        {
          userId: 'id2',
          email: 'email2',
          fullName: 'fullName2'
        },
        {
          userId: 'id3',
          email: 'email3',
          fullName: 'fullName3'
        }
      ];
      component.totalUsers = totalUsers;

      const fakeError = 'fakeError';

      const getUsersSpy = spyOn(component, 'getUsers').and.returnValue(
        throwError(fakeError)
      );
      const mapUsersSpy = spyOn(component, 'mapUsers');

      component.onScroll(event);
      fixture.detectChanges();

      expect(getUsersSpy).toHaveBeenCalledTimes(1);
      expect(mapUsersSpy).toHaveBeenCalledTimes(0);
      expect(component.isLast).toEqual(false);
      expect(component.isLoading).toEqual(false);
      expect(component.userPageNumber).toEqual(1);
      expect(component.totalUsers).toEqual(
        jasmine.arrayContaining([...totalUsers])
      );
    });
  });

  describe('onPickUser(user)', () => {
    it('onPickUser(user) called with arguments (user) user not found and length < 15', () => {
      const contacts = [
        {
          userId: 'id1'
        },
        {
          userId: 'id2'
        },
        {
          userId: 'id3'
        }
      ];

      component.contacts = [...contacts];

      const user = { id: 'id', email: 'email', name: 'name' };

      component.onPickUser(user);
      fixture.detectChanges();

      expect(component.contacts.length).toEqual(contacts.length + 1);
    });
    it('onPickUser(user) called with arguments (user) user not found and length === 15', () => {
      const contacts = [];
      for (let i = 1; i <= 15; i++) {
        contacts.push({
          userId: `id${i}`
        });
      }

      component.contacts = contacts;

      const user = { id: 'id', email: 'email', name: 'name' };

      component.onPickUser(user);
      fixture.detectChanges();

      expect(component.contacts.length).toEqual(15);
    });
    it('onPickUser(user) called with arguments (user) user found', () => {
      const contacts = [
        {
          userId: 'id1'
        },
        {
          userId: 'id2'
        },
        {
          userId: 'id3'
        }
      ];

      component.contacts = contacts;

      const user = { id: 'id1', email: 'email', name: 'name' };

      component.onPickUser(user);
      fixture.detectChanges();

      expect(component.contacts.length).toEqual(contacts.length);
    });
  });

  describe('submit()', () => {
    it('should call submit() correctly', () => {
      const revalidationService = TestBed.get(
        RevalidationNotificationControllerService
      );
      const activeModal = TestBed.get(TaActiveModal);

      const fakeRes = 'fakeRes';

      const buildPutRequestSpy = spyOn(component, 'buildPutRequest');
      const revalidationServiceSpy = spyOn(
        revalidationService,
        'updateRevalidationDetails'
      ).and.returnValue(of(fakeRes));
      const activeModalSpy = spyOn(activeModal, 'close');

      component.submit();
      fixture.detectChanges();

      expect(buildPutRequestSpy).toHaveBeenCalledTimes(1);
      expect(revalidationServiceSpy).toHaveBeenCalledTimes(1);
      expect(activeModalSpy).toHaveBeenCalledTimes(1);
      expect(activeModalSpy).toHaveBeenCalledWith(fakeRes);
    });

    it('should call submit() error', () => {
      const revalidationService = TestBed.get(
        RevalidationNotificationControllerService
      );
      const activeModal = TestBed.get(TaActiveModal);
      const activeModalSpy = spyOn(activeModal, 'close');

      const fakeErr = 'fakeErr';

      const buildPutRequestSpy = spyOn(component, 'buildPutRequest');
      const revalidationServiceSpy = spyOn(
        revalidationService,
        'updateRevalidationDetails'
      ).and.returnValue(throwError(fakeErr));

      component.submit();
      fixture.detectChanges();

      expect(buildPutRequestSpy).toHaveBeenCalledTimes(1);
      expect(revalidationServiceSpy).toHaveBeenCalledTimes(1);
      expect(activeModalSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('pageNumber controls', () => {
    it('should call incrementPageNumber() correctly', () => {
      component.userPageNumber = 1;
      component.incrementPageNumber();
      fixture.detectChanges();
      expect(component.userPageNumber).toEqual(2);
    });
    it('should call decrementPageNumber() correctly', () => {
      component.userPageNumber = 2;
      component.decrementPageNumber();
      fixture.detectChanges();
      expect(component.userPageNumber).toEqual(1);
    });
    it('should call resetPageNumber() correctly', () => {
      component.userPageNumber = 1;
      component.resetPageNumber();
      fixture.detectChanges();
      expect(component.userPageNumber).toEqual(0);
    });
  });

  describe('mapUsers()', () => {
    it('should call mapUsers() correctly', () => {
      component.contacts = [
        {
          userId: 'id1'
        },
        {
          userId: 'id2'
        }
      ];

      component.totalUsers = [
        {
          id: 'id1',
          checked: false
        },
        {
          id: 'id2',
          checked: false
        },
        {
          id: 'id3',
          checked: false
        }
      ];

      component.mapUsers();
      fixture.detectChanges();

      const totalUsersChecked = component.totalUsers.map(user => user.checked);
      expect(totalUsersChecked).toEqual([true, true, false]);
    });
  });
});
