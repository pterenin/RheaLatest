import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { PageNavStepsInterface } from '../../shared/components/page-nav/page-nav.model';
import { REVIEW_BP_NAV_DATA } from './review-business-processes.model';
import { ReviewStepContainerService } from './review-step-container/review-step-container.service';
import { Router } from '@angular/router';
import { BUSINESS_PROCESS_NAVIGATION } from 'src/app/shared/_constant';
import { CreateBusinessProcessesService } from '../create-bp/create-business-processes.service';
import { BusinessProcessService } from 'src/app/shared/services/business-process/business-process.service';
import { flatMap } from 'rxjs/operators';
import { FeatureFlagAllInterface } from 'src/app/shared/_interfaces';
import { FeatureFlagControllerService } from '../../shared/_services/rest-api';

declare const _: any;

@Component({
  selector: 'ta-review-bp',
  templateUrl: './review-business-processes.component.html',
  styleUrls: ['./review-business-processes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReviewBusinessProcessesComponent implements OnInit {
  public pageSteps: PageNavStepsInterface[];
  public licenses: FeatureFlagAllInterface = {};
  public record = {};
  public isFetching = false;
  public readonly businessProcessNavigation = BUSINESS_PROCESS_NAVIGATION;

  constructor(
    private router: Router,
    private featureFlagControllerService: FeatureFlagControllerService,
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private businessProcessService: BusinessProcessService
  ) {}

  ngOnInit() {
    const bpId = this.router.url.split('/')[2];

    this.pageSteps = REVIEW_BP_NAV_DATA;
    this.isFetching = true;

    this.businessProcessService
      .getBackground(bpId)
      .pipe(
        flatMap(record => {
          this.record = record;
          return this.featureFlagControllerService.getAllFeatureFlags();
        })
      )
      .subscribe(
        licenses => {
          this.licenses = licenses;
          this.isFetching = false;
        },
        err => {
          console.error('There was an error in obtaining the bp record:', err);
          this.isFetching = false;
        }
      );
  }

  navigate(url) {
    const currentUrl = _.last(this.router.url.split('/'));
    this.router.navigate([this.router.url.replace(currentUrl, url)]);
  }

  public navigate12Header(url: string) {
    if (url === 'cancel' || url === 'home') {
      this.router.navigateByUrl('/business-process');
    } else {
      const currentUrl = _.last(this.router.url.split('/'));
      this.router
        .navigate([this.router.url.replace(currentUrl, url)])
        .then(() => {
          this.createBusinessProcessesService.setSelectedStep(url);
        });
    }
  }
}
