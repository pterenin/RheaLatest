import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  Event,
  NavigationEnd,
  NavigationStart
} from '@angular/router';
import { ReviewStepContainerService } from './review-step-container.service';
import { Subscription } from 'rxjs';
import { REVIEW_BP_NAV_DATA } from '../review-business-processes.model';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';

declare const _: any;

@AutoUnsubscribe(['_routerChange$', '_onSubmit$'])
@Component({
  selector: 'ta-review-step-container',
  templateUrl: './review-step-container.component.html',
  providers: [ReviewStepContainerService]
})
export class ReviewStepContainerComponent implements OnInit, OnDestroy {
  private _routerChange$: Subscription;
  private _onSubmit$: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private reviewStepService: ReviewStepContainerService,
    private reviewStepContainerService: ReviewStepContainerService
  ) {}

  currentUrl: string;
  currentIndex: number;
  currentTitle: string;

  ngOnInit() {
    this.setCurrentUrlData();
    // subscribe to router change
    this._routerChange$ = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.reviewStepService.emitChange('navigation');
      } else if (event instanceof NavigationEnd) {
        this.setCurrentUrlData();
      }
    });
  }

  ngOnDestroy() {}

  public saveReviewForm() {
    this.reviewStepContainerService.emitChange('navigation');
  }

  setCurrentUrlData() {
    this.currentUrl = _.last(this.router.url.split('/'));
    this.currentIndex = REVIEW_BP_NAV_DATA.findIndex(
      d => d.url === this.currentUrl
    );
    this.currentTitle = REVIEW_BP_NAV_DATA[this.currentIndex]
      ? REVIEW_BP_NAV_DATA[this.currentIndex].title
      : '';
  }

  navigateToNewUrl(diff: number) {
    const newIndex = this.currentIndex + diff;
    if (REVIEW_BP_NAV_DATA[newIndex]) {
      this.navigate(REVIEW_BP_NAV_DATA[newIndex].url);
    }
  }

  navigate(url: String) {
    this.router.navigate([url], {
      relativeTo: this.activatedRoute
    });
  }
}
