import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TaActiveModal, ToastService } from '@trustarc/ui-toolkit';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { ReviewerInterface } from '../create-business-processes.model';
import { UserService } from 'src/app/shared/services/user/user.service';
import { tap, map } from 'rxjs/operators';
import { DatagridHeaderService } from 'src/app/shared/services/record-listing/datagrid-header.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/form-utils';

@AutoUnsubscribe(['_assignees$', '_selectedItems$'])
@Component({
  selector: 'ta-assign-business-process',
  templateUrl: './assign-business-process.component.html',
  styleUrls: ['./assign-business-process.component.scss']
})
export class AssignBusinessProcessComponent implements OnInit, OnDestroy {
  public gridId: string;

  public bpAssignForm: FormGroup;
  public bpName: FormControl;
  public bpDescription: FormControl;
  public assignee: FormControl;
  public message: FormControl;

  public businessProcessForm: FormGroup;

  public assignees: ReviewerInterface[];
  private _assignees$: Subscription;
  public pageSelectedItems: any[];
  public disableReviewOption = true;

  private _selectedItems$: Subscription;

  constructor(
    public activeModal: TaActiveModal,
    private datagridHeaderService: DatagridHeaderService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private userService: UserService
  ) {
    this.assignee = new FormControl('', Validators.required);
    this.message = new FormControl('', Validators.maxLength(1024));
    this.bpName = new FormControl(
      '',
      Validators.compose([
        Validators.required,
        noWhitespaceValidator,
        Validators.maxLength(255)
      ])
    );
    this.bpDescription = new FormControl('', Validators.maxLength(1024));
    this.businessProcessForm = formBuilder.group({
      bpName: this.bpName,
      bpDescription: this.bpDescription
    });

    this.bpAssignForm = formBuilder.group({
      status: 'create-and-assign',
      assignee: this.assignee,
      message: this.message,
      businessProcessForm: this.businessProcessForm
    });
    this.assignees = [];
  }

  ngOnInit() {
    this.onUserSearchChanged('');
    this._selectedItems$ = this.datagridHeaderService
      .initGridSources(this.gridId)
      .pipe(
        switchMap(() =>
          this.datagridHeaderService.viewSelectedPageItems(this.gridId)
        )
      )
      .subscribe((items: any[]) => {
        this.pageSelectedItems = items;
        this.disableReviewOption = !(items && items.length === 1);
      });

    this.bpAssignForm
      .get('status')
      .valueChanges.pipe(
        tap(assignAction => {
          if (assignAction === 'create-and-assign') {
            this.businessProcessForm.enable();
          } else {
            this.businessProcessForm.disable();
          }
        })
      )
      .subscribe();
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
          this.assignees = reviewers;
        },
        error => {
          console.log('Error retrieving assignees.', error);
          this.toastService.error('Error retrieving assignees.'); // [i18n-tobeinternationalized]
        }
      );
  }

  closeModal() {
    this.activeModal.dismiss('Cross click');
  }

  onSubmit() {
    if (this.bpAssignForm.get('status').value === 'create-and-assign') {
      const success = {
        isCreateAndAssign: true,
        message: this.bpAssignForm.get('message').value,
        userId: this.bpAssignForm.get('assignee').value.id,

        name: this.businessProcessForm.get('bpName').value,
        description: this.businessProcessForm.get('bpDescription').value
      };
      this.activeModal.close(success);
    } else {
      const success = {
        isAssignExisting: true,
        businessProcessId: this.pageSelectedItems[0].id,
        message: this.bpAssignForm.get('message').value,
        userId: this.bpAssignForm.get('assignee').value.id
      };
      this.activeModal.close(success);
    }
  }

  private cancelGetAssignees() {
    if (this._assignees$) {
      this._assignees$.unsubscribe();
    }
  }
}
