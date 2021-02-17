import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { AssessmentsInterface } from '../../models/assessment.model';
import { AssessmentsService } from './assessments.service';
import { Subscription } from 'rxjs';
import { ToastService } from '@trustarc/ui-toolkit';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';

@AutoUnsubscribe(['_counts$', '_onCancelSubscription$'])
@Component({
  selector: 'ta-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit, OnDestroy {
  @Input() public recordId: String;
  @Input() public type: 'data-inventory' | 'business-process';
  @Output() finishedLoad = new EventEmitter();

  private _counts$: Subscription;
  public counts: AssessmentsInterface[];
  public buildAssessmentUrl;
  public viewAssessmentsUrl;
  private _onCancelSubscription$: Subscription;

  constructor(
    private assessmentsService: AssessmentsService,
    private toastService: ToastService,
    private dataInventoryService: DataInventoryService
  ) {}

  ngOnInit() {
    this.getAssessmentsData(this.recordId);
    this.onCancelChanges();
  }

  private getAssessmentsData(id: String) {
    if (this._counts$) {
      this._counts$.unsubscribe();
    }

    this._counts$ = this.assessmentsService.getAssessments(id).subscribe(
      success => {
        this.counts = success.counts;
        this.buildAssessmentUrl = success.buildAssessmentUrl;
        this.viewAssessmentsUrl = success.viewAssessmentsUrl;

        if (this.counts) {
          // output total
          this.finishedLoad.emit(this.counts[0].count);
        }
      },
      err =>
        this.toastService.error('License not purchased for Assessment Manager')
    );
  }

  private onCancelChanges() {
    this.onCancelChangesSubscriber();
    this._onCancelSubscription$ = this.dataInventoryService.getCancelFormChanges.subscribe(
      (value: boolean) => {
        if (value) {
          this.dataInventoryService.goBackDataInventoryListPage();
        }
      }
    );
  }

  private onCancelChangesSubscriber() {
    if (this._onCancelSubscription$) {
      this._onCancelSubscription$.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.onCancelChangesSubscriber();
  }
}
