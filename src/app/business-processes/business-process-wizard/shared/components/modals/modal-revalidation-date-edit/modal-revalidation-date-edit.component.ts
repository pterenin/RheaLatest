import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  TaDateStruct,
  TaCalendar,
  TaActiveModal,
  TaDate,
  TableService,
  ToastService
} from '@trustarc/ui-toolkit';
// tslint:disable-next-line:max-line-length
import { RevalidationNotificationControllerService } from 'src/app/shared/_services/rest-api/revalidation-notification-controller/revalidation-notification-controller.service';
import {
  NotificationTimingsInterface,
  NotificationTypeOptionsInterface,
  RecurrenceOptionsInterface,
  RevalidationDetailsInterface
} from 'src/app/shared/_interfaces/rest-api/revalidation-notification-controller/revalidation-notification-controller';
import { UserService } from 'src/app/shared/services/user/user.service';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { forkJoin, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@AutoUnsubscribe(['_initData$', '_getUsers$', '_eventRequestRef$'])
@Component({
  selector: 'ta-modal-revalidation-date-edit',
  templateUrl: './modal-revalidation-date-edit.component.html',
  styleUrls: ['./modal-revalidation-date-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalRevalidationDateEditComponent implements OnInit, OnDestroy {
  @Input() public alertsEnabled = false;

  private readonly optionsRecurrenceDefault = 'Does not repeat';

  gridID: 'revalidation-date-edit-contacts';
  baseRecordId: string;

  private _initData$: Subscription;
  private _getUsers$: Subscription;
  private _eventRequestRef$: Subscription = null;

  public isLoading: boolean;

  iconTypeTooltip = 'information-circle';
  optionsRecurrence: RecurrenceOptionsInterface[] = [];
  optionsNotificationType: NotificationTypeOptionsInterface[] = [];
  optionsNotificationTiming: NotificationTimingsInterface[] = [];

  selectedOptionRecurrence: RecurrenceOptionsInterface;
  date: { year: number; month: number };
  revalidationDateModel: TaDateStruct;
  revalidationDateFromServer: string;
  minDate: TaDateStruct;

  comment = '';
  searchTerm = '';
  userPageNumber = 0;
  userPageSize = 20;
  isLast = false;
  contacts: any[] = [];
  totalUsers: any[] = [];

  constructor(
    private calendar: TaCalendar,
    private activeModal: TaActiveModal,
    private userService: UserService,
    private tableService: TableService,
    private toastService: ToastService,
    private revalidationNotificationControllerService: RevalidationNotificationControllerService
  ) {}

  ngOnInit() {
    this.initData();
    this.initTableSubscriptions();
  }

  public initData() {
    if (this._initData$) {
      this._initData$.unsubscribe();
    }

    this._initData$ = forkJoin([
      this.revalidationNotificationControllerService.getRevalidationDetails(
        this.baseRecordId
      ),
      this.revalidationNotificationControllerService.getRecurrenceOptions(),
      this.revalidationNotificationControllerService.getTimingOptions(),
      this.getUsers('', this.userPageNumber, this.userPageSize)
    ]).subscribe(([details, optionsRecurrence, optionsTiming, users]) => {
      const date = details ? details.date : null;
      this.revalidationDateFromServer = date;
      this.revalidationDateModel = this.getRevalidationDateModel(date);
      this.minDate = this.getRevalidationDateMin();

      this.comment = details ? details.comments : '';
      this.contacts = details ? details.users : [];
      this.optionsRecurrence = optionsRecurrence;
      this.selectedOptionRecurrence = this.getSelectedOptionRecurrence(
        details,
        optionsRecurrence
      );
      this.optionsNotificationType = this.populateNotificationTypeOptions(
        details
      );
      this.optionsNotificationTiming = this.populateNotificationTimingOptions(
        details,
        optionsTiming
      );

      const { content, last } = users;
      this.totalUsers = content;
      this.isLast = last;
      this.mapUsers();
    });
  }

  public initTableSubscriptions() {
    if (this._eventRequestRef$) {
      this._eventRequestRef$.unsubscribe();
    }

    this._eventRequestRef$ = this.tableService
      .listenRequestEvents(this.gridID)
      .subscribe(req => {
        if (req['sortType']) {
          this.sortContacts(req['columnSort'], req['sortType']);
        }
      });
  }

  public sortContacts(column, type) {
    if (type === '' || type === 'asc') {
      this.contacts.sort((b, a) => {
        return b[column].toString().localeCompare(a[column].toString());
      });
    } else if (type === 'desc') {
      this.contacts.sort((a, b) => {
        return b[column].toString().localeCompare(a[column].toString());
      });
    }
  }

  public getUsers(searchTerm, pageNumber, size) {
    if (this._getUsers$) {
      this._getUsers$.unsubscribe();
    }

    return this.userService
      .getUsersResponse(searchTerm, pageNumber, size)
      .pipe(debounceTime(200));
  }

  public dismiss() {
    this.activeModal.dismiss('Cancel');
  }

  public isDeleteDisabled() {
    return (this.tableService.getSelected(this.gridID) || []).length === 0;
  }

  public deleteContacts() {
    const selectedIds = this.tableService
      .getSelected(this.gridID)
      .map(item => item.userId);

    this.contacts = this.contacts.filter(
      contact => !selectedIds.includes(contact.userId)
    );

    this.tableService.clearAllSelected(this.gridID);
    this.mapUsers();
  }

  public onSearchUsers(event = '') {
    if (this.searchTerm !== event) {
      this.searchTerm = event;
      this.resetPageNumber();
      this.isLast = false;

      this.getUsers(event, this.userPageNumber, this.userPageSize).subscribe(
        res => {
          const { content, last } = res;
          this.totalUsers = content;
          this.isLast = last;
          this.mapUsers();
        },
        err => {
          console.error(err);
        }
      );
    }
  }

  public getRevalidationDate() {
    if (this.revalidationDateModel) {
      const date = this.revalidationDateModel;
      return `${date.month}-${date.day}-${date.year}`;
    }

    if (this.revalidationDateFromServer) {
      const date = this.populateDate(this.revalidationDateFromServer);
      return `${date.month}-${date.day}-${date.year}`;
    }

    // [i18n-tobeinternationalized]
    return 'Choose date';
  }

  private isSelectedNotificationById(id) {
    const found = this.optionsNotificationType.find(item => item.id === id);
    return found.checked === true;
  }

  public buildPutRequest(): RevalidationDetailsInterface {
    const request: RevalidationDetailsInterface = {
      id: this.baseRecordId,
      date: this.getDateISO(),
      comments: this.comment,
      notificationEmail: this.isSelectedNotificationById('notificationEmail'),
      notificationTask: this.isSelectedNotificationById('notificationTask'),
      notificationTimings: this.getSelectedNotificationTimings(),
      recurrence: this.selectedOptionRecurrence
        ? this.selectedOptionRecurrence.name
        : this.optionsRecurrenceDefault,
      users: this.contacts
    };

    if (this.alertsEnabled) {
      request.notificationAlert = this.isSelectedNotificationById(
        'notificationAlert'
      );
    }

    return request;
  }

  public getDateISO() {
    if (this.revalidationDateModel) {
      const { year, month, day } = this.revalidationDateModel;
      return new Date(year, month - 1, day).toISOString();
    }

    return null;
  }

  public getMinDate() {
    return this.calendar.getToday();
  }

  public populateNotificationTypeOptions(details) {
    const options = [
      {
        id: 'notificationTask',
        name: 'In-app task', // [i18n-tobeinternationalized]
        checked: details ? details.notificationTask : false
      },
      {
        id: 'notificationEmail',
        name: 'Email reminder', // [i18n-tobeinternationalized]
        checked: details ? details.notificationEmail : false
      }
    ];

    if (this.alertsEnabled) {
      options.push({
        id: 'notificationAlert',
        name: 'In-app alert', // [i18n-tobeinternationalized]
        checked: details ? details.notificationAlert : false
      });
    }

    return options;
  }

  public populateNotificationTimingOptions(details, options) {
    const preselectedIds = details
      ? details.notificationTimings.map(item => item.id)
      : [];

    return options.map(option => {
      return {
        id: option.id,
        name: option.name,
        checked: preselectedIds.includes(option.id)
      };
    });
  }

  public getSelectedOptionRecurrence(details, options) {
    if (details) {
      return options.find(option => option.name === details.recurrence);
    }
  }

  public getRevalidationDateModel(data): TaDateStruct {
    if (data) {
      return this.populateDate(data);
    }
  }

  public getRevalidationDateMin(): TaDateStruct {
    return this.populateDate();
  }

  public populateDate(data?): TaDateStruct {
    let date;

    if (data) {
      const dateParsed = new Date(data);
      const offset = new Date().getTimezoneOffset();

      // Server is returning date in UTC, Date constructor parses in local time zone
      // so, this is needed in order to process server date correctly in UI
      const dateParsedUTC = Date.UTC(
        dateParsed.getUTCFullYear(),
        dateParsed.getUTCMonth(),
        dateParsed.getUTCDate(),
        dateParsed.getUTCHours() + offset / 60,
        dateParsed.getUTCMinutes(),
        dateParsed.getUTCSeconds()
      );

      date = new Date(dateParsedUTC);
    } else {
      date = new Date();
    }

    return new TaDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getUTCDate()
    );
  }

  public getSelectedNotificationTimings() {
    return this.optionsNotificationTiming.filter(item => item.checked === true);
  }

  public selectRecurrence(opt) {
    this.selectedOptionRecurrence = opt;
  }

  public selectToday() {
    this.revalidationDateModel = this.calendar.getToday();
  }

  public clearDate() {
    this.revalidationDateModel = null;
  }

  public isSaveDisabled() {
    return (
      !this.revalidationDateModel ||
      this.getSelectedNotificationTimings().length === 0 ||
      this.isInvalidOptionsNotificationType()
    );
  }

  public isInvalidOptionsNotificationType() {
    const selectedNotificationsTypes = this.optionsNotificationType.filter(
      item => item.checked === true
    );
    return (
      selectedNotificationsTypes.length === 0 || this.contacts.length === 0
    );
  }

  public onScroll(event) {
    const { target } = event;

    const pos = target.scrollTop + target.offsetHeight;
    const max = target.scrollHeight - 100;

    if (pos >= max && !this.isLast && !this.isLoading) {
      this.isLoading = true;
      this.incrementPageNumber();

      this.getUsers(
        this.searchTerm,
        this.userPageNumber,
        this.userPageSize
      ).subscribe(
        res => {
          const { content, last } = res;
          this.totalUsers.push(...content);
          this.isLast = last;
          this.mapUsers();
          this.isLoading = false;
        },
        err => {
          console.error(err);
          this.decrementPageNumber();
          this.isLoading = false;
        }
      );
    }
  }

  public onPickUser(user) {
    const found = this.contacts.find(contact => contact.userId === user.id);
    if (!found && this.contacts.length < 15) {
      this.contacts.push({
        fullName: user.name,
        email: user.email,
        userId: user.id
      });
    }

    if (!found && this.contacts.length === 15) {
      this.toastService.error(' You can add a maximum of 15 contacts only.');
    }
  }

  public submit() {
    const payload = this.buildPutRequest();
    this.revalidationNotificationControllerService
      .updateRevalidationDetails(this.baseRecordId, payload)
      .subscribe(
        res => {
          this.activeModal.close(res);
        },
        err => {
          console.error(err);
        }
      );
  }

  public incrementPageNumber() {
    this.userPageNumber = this.userPageNumber + 1;
  }

  public decrementPageNumber() {
    this.userPageNumber = this.userPageNumber - 1;
  }

  public resetPageNumber() {
    this.userPageNumber = 0;
  }

  public mapUsers() {
    const contactIds = this.contacts.map(contact => contact.userId);
    this.totalUsers.forEach(user => {
      user.checked = contactIds.includes(user.id);
    });
  }

  ngOnDestroy() {}
}
