import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ReviewStepContainerService } from '../review-step-container/review-step-container.service';
import { Subscription, Observable, forkJoin, Subject, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  CanDeactivate,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { StepFinalReviewService } from './step-final-review.service';
import { ToastService } from '@trustarc/ui-toolkit';

import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';

import { ReviewTableRowResponseInterface } from './review-models';
import { BusinessProcessInterface } from '../../create-bp/create-business-processes.model';
import { BusinessProcessService } from 'src/app/shared/services/business-process/business-process.service';
import { ClipboardService } from 'ngx-clipboard';
import { BusinessProcessApproval } from './step-final-review.model';
import { CreateBusinessProcessesService } from '../../create-bp/create-business-processes.service';

declare const _: any;

const BP_STATUS = [
  { id: 'DRAFT', name: 'Draft' },
  { id: 'IN_REVIEW', name: 'In review' },
  { id: 'PUBLISH', name: 'Publish' },
  { id: 'REVISE', name: 'Revise' }
];

@AutoUnsubscribe([
  '_paramMap$',
  '_navigationSubscription$',
  '_saveResponseSubscription$',
  '_savedDataSubscription$',
  '_formChangeSubscription$'
])
@Component({
  selector: 'ta-step-final-review',
  templateUrl: './step-final-review.component.html',
  styleUrls: ['./step-final-review.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StepFinalReviewComponent
  implements OnInit, OnDestroy, CanDeactivate<StepFinalReviewComponent> {
  public stepFinalReviewForm: FormGroup;
  public businessProcess: BusinessProcessInterface;
  private _paramMap$: Subscription;
  private bpId: string;
  public bpStatuses: any[];
  public isNextButtonDisabled = false;
  public businessProcessApproval: BusinessProcessApproval;

  private version;
  private isSaving;

  public tableData;
  public legalBases;

  public _navigationSubscription$: Subscription;
  public _saveResponseSubscription$: Subscription;
  public _savedDataSubscription$: Subscription;
  public _formChangeSubscription$: Subscription;
  private tableDataUpdateSubject$: Subject<void>;

  constructor(
    private reviewStepContainerService: ReviewStepContainerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private stepFinalReviewService: StepFinalReviewService,
    private toastService: ToastService,
    private businessProcessService: BusinessProcessService,
    private clipboardService: ClipboardService
  ) {
    this.stepFinalReviewForm = formBuilder.group({
      id: [null, [Validators.required]],
      version: null,
      status: null
    });
    this.bpId = '';
    this.businessProcess = {} as BusinessProcessInterface;
    this.bpStatuses = BP_STATUS;
    this.tableDataUpdateSubject$ = new Subject();
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot) {
      this.bpId = this.activatedRoute.snapshot.parent.params['id'];
    }
    if (this._savedDataSubscription$) {
      this._savedDataSubscription$.unsubscribe();
    }

    this.getApprovalRecord();

    if (this._navigationSubscription$) {
      this._navigationSubscription$.unsubscribe();
    }
    this._navigationSubscription$ = this.reviewStepContainerService.changeEmitted$.subscribe(
      event => {
        if (event === 'navigation') {
          this.save();
        }
      }
    );
  }
  ngOnDestroy() {}

  getApprovalRecord() {
    this.stepFinalReviewService.getApproval(this.bpId).subscribe(
      result => {
        this.stepFinalReviewForm.get('id').patchValue(result.id);
        this.version = result.version;
        this.businessProcess.name = result.name;
        this.businessProcess.identifier = result.identifier;
        this.updateTableData(result);
        this.stepFinalReviewForm.markAsUntouched();
        this.setAutosave();
      },
      () =>
        this.toastService.error(
          'Error retrieving business processes and legal bases'
        )
    );
  }

  private updateTableData(response: ReviewTableRowResponseInterface) {
    const statuses = _.keyBy(this.bpStatuses, 'id');
    if (statuses[response.status]) {
      this.stepFinalReviewForm
        .get('status')
        .patchValue(statuses[response.status]);
    }
    this.legalBases = response.legalBasisRows;
    this.tableData = response.dataRows;
    this.tableDataUpdateSubject$.next(this.tableData);
  }

  private setAutosave() {
    this._formChangeSubscription$ = merge(
      this.stepFinalReviewForm.valueChanges,
      this.tableDataUpdateSubject$
    )
      .pipe(
        debounceTime(CreateBusinessProcessesService.AUTOREFRESH_INTERVAL_MS / 2)
      )
      .subscribe(this.save.bind(this));
  }

  get form() {
    return this.stepFinalReviewForm.controls;
  }

  public canDeactivate(
    stepFinalReviewComponent: StepFinalReviewComponent,
    _currentRoute,
    _currentState,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // TODO: TIMF-4882 consider doing a save on route change.
    return true;
  }

  tableDataUpdated($event) {
    this.tableData = $event;
    this.tableDataUpdateSubject$.next();
  }

  public copyUrl() {
    this.clipboardService.copyFromContent(window.location.href);
    this.toastService.success(
      'Copied to clipboard: ' + window.location.href,
      null,
      10000
    );
  }

  public onSubmit() {
    this.save();
  }

  public save() {
    const recordStatus = this.stepFinalReviewForm.get('status').value;
    const id = this.stepFinalReviewForm.get('id').value;
    if (this.tableData) {
      if (this._saveResponseSubscription$) {
        this._saveResponseSubscription$.unsubscribe();
      }

      if (!this.isSaving) {
        this.isSaving = true;
        this.stepFinalReviewService
          .saveBusinessProcessApproval(
            this.tableData,
            recordStatus.id,
            id,
            this.version,
            this.bpId
          )
          .subscribe(
            result => {
              this.isSaving = false;
              this.stepFinalReviewForm
                .get('id')
                .patchValue(result['id'], { emitEvent: false });
              this.version = result['version'];
            },
            error => {
              console.error(error);
            }
          );
      }
    }
  }
}
