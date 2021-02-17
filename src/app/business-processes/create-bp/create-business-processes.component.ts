import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { PageNavStepsInterface } from '../../shared/components/page-nav/page-nav.model';
import {
  CREATE_BP_NAV_DATA,
  OnPageRouteChange
} from './create-business-processes.model';

import { CreateBusinessProcessesService } from './create-business-processes.service';
import { FeatureFlagAllInterface } from 'src/app/shared/_interfaces';
import { FeatureFlagControllerService } from '../../shared/_services/rest-api';

declare const _: any;

@Component({
  selector: 'ta-create-bp',
  templateUrl: './create-business-processes.component.html',
  styleUrls: ['./create-business-processes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateBusinessProcessesComponent implements OnInit {
  public isFetching: boolean;
  public pageSteps: PageNavStepsInterface[];
  private currentUrl: string;
  public selectedStep: number;
  public hasRHEA_NEW_UI_STEPS_34_LICENSE = false;
  public licenses: FeatureFlagAllInterface = {};

  constructor(
    private router: Router,
    private featureFlagControllerService: FeatureFlagControllerService,
    private createBusinessProcessesService: CreateBusinessProcessesService
  ) {}

  ngOnInit() {
    this.isFetching = true;

    // This is is to ensure the adequate license is stored in the service to render the correct page.
    this.featureFlagControllerService.getAllFeatureFlags().subscribe(
      licenses => {
        this.licenses = licenses;
        this.hasRHEA_NEW_UI_STEPS_34_LICENSE =
          licenses['RHEA_NEW_UI_STEPS_34_LICENSE'];
        this.pageSteps = CREATE_BP_NAV_DATA(
          this.hasRHEA_NEW_UI_STEPS_34_LICENSE
        );
        this.createBusinessProcessesService.setNavData(
          this.hasRHEA_NEW_UI_STEPS_34_LICENSE
        );
        this.setCurrentUrlData();
        this.isFetching = false;
      },
      err => {
        this.isFetching = false;
        console.error('Unable to request from feature flag API.', err);
      }
    );
  }

  public onPageRouteChange({ success, url }: OnPageRouteChange) {
    if (success) {
      this.selectedStep = this.createBusinessProcessesService.setSelectedStep(
        url
      );
    }
  }

  public setCurrentUrlData() {
    this.currentUrl = _.last(this.router.url.split('/'));
    this.selectedStep = this.createBusinessProcessesService.setSelectedStep(
      this.currentUrl
    );
  }

  public navigate(url) {
    this.router
      .navigate([this.router.url.replace(this.currentUrl, url)])
      .then(() => {
        this.selectedStep = this.createBusinessProcessesService.setSelectedStep(
          url
        );
        this.setCurrentUrlData();
      });
  }

  public handleStepClick(taSteps, step, stepNumber) {
    taSteps.setActiveStep(stepNumber + 1);
    this.navigate(step.url);
  }

  public setStatusByStepNumber(stepNumber) {
    if (stepNumber < this.selectedStep) {
      return 'done';
    }
    if (stepNumber === this.selectedStep) {
      return 'active';
    }
    if (stepNumber > this.selectedStep) {
      return 'disabled';
    }
  }
}
