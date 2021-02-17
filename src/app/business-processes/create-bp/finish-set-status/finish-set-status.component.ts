import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaActiveModal, ToastService } from '@trustarc/ui-toolkit';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateBusinessProcessesService } from '../create-business-processes.service';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { ReviewerInterface } from '../create-business-processes.model';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user/user.service';
import { map } from 'rxjs/operators';

@AutoUnsubscribe(['_reviewers$'])
@Component({
  selector: 'ta-finish-set-status',
  templateUrl: './finish-set-status.component.html',
  styleUrls: ['./finish-set-status.component.scss']
})
export class FinishSetStatusComponent implements OnInit, OnDestroy {
  public bpStatusForm: FormGroup;
  public reviewers: ReviewerInterface[];
  private _reviewers$: Subscription;

  constructor(
    private toastService: ToastService,
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private formBuilder: FormBuilder,
    public activeModal: TaActiveModal,
    private router: Router,
    private userService: UserService
  ) {
    this.bpStatusForm = formBuilder.group({
      status: 'draft',
      reviewer: '',
      message: ''
    });
  }

  ngOnInit() {
    this.onUserSearchChanged('');
  }

  ngOnDestroy() {}

  onUserSearchChanged(searchTerm: string) {
    this.userService
      .getUsersSearch(searchTerm)
      .pipe(
        map(users =>
          users.map(
            user =>
              ({
                id: user.id,
                label: `${user.name} - ${user.email}`
              } as ReviewerInterface)
          )
        )
      )
      .subscribe(
        reviewers => {
          this.reviewers = reviewers;
        },
        error => {
          console.warn('Error retrieving assignees.', error);
          this.toastService.error('Error retrieving assignees.'); // [i18n-tobeinternationalized]
        }
      );
  }

  closeModal() {
    this.activeModal.dismiss('Cross click');
  }

  onSubmit() {
    // perform validation and submit of form once BE and api is ready (TIMF-4288)
    this.activeModal.close('Save click');
    this.router.navigate(['../']);
  }

  private cancelGetReviewers() {
    if (this._reviewers$) {
      this._reviewers$.unsubscribe();
    }
  }
}
