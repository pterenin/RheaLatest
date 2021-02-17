import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessProcessService } from 'src/app/shared/services/business-process/business-process.service';
import { of, Subscription } from 'rxjs';
import { flatMap, catchError } from 'rxjs/operators';
import { ToastService } from '@trustarc/ui-toolkit';
import { UtilsClass } from 'src/app/shared/_classes';
import { FeatureFlagAllInterface } from 'src/app/shared/_interfaces';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { FeatureFlagControllerService } from '../../shared/_services/rest-api';

declare const _: any;
@AutoUnsubscribe(['featuresLicense$'])
@Component({
  selector: 'ta-all-bp',
  templateUrl: './all-business-processes.component.html',
  styleUrls: ['./all-business-processes.component.scss']
})
export class AllBusinessProcessesComponent implements OnDestroy {
  private _featuresLicense$: Subscription;
  public dataGridId = 'bpDatagrid';
  private licenses: FeatureFlagAllInterface;

  constructor(
    private router: Router,
    private businessProcessService: BusinessProcessService,
    private toastService: ToastService,
    private featureFlagControllerService: FeatureFlagControllerService
  ) {
    this.getFeatureLicenses();
  }

  ngOnDestroy() {}

  public cloneRecordService() {
    return (form, record) =>
      this.businessProcessService.cloneBusinessProcessRecord(form, record);
  }

  getFeatureLicenses() {
    UtilsClass.unSubscribe(this._featuresLicense$);
    this._featuresLicense$ = this.featureFlagControllerService
      .getAllFeatureFlags()
      .subscribe(allLicenses => {
        this.licenses = allLicenses;
      });
  }

  public emptyRecordsCTAClick() {
    this.businessProcessService
      .create()
      .pipe(
        flatMap(createdBusinessProcess => {
          return of(createdBusinessProcess.id);
        }),
        catchError(err => {
          console.error('Unable to create new business process.', err);
          return of(false);
        })
      )
      .subscribe(bpId => {
        if (bpId) {
          if (this.licenses.RHEA_NEW_UI_STEPS_12_LICENSE === true) {
            this.router.navigate([`business-process/${bpId}/details`]);
          } else {
            this.router.navigate([`business-process/${bpId}/background`]);
          }
        } else {
          this.toastService.error('Unable to add new business process record.');
        }
      });
  }
}
