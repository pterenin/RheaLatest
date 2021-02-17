import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { StepContainerService } from './step-container.service';
import { Subscription } from 'rxjs';
import { DataSubjectsRecipientsService } from 'src/app/shared/services/data-subjects-recipients/data-subjects-recipients.service';
import { OnPageRouteChange } from '../create-business-processes.model';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { from } from 'rxjs';

declare const _: any;

@AutoUnsubscribe(['_routerChange$', '_onSubmit$'])
@Component({
  selector: 'ta-step-container',
  styleUrls: ['./step-container.scss'],
  templateUrl: './step-container.component.html',
  providers: [StepContainerService]
})
export class StepContainerComponent implements OnInit, OnDestroy, OnChanges {
  private _routerChange$: Subscription;
  private _onSubmit$: Subscription;
  public currentUrl: string;

  @Input() selectedStep: number;
  @Input() pageSteps = [];
  @Input() hasRHEA_NEW_UI_STEPS_34_LICENSE: boolean;
  @Output() pageRouteChanged = new EventEmitter<OnPageRouteChange>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private stepContainerService: StepContainerService,
    private dataSubjectRecipientService: DataSubjectsRecipientsService
  ) {}

  ngOnInit() {
    // subscribe to onSubmit event for each step
    this._onSubmit$ = this.stepContainerService.changeEmitted$.subscribe(
      (diff: number) => this.navigateToNewUrl(diff)
    );
    this.currentUrl = _.last(this.router.url.split('/'));
  }

  ngOnChanges() {
    this.currentUrl = _.last(this.router.url.split('/'));
  }

  ngOnDestroy() {
    this.dataSubjectRecipientService.onDestroy();
  }

  isDataFlowPage() {
    return this.currentUrl === 'data-flow';
  }

  navigateToNewUrl(diff: number) {
    const newIndex = this.selectedStep + diff;
    const navItem = this.pageSteps[newIndex];
    if (navItem) {
      this.navigate(newIndex);
    } else {
      console.error(
        'Page Navigation Error: Path does not exist: ',
        newIndex,
        this.pageSteps
      );
    }
  }

  navigate(newIndex: number) {
    const url = this.pageSteps[newIndex].url;
    const navigationStream = from(
      this.router.navigate([url], { relativeTo: this.activatedRoute })
    );

    navigationStream.subscribe((routedSuccessfully: boolean) => {
      if (routedSuccessfully) {
        this.pageRouteChanged.emit({ success: true, url });
        this.selectedStep = newIndex;
      } else {
        this.pageRouteChanged.emit({ success: false });
        console.error(
          'Step Container::navigate - Error Unable to route to: ',
          url
        );
      }
    });
  }
}
