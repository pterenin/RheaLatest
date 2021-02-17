import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { last } from 'lodash';

import { BUSINESS_PROCESS_NAVIGATION } from 'src/app/shared/_constant';
import { BusinessProcessWizardService } from '../business-process-wizard.service';
import {
  BusinessProcessDetailsInterface,
  DataSubjectVolumeInterface
} from 'src/app/shared/_interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DataSubjectVolumeControllerService,
  BusinessProcessControllerService,
  FeatureFlagControllerService
} from 'src/app/shared/_services/rest-api';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscribable, Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { UtilsClass } from 'src/app/shared/_classes';
import { ToastService } from '@trustarc/ui-toolkit';

@AutoUnsubscribe([
  '_loadDataSubjectVolumes$',
  '_loadBPDetail$',
  '_updateBPDetail$',
  '_bpId$'
])
@Component({
  selector: 'ta-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  private _loadDataSubjectVolumes$: Subscription;
  private _loadBPDetail$: Subscription;
  private _updateBPDetail$: Subscription;
  private _bpId$: Subscription;

  /**
   * BUSINESS PROCESS PROPERTIES
   */
  public businessProcessId: string;
  public readonly businessProcessNavigation = BUSINESS_PROCESS_NAVIGATION;

  public bpDetail: BehaviorSubject<
    BusinessProcessDetailsInterface
  > = new BehaviorSubject(null);
  public bpDetail$ = this.bpDetail.asObservable();
  public isDetailsFormValid = false;

  constructor(
    private businessProcessWizardService: BusinessProcessWizardService,
    private businessProcessControllerService: BusinessProcessControllerService,
    private dataSubjectVolumesServices: DataSubjectVolumeControllerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private featureFlagControllerService: FeatureFlagControllerService,
    private toastService: ToastService
  ) {
    this._bpId$ = this.activatedRoute.parent.params.subscribe(params => {
      this.businessProcessId = params.id;
    });
  }

  dataSubjectVolumes: DataSubjectVolumeInterface[];

  ngOnInit() {
    this.loadDataSubjectVolumesOptions();
  }

  ngAfterViewInit() {
    // verifies licenses
    this.featureFlagControllerService
      .getAllFeatureFlags()
      .subscribe(allLicenses => {
        if (allLicenses.RHEA_NEW_UI_STEPS_12_LICENSE === false) {
          this.router.navigate([
            UtilsClass.getRelativeUrl(this.router.url, `../background`)
          ]);
        }
      });
  }

  //#region Shared/Child component BP Details

  loadDataSubjectVolumesOptions() {
    // list of data subject volumes for details form
    UtilsClass.unSubscribe(this._loadDataSubjectVolumes$);
    this._loadDataSubjectVolumes$ = this.dataSubjectVolumesServices
      .getDataSubjectVolumes()
      .subscribe(dsVolumes => {
        this.dataSubjectVolumes = dsVolumes;
        this.loadBusinessProcessDetail();
      });
  }

  loadBusinessProcessDetail() {
    UtilsClass.unSubscribe(this._loadBPDetail$);
    this._loadBPDetail$ = this.businessProcessControllerService
      .getBusinessProcessDetails(this.businessProcessId)
      .subscribe(
        detail => {
          this.bpDetail.next(detail);
        },
        err => {
          const { status } = err;
          if (status === 403) {
            // [i18n-tobeinternationalized]
            this.toastService.error(
              'You do not have the access permissions needed to edit this record',
              null,
              5000
            );
          }
        }
      );
  }

  updateBusinessProcessDetails($event) {
    if ($event !== this.bpDetail.value) {
      this.bpDetail.next($event);
    }
  }

  // updates Details Form Validity Status on details form value Changes
  detailsFormValueChanges($eventFormGroup) {
    const formGroup = $eventFormGroup as FormGroup;
    this.isDetailsFormValid = formGroup ? formGroup.valid : false;
  }

  public navigate(url: string) {
    if (url === 'cancel' || url === 'home') {
      if (url !== 'cancel') {
        this.saveDetails(false);
      }
      this.router.navigateByUrl('/business-process');
    } else {
      this.saveDetails(false);
      const currentUrl = last(this.router.url.split('/'));
      this.router.navigate([this.router.url.replace(currentUrl, url)]);
    }
  }

  saveDetails(navigate: boolean) {
    UtilsClass.unSubscribe(this._updateBPDetail$);
    this._updateBPDetail$ = this.businessProcessControllerService
      .updateBusinessProcessDetails(this.bpDetail.value, this.businessProcessId)
      .subscribe(detail => {
        this.businessProcessWizardService.getBpName.next(detail.name);
        if (navigate) {
          this.router.navigateByUrl(
            `/business-process/${this.businessProcessId}/systems-selection`
          );
        }
      });
  }

  //#endregion

  //#region Navigation Items

  cancelForm() {
    this.router.navigateByUrl(`/business-process`);
  }

  //#endregion

  ngOnDestroy() {}
}
