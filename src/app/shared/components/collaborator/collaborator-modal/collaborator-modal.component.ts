import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { TaActiveModal, ToastService } from '@trustarc/ui-toolkit';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { AutoUnsubscribe } from '../../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { Router } from '@angular/router';
import {
  AddCollaboratorsRequest,
  CollaboratorsService
} from 'src/app/shared/services/collaborators/collaborators.service';
import { defaultTo } from 'src/app/shared/utils/basic-utils';
import { NotificationService } from '../../../services/notification/notification.service';

declare const _: any;

@AutoUnsubscribe(['_getSearchedUsersSubscription$'])
@Component({
  selector: 'ta-collaborator-modal',
  templateUrl: './collaborator-modal.component.html',
  styleUrls: ['./collaborator-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollaboratorModalComponent implements OnInit, OnDestroy {
  public collaboratorForm: FormGroup;

  @Input() public redirectModalOnSubmit: boolean;
  @Input() public baseDomainId: string;

  @ViewChild('userDropdown') userDropdownRef: ElementRef;

  public userOptionsList = [];
  private currentSearchTerm = '';

  private _getSearchedUsersSubscription$: Subscription;

  private endOfListReached = false;
  private currentUserPage = 0;
  private loadingList = false;

  private totalUsersInList = 0;
  private userBuffer = 33;
  private lastEndIndex = 0;

  public email = new FormControl('', Validators.required);

  private collaboratorFetchError = 'Error retrieving collaborators.';

  searchTextChanged = new Subject<string>();

  constructor(
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    public activeModal: TaActiveModal,
    private collaboratorsService: CollaboratorsService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.collaboratorForm = formBuilder.group({
      email: this.email,
      message: ''
    });
  }

  ngOnInit() {
    this._getSearchedUsersSubscription$ = this.searchTextChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        mergeMap(searchTerm => this.searchUsers(searchTerm, 0))
      )
      .subscribe(
        collaborators => {
          this.totalUsersInList += collaborators.length;
          this.updateUserOptionsListWithResponse(collaborators);
          this.loadingList = false;
          if (collaborators.length < 100) {
            this.endOfListReached = true;
          }
        },
        error => {
          this.toastService.error(this.collaboratorFetchError); // [i18n-tobeinternationalized]
        }
      );
    this.debounceSearch('');
  }

  ngOnDestroy() {}

  public debounceSearch(searchTerm: string) {
    this.searchTextChanged.next(searchTerm);
  }

  public closeModal() {
    this.activeModal.dismiss('Cross click');
  }

  public searchUsers(searchTerm: string, page?: number) {
    if (searchTerm === '' && !page) {
      this.lastEndIndex = 0;
      this.endOfListReached = false;
    }

    this.loadingList = true;
    this.currentSearchTerm = searchTerm;

    return this.collaboratorsService.getAAAUserInfo(
      this.currentSearchTerm,
      page
    );
  }

  public requestForInfiniteList($event) {
    const end = $event.endIndex;

    const hasReachedBufferPoint =
      end &&
      end >= this.totalUsersInList - this.userBuffer &&
      end >= this.lastEndIndex;

    this.lastEndIndex = end;

    if (hasReachedBufferPoint && !this.endOfListReached && !this.loadingList) {
      this.currentUserPage++;

      try {
        this.searchUsers(this.currentSearchTerm, this.currentUserPage);
      } catch (error) {
        this.toastService.error(this.collaboratorFetchError); // [i18n-tobeinternationalized]
      }
    }
  }

  private updateUserOptionsListWithResponse(response) {
    const newOpts = response.map(user => {
      const first = defaultTo('', user.firstName).trim();
      const last = defaultTo('', user.lastName).trim();
      const email = defaultTo('', user.email).trim();

      const hasFirst = first !== '';
      const hasLast = last !== '';

      return {
        id: user.id,
        fullName: (first + ' ' + last).trim(),
        email: email,
        nameAndEmail:
          first +
          (hasFirst && hasLast ? ' ' : '') +
          last +
          (hasFirst || hasLast ? ', ' : '') +
          email
      };
    });

    this.userOptionsList = this.userOptionsList.concat(newOpts);
    this.userOptionsList = _.uniqBy(this.userOptionsList, 'id');
  }

  public onSubmit() {
    const addCollaboratorsRequest: AddCollaboratorsRequest = {
      userIds: [this.email.value.id],
      message: this.collaboratorForm.get('message').value
    };

    this.collaboratorsService
      .add(this.baseDomainId, addCollaboratorsRequest)
      .subscribe(
        res => {
          // [i18n-tobeinternationalized]
          this.toastService.success('Email sent successfully.');
          this.notificationService.emit({
            action: 'COLLABORATOR_INVITED_SUCCESS',
            payload: res
          });
        },
        error => {
          // [i18n-tobeinternationalized]
          this.toastService.error('Error sending email to collaborator.');
        }
      );

    this.activeModal.close('Save click');

    if (this.redirectModalOnSubmit) {
      this.router.navigate(['../']);
    }
  }
}
