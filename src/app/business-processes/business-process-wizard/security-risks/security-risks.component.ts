import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  AfterViewInit,
  ViewChild
} from '@angular/core';

import { BUSINESS_PROCESS_NAVIGATION } from 'src/app/shared/_constant';
import { BusinessProcessWizardService } from '../business-process-wizard.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BusinessProcessControllerService,
  FeatureFlagControllerService
} from 'src/app/shared/_services/rest-api';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { UtilsClass } from 'src/app/shared/_classes';
import { Step6Service } from '../../create-bp/step-6/step-6.service';
import { ProcessingPurposeService } from '../../../shared/_services/data-inventory/processing-purpose/processing-purpose.service';
import { DataElementService } from '../../../shared/_services/data-inventory/data-element/data-element.service';
import { CreateBusinessProcessesService } from '../../create-bp/create-business-processes.service';
import {
  BusinessProcessSecurityAndRiskPutInterface,
  RetentionPeriod,
  RetentionPeriodValues
} from '../../../shared/_interfaces/rest-api';
import { TableService, ToastService } from '@trustarc/ui-toolkit';
import { DataInventoryCardComponent } from '../shared/components/data-inventory-card/data-inventory-card.component';
import { groupBy, last } from 'lodash';
import { BaseRecordsControllerService } from 'src/app/shared/_services/rest-api/base-records-controller/base-records-controller.service';

@AutoUnsubscribe(['_dataSubscription$'])
@Component({
  selector: 'ta-security-risks',
  templateUrl: './security-risks.component.html',
  styleUrls: ['./security-risks.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SecurityRisksComponent
  implements OnInit, OnDestroy, AfterViewInit {
  private version: number;
  private _dataSubscription$: Subscription;

  public businessProcessId: string;
  public readonly businessProcessNavigation = BUSINESS_PROCESS_NAVIGATION;

  // Security Control Form
  public securityControlsForm: FormGroup;
  public securityControlsChecked: any[];
  public get securityControls(): FormArray {
    return this.securityControlsForm.get('securityControls') as FormArray;
  }
  public get securityControlOtherFlag(): FormControl {
    return this.securityControlsForm.get(
      'securityControlOtherFlag'
    ) as FormControl;
  }
  public get securityControlOtherValue(): FormControl {
    return this.securityControlsForm.get(
      'securityControlOtherValue'
    ) as FormControl;
  }

  // Data elements/processing purposes
  public processingPurposesSelections: string[];
  public dataElementsSelections: string[];
  public processingPurposesCategorizedList: any;
  public dataElementsCategorizedList: any;
  public processingPurposesRowsSettings = {
    pathId: 'id',
    pathName: 'processingPurpose',
    pathCategoryName: 'category',
    pathCategoryId: 'categoryId'
  };
  public dataElementsRowsSettings = {
    pathId: 'id',
    pathName: 'dataElement',
    pathCategoryName: 'category',
    pathCategoryId: 'categoryId'
  };
  public retentionPeriodData: RetentionPeriod;

  @ViewChild('dataInventoryCardPP')
  dataInventoryCardPP: DataInventoryCardComponent;
  @ViewChild('dataInventoryCardDE')
  dataInventoryCardDE: DataInventoryCardComponent;

  private _versionSubscription$: Subscription;
  private _versionStatusSubscription$: Subscription;
  private retentionPeriodChanges: RetentionPeriodValues;

  constructor(
    private businessProcessWizardService: BusinessProcessWizardService,
    private businessProcessControllerService: BusinessProcessControllerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private featureFlagControllerService: FeatureFlagControllerService,
    private step6Service: Step6Service,
    private processingPurposeService: ProcessingPurposeService,
    private dataElementsService: DataElementService,
    private formBuilder: FormBuilder,
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private tableService: TableService,
    private toastService: ToastService,
    private baseRecordsService: BaseRecordsControllerService
  ) {
    this.securityControlsForm = this.formBuilder.group({
      securityControls: this.formBuilder.array([]),
      securityControlOtherFlag: false,
      securityControlOtherValue: new FormControl('', Validators.maxLength(255))
    });
    this.activatedRoute.parent.params.subscribe(params => {
      this.businessProcessId = params.id;
    });
  }

  ngOnInit() {
    this.initData();
    if (this._versionSubscription$) {
      this._versionSubscription$.unsubscribe();
    }
    if (this._versionStatusSubscription$) {
      this._versionStatusSubscription$.unsubscribe();
    }
    this._versionSubscription$ = this.baseRecordsService.versionAfterUpdateTags
      .asObservable()
      .subscribe(version => (this.version = version));

    this._versionStatusSubscription$ = this.businessProcessControllerService.versionAfterUpdateStatus
      .asObservable()
      .subscribe(payload => (this.version = payload.version));
  }

  ngAfterViewInit() {
    this.verifyLicense();
  }

  public verifyLicense() {
    this.featureFlagControllerService.getAllFeatureFlags().subscribe(
      allLicenses => {
        if (allLicenses.RHEA_NEW_UI_STEPS_12_LICENSE === false) {
          this.router.navigate([
            UtilsClass.getRelativeUrl(this.router.url, `../background`)
          ]);
        }
      },
      err => console.error(err)
    );
  }

  public initData() {
    this.retentionPeriodData = null;
    this._dataSubscription$ = forkJoin([
      this.businessProcessControllerService.getBusinessProcessSecurityControls(),
      this.businessProcessControllerService.getBusinessProcessSecurityAndRisk(
        this.businessProcessId
      ),
      this.processingPurposeService.getProcessingPurposesList(),
      this.dataElementsService.getDataElementsList()
    ]).subscribe(
      ([
        controlsList,
        securityAndRiskData,
        processingPurposesList,
        dataElementsList
      ]) => {
        this.version = securityAndRiskData.version;

        this.initSecurityControlsForm(controlsList);
        this.patchSecurityControlsForm(securityAndRiskData);
        this.retentionPeriodData = securityAndRiskData.dataRetention;
        this.processingPurposesCategorizedList = this.categorizeData(
          processingPurposesList.content
        );
        this.dataElementsCategorizedList = this.categorizeData(
          dataElementsList.content
        );
        this.processingPurposesSelections =
          securityAndRiskData.additionalProcessingPurposeIds;
        this.dataElementsSelections =
          securityAndRiskData.additionalDataElementIds;
      },
      err => console.log(err)
    );
  }

  public initSecurityControlsForm(controls) {
    controls.forEach(control => {
      this.securityControls.push(
        this.formBuilder.group({
          ...control,
          checked: false
        })
      );
    });

    this.securityControlsChecked = this.securityControls.value.filter(
      item => item.checked === true
    );

    this.securityControlsForm.valueChanges.subscribe(value => {});
  }

  public patchSecurityControlsForm(data) {
    const { securityControlIds = [], securityControlOther } = data;

    this.securityControls.controls.forEach(control => {
      const { value } = control;
      if (securityControlIds.includes(value.id)) {
        control.get('checked').setValue(true);
      }
    });
    if (securityControlOther) {
      this.securityControlOtherFlag.setValue(true);
      this.securityControlOtherValue.setValue(securityControlOther);
    }
  }

  public categorizeData(data) {
    return groupBy(data, 'categoryId');
  }

  public handleRetentionPeriodChange(changes: RetentionPeriodValues): void {
    this.retentionPeriodChanges = changes;
  }

  public getTitleByType(type: 'PP' | 'DE') {
    switch (type) {
      case 'PP':
        // [i18n-tobeinternationalized]
        return 'Processing Purposes';
      case 'DE':
        // [i18n-tobeinternationalized]
        return 'Data Elements';
    }
  }

  public getSubtitleByType(type: 'PP' | 'DE') {
    switch (type) {
      case 'PP':
        // [i18n-tobeinternationalized]
        return 'Add additional processing purposes that you would like to associate with this business process.';
      case 'DE':
        // [i18n-tobeinternationalized]
        return 'Add additional data elements that you would like to associate with this business process.';
    }
  }

  public getSubImageStringByType(type: 'PP' | 'DE') {
    switch (type) {
      case 'PP':
        // [i18n-tobeinternationalized]
        return 'No Processing Purposes added, click to';
      case 'DE':
        // [i18n-tobeinternationalized]
        return 'No Data Elements added, click to';
    }
  }

  public getColumnsDataByType(type: 'PP' | 'DE') {
    switch (type) {
      case 'PP':
        return [
          {
            name: 'Processing Purposes', // [i18n-tobeinternationalized]
            sortBy: 'name'
          },
          {
            name: 'Category', // [i18n-tobeinternationalized]
            sortBy: 'category'
          },
          {
            name: ''
          }
        ];
      case 'DE':
        return [
          {
            name: 'Data Elements', // [i18n-tobeinternationalized]
            sortBy: 'name'
          },
          {
            name: 'Category', // [i18n-tobeinternationalized]
            sortBy: 'category'
          },
          {
            name: ''
          }
        ];
    }
  }

  public isDisabledNextBtn() {
    const securityControlsValidity = this.securityControlsForm.valid;
    const securityControlsOtherValidity = this.securityControlOtherValue.valid;

    return !(securityControlsValidity && securityControlsOtherValidity);
  }

  private validateRetentionPeriod() {
    const retentionPeriodInfo = this.getDataRetentionPutRequest();
    if (
      retentionPeriodInfo &&
      retentionPeriodInfo.type === 'Other' &&
      retentionPeriodInfo.description
    ) {
      return true;
    }

    if (
      retentionPeriodInfo &&
      retentionPeriodInfo.type !== 'Other' &&
      retentionPeriodInfo.value
    ) {
      return true;
    }

    return false;
  }

  private buildPutRequest(): BusinessProcessSecurityAndRiskPutInterface {
    return {
      id: this.businessProcessId,
      version: this.version,
      securityControlIds: this.securityControls.value
        .filter(item => item.checked === true)
        .map(item => item.id),
      securityControlOther: this.securityControlOtherFlag.value
        ? this.securityControlOtherValue.value
        : null,
      additionalProcessingPurposeIds: this.getRowsDataByType('PP'),
      additionalDataElementIds: this.getRowsDataByType('DE'),
      dataRetention: this.validateRetentionPeriod()
        ? this.getDataRetentionPutRequest()
        : null
    };
  }

  private getRowsDataByType(type: 'PP' | 'DE') {
    switch (type) {
      case 'PP':
        return this.dataInventoryCardPP.getRowsData().map(item => item.id);
      case 'DE':
        return this.dataInventoryCardDE.getRowsData().map(item => item.id);
      default:
        return [];
    }
  }

  private getDataRetentionPutRequest() {
    const type = this.retentionPeriodChanges
      ? this.retentionPeriodChanges.retentionPeriodUnits
      : null;
    if (!type) {
      return null;
    }
    if (type === 'Other') {
      return {
        type,
        description: this.retentionPeriodChanges.retentionPeriodUnitsOther
      };
    }

    return {
      type,
      value: this.retentionPeriodChanges.retentionPeriodValue
    };
  }

  public navigate(options: { save: boolean; step: string }) {
    // If saving not required
    if (!options.save) {
      if (options.step === 'cancel' || options.step === 'home') {
        return this.router.navigateByUrl('/business-process');
      } else {
        return this.navigateToUrl(options.step);
      }
    }

    // If saving required
    const data = this.buildPutRequest();
    return this.businessProcessControllerService
      .putBusinessProcessSecurityAndRisk(data)
      .subscribe(
        res => {
          if (options.step === 'home') {
            return this.router.navigateByUrl('/business-process');
          }
          if (options.step === 'data-flow') {
            this.featureFlagControllerService
              .getAllFeatureFlags()
              .subscribe(allLicenses => {
                if (allLicenses.RHEA_NEW_UI_STEPS_5_LICENSE === true) {
                  return this.navigateToUrl('build-data-flow');
                } else {
                  return this.navigateToUrl(options.step);
                }
              });
          } else {
            return this.navigateToUrl(options.step);
          }
        },
        err => {
          console.error(err);
          // [i18n-tobeinternationalized]
          this.toastService.error('Error updating security and risk data');
        }
      );
  }

  private navigateToUrl(url): void {
    const currentUrl = last(this.router.url.split('/'));
    this.router
      .navigate([this.router.url.replace(currentUrl, url)])
      .then(() => {
        this.createBusinessProcessesService.setSelectedStep(url);
      });
  }

  ngOnDestroy() {}
}
