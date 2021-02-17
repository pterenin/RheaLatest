import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';
import { ActivatedRoute, CanDeactivate, Router } from '@angular/router';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { BaseCategoryInterface } from 'src/app/shared/components/categorical-view/base-category.model';
import { defaultTo, exists } from 'src/app/shared/utils/basic-utils';
import { first, flatMap } from 'rxjs/operators';
import { ProcessingPurposeInterface } from 'src/app/shared/models/processing-purposes.model';
import { ProcessingPurposesService } from 'src/app/shared/services/processing-purposes/processing-purposes.service';
import { SelectedItemsContainerComponent } from 'src/app/shared/components/selected-items-container/selected-items-container.component';
import { Step6Service } from './step-6.service';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { ToastService } from '@trustarc/ui-toolkit';
import { UtilsClass } from 'src/app/shared/_classes';
import { CreateBusinessProcessesService } from '../create-business-processes.service';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { DataElementsService } from 'src/app/shared/services/data-elements/data-elements.service';
import { DataInterface } from 'src/app/shared/components/categorical-management/categorical-management.component';
import { SETTINGS } from 'src/app/app.constants';
import { BUSINESS_PROCESS_NAVIGATION } from 'src/app/shared/_constant';
import { BusinessProcessService } from 'src/app/shared/services/business-process/business-process.service';
import { FeatureFlagControllerService } from '../../../shared/_services/rest-api';

declare const _: any;

@AutoUnsubscribe([
  '_routeParams$',
  '_controlAndProcessingPurpose$',
  '_formChange$',
  '_dataElements$',
  '_processingPurposes$'
])
@Component({
  selector: 'ta-step-6',
  templateUrl: './step-6.component.html',
  styleUrls: ['./step-6.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Step6Component
  implements OnInit, OnDestroy, CanDeactivate<Step6Component> {
  public step6Form: FormGroup;
  public readonly businessProcessNavigation = BUSINESS_PROCESS_NAVIGATION;

  @ViewChild('processingPurposesField')
  processingPurposesField: SelectedItemsContainerComponent;
  @ViewChild('dataElementsField')
  dataElementsField: SelectedItemsContainerComponent;

  // [i18n-tobeinternationalized]
  public options = ['Days', 'Weeks', 'Months', 'Years', 'Other'];
  public isFetching = false;
  public leftSecurityControls: FormArray;
  public rightSecurityControls: FormArray;
  public _securityControlOtherValue: string;

  public get securityControlOtherValue() {
    return this._securityControlOtherValue;
  }
  public set securityControlOtherValue(value: string) {
    this._securityControlOtherValue = value;
  }

  public processingPurposesList: BaseCategoryInterface<
    ProcessingPurposeInterface
  >[];
  public dataElementsList: DataInterface[] = [];

  private businessProcessId: string;
  private version: number;
  public selectedProcessingPurposeIds: Array<string>;
  public selectedDataElementIds: Array<string>;
  public showRiskFields = SETTINGS.ShowRiskFields;
  public licenses = {};
  public record = {};

  private fetchedProcessingPurposes;
  private fetchedDataElements;
  private fetchedDataRetention;
  private fetchedSecurityControlIds;
  private fetchedOtherSecurityControlValue;
  private step6DataLoaded: boolean;

  private _routeParams$: Subscription;
  private _controlAndProcessingPurpose$: Subscription;
  private _dataElements$: Subscription;
  private _processingPurposes$: Subscription;
  private _save$: Subscription;
  private _formChange$: Subscription;

  constructor(
    private featureFlagControllerService: FeatureFlagControllerService,
    private processingPurposeService: ProcessingPurposesService,
    private dataElementsService: DataElementsService,
    private step6Service: Step6Service,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private businessProcessService: BusinessProcessService
  ) {
    this.leftSecurityControls = this.formBuilder.array([]);
    this.rightSecurityControls = this.formBuilder.array([]);
    this.step6DataLoaded = false;

    this.step6Form = this.formBuilder.group({
      leftSecurityControls: this.leftSecurityControls,
      rightSecurityControls: this.rightSecurityControls,
      periodLength: new FormControl(null, [Validators.pattern('^[0-9]*$')]),
      units: new FormControl(null),
      description: '',
      selectedProcessingPurposeIds: [],
      selectedDataElementIds: [],
      securityControlOtherFlg: false,
      securityControlOther: new FormControl(
        this._securityControlOtherValue,
        Validators.maxLength(255)
      )
    });
  }

  ngOnInit() {
    this.isFetching = true;
    this.featureFlagControllerService
      .getAllFeatureFlags()
      .pipe(
        flatMap(licenses => {
          this.licenses = licenses;
          return this.getBusinessProcessRecord();
        })
      )
      .subscribe(
        record => {
          this.record = record;
          this.isFetching = false;
        },
        err => {
          console.error(
            'There was an error checking licenses and setting active record: ',
            err
          );
          this.isFetching = false;
        }
      );

    this.getDataElementsGroups();
    this.onRetentionUnitValueChange();
  }

  private getControlList() {
    this._controlAndProcessingPurpose$ = this.step6Service
      .getSecurityControlList()
      .subscribe(controlList => {
        const halfway = Math.floor(controlList.length / 2);

        controlList.slice(0, halfway).forEach(control => {
          this.leftSecurityControls.push(
            this.formBuilder.group({ ...control, checked: null })
          );
        });

        controlList.slice(halfway).forEach(control => {
          this.rightSecurityControls.push(
            this.formBuilder.group({ ...control, checked: null })
          );
        });

        // The following sorts the categories and their items, both in descending order.
        if (this.processingPurposesList) {
          this.processingPurposesList.sort((a: any, b: any) =>
            a.label.localeCompare(b.label)
          );
          this.processingPurposesList.forEach(element => {
            element.items.sort((a: any, b: any) =>
              a.label.localeCompare(b.label)
            );
          });

          this.processingPurposeService.addOtherElementToTheEndOfProcessingPurposeCategories(
            this.processingPurposesList
          );
        }

        this.sortDataElementsList();

        this.getStep6Data();
      });
  }

  private getDataElementsGroups(page = 0) {
    this._dataElements$ = this.dataElementsService
      .getAllDataElementsPaged(page)
      .subscribe((response: { last: boolean; content: DataInterface[] }) => {
        this.dataElementsList.push(...response.content);
        if (response.last) {
          this.getProcessingPurposesGroups();
        } else {
          this.getDataElementsGroups(page + 1);
        }
      });
  }

  private getProcessingPurposesGroups(page = 0) {
    this._processingPurposes$ = this.processingPurposeService
      .getAllProcessingPurposesPaged(page)
      .subscribe(
        (response: {
          last: boolean;
          content: BaseCategoryInterface<ProcessingPurposeInterface>[];
        }) => {
          if (this.processingPurposesList) {
            this.processingPurposesList.push(...response.content);
          } else {
            this.processingPurposesList = response.content;
          }
          if (response.last) {
            this.getControlList();
          } else {
            this.getProcessingPurposesGroups(page + 1);
          }
        }
      );
  }

  private getBusinessProcessRecord() {
    return this.activatedRoute.parent.params.pipe(
      flatMap((params: any) => {
        return this.businessProcessService.getBackground(params.id);
      })
    );
  }

  public navigate(url: string) {
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

  onRetentionUnitValueChange() {
    this.step6Form.get('units').valueChanges.subscribe(optionSelected => {
      const periodLength = this.step6Form.get('periodLength');
      const description = this.step6Form.get('description');

      const status: 'unit-selected' | 'other-selected' | 'not-selected' =
        optionSelected && optionSelected.length > 0
          ? optionSelected === 'Other'
            ? 'other-selected'
            : 'unit-selected'
          : 'not-selected';

      switch (status) {
        case 'other-selected':
          UtilsClass.clearControlValidations(periodLength, true, true);
          UtilsClass.applyControlValidations(description, Validators.required);

          break;
        case 'unit-selected':
          UtilsClass.clearControlValidations(description, true, true);
          UtilsClass.applyControlValidations(periodLength, [
            Validators.pattern('^[0-9]*$'),
            Validators.required
          ]);

          break;
        case 'not-selected':
          UtilsClass.clearControlValidations(periodLength, false);
          UtilsClass.clearControlValidations(description, true);
      }
    });
  }

  ngOnDestroy() {
    this.processingPurposesList = [];
    this.dataElementsList = [];
  }

  private getStep6Data() {
    if (this._routeParams$) {
      this._routeParams$.unsubscribe();
    }

    if (
      !this.activatedRoute ||
      !this.activatedRoute.parent ||
      !this.activatedRoute.parent.paramMap
    ) {
      return;
    }

    this._routeParams$ = this.activatedRoute.parent.paramMap.subscribe(
      params => {
        this.businessProcessId = params.get('id');

        this.step6Service
          .getStep6PageData(this.businessProcessId)
          .pipe(first())
          .subscribe(
            response => {
              this.version = response.version;

              this.updateFetchedFieldValues(response);
              this.populateFormFieldsWithFetchedData();

              this.step6Form.markAsUntouched();
              this.setAutosave();
            },
            // [i18n-tobeinternationalized]
            error =>
              this.createBusinessProcessesService.show404ErrorAndRedirect(error)
          );
      }
    );
  }

  private updateFetchedFieldValues(data) {
    this.setReceivedAdditionalProcessingPurposes(
      data.additionalProcessingPurposeIds
    );
    this.setReceivedAdditionalDataElements(data.additionalDataElementIds);
    this.setReceivedDataRetention(data.dataRetention);
    this.fetchedSecurityControlIds = defaultTo([], data.securityControlIds);
    this.fetchedOtherSecurityControlValue = defaultTo(
      '',
      data.securityControlOther
    );
  }

  private setAutosave() {
    this.createBusinessProcessesService.setAutosaveTarget(
      this.version,
      this.businessProcessId,
      () => this.isAutosaveActive(), // TODO: TIMF-4619: Bind using less code clutter
      this.step6Form.valueChanges,
      () => this.saveSecurityAndRisk(), // TODO: TIMF-4619: Bind using less code clutter
      versionResponse => (this.version = versionResponse.version),
      response => this.handleSaveError(response)
    );
  }

  private handleSaveError(error: any) {
    this.createBusinessProcessesService.showCannotSaveToast(error);
  }

  private isAutosaveActive(): boolean {
    if (!this.step6Form.valid) {
      return false;
    }

    if (this.step6Form.pristine) {
      return false;
    }

    return true;
  }

  private populateFormFieldsWithFetchedData() {
    this.populateDataRetentionFieldsWithFetchedData();
    this.populateSecurityControlsWithFetchedData();
    this.step6Form
      .get('securityControlOther')
      .patchValue(this.fetchedOtherSecurityControlValue);
    this.step6Form
      .get('securityControlOtherFlg')
      .patchValue(this.fetchedOtherSecurityControlValue.length > 0);

    this.processingPurposesField.setSelectedDataItems(
      this.fetchedProcessingPurposes
    );
    this.selectedProcessingPurposeIds = this.fetchedProcessingPurposes.map(
      processingPurpose => processingPurpose.id
    );
    this.step6Form
      .get('selectedProcessingPurposeIds')
      .patchValue(this.selectedProcessingPurposeIds);

    this.dataElementsField.setSelectedDataItems(this.fetchedDataElements);
    this.selectedDataElementIds = this.fetchedDataElements.map(
      dataElement => dataElement.id
    );
    this.step6Form
      .get('selectedDataElementIds')
      .patchValue(this.selectedDataElementIds);
    this.updateSelections();
    this.step6DataLoaded = true;
  }

  private updateSelections() {
    this.processingPurposesList = this.processingPurposesList.map(group => ({
      ...group,
      items: group.items.map(item => ({
        ...item,
        selected: this.selectedProcessingPurposeIds.includes(item.id)
      }))
    }));

    this.dataElementsList = this.dataElementsList.map(group => ({
      ...group,
      items: group.items.map(item => ({
        ...item,
        selected: this.selectedDataElementIds.includes(item.id)
      }))
    }));
    this.sortDataElementsList();
  }

  private sortDataElementsList() {
    if (this.dataElementsList) {
      this.dataElementsList.sort((a: any, b: any) =>
        a.label.localeCompare(b.label)
      );
      this.dataElementsList.forEach(element => {
        element.items.sort((a: any, b: any) => a.label.localeCompare(b.label));
      });
    }
  }

  private populateSecurityControlsWithFetchedData() {
    this.fetchedSecurityControlIds.forEach(controlId => {
      const index = _(this.leftSecurityControls.value).findIndex(
        securityControl => securityControl.id === controlId
      );
      if (index >= 0) {
        this.leftSecurityControls.at(index).patchValue({ checked: true });
      }
    });
    this.fetchedSecurityControlIds.forEach(controlId => {
      const index = _(this.rightSecurityControls.value).findIndex(
        securityControl => securityControl.id === controlId
      );
      if (index >= 0) {
        this.rightSecurityControls.at(index).patchValue({ checked: true });
      }
    });
  }

  private populateDataRetentionFieldsWithFetchedData() {
    this.step6Form
      .get('periodLength')
      .patchValue(this.fetchedDataRetention.periodLength);
    this.step6Form.get('units').patchValue(this.fetchedDataRetention.units);
    this.step6Form
      .get('description')
      .patchValue(this.fetchedDataRetention.description);
  }

  private setReceivedAdditionalProcessingPurposes(data) {
    if (
      data &&
      this.processingPurposesList &&
      this.processingPurposesList.length > 0
    ) {
      this.fetchedProcessingPurposes = _(this.processingPurposesList)
        .flatMap(procPurp => procPurp.items)
        .keyBy('id')
        .at(data)
        .value();
    } else {
      this.fetchedProcessingPurposes = [];
    }
  }

  private setReceivedAdditionalDataElements(data) {
    if (data && this.dataElementsList && this.dataElementsList.length > 0) {
      this.fetchedDataElements = _(this.dataElementsList)
        .flatMap(dataElement => dataElement.items)
        .keyBy('id')
        .at(data)
        .value();
    } else {
      this.fetchedDataElements = [];
    }
  }

  private setReceivedDataRetention(data) {
    if (data && data.type) {
      this.fetchedDataRetention = {
        description: data.description,
        units: data.type,
        periodLength: data.value
      };
    } else {
      this.fetchedDataRetention = {};
    }
  }

  public resetForm() {
    this.step6Form.get('periodLength').setValue('');
    this.step6Form.get('units').setValue('');
    this.step6Form.get('description').setValue('');
  }

  public processingPurposesChanged($event) {
    this.selectedProcessingPurposeIds = $event.selectedItems.map(
      item => item.id
    );
    this.step6Form
      .get('selectedProcessingPurposeIds')
      .patchValue(this.selectedProcessingPurposeIds);
    this.step6Form.get('selectedProcessingPurposeIds').markAsDirty();
  }

  public dataElementsChanged($event) {
    this.selectedDataElementIds = $event.selectedItems.map(item => item.id);
    this.step6Form
      .get('selectedDataElementIds')
      .patchValue(this.selectedDataElementIds);
    this.step6Form.get('selectedDataElementIds').markAsDirty();
  }

  private getSecurityControlIds() {
    return _(this.leftSecurityControls.value)
      .concat(this.rightSecurityControls.value)
      .filter(secCon => secCon.checked === true)
      .map(secCon => secCon.id)
      .value();
  }

  private createDataRetentionValueForSave(field) {
    const fieldValue = this.step6Form.get(field)
      ? this.step6Form.get(field).value
      : null;

    return fieldValue !== '' ? fieldValue : null;
  }

  private getDataRetention() {
    const dataRetention = {
      description: this.createDataRetentionValueForSave('description'),
      type: this.createDataRetentionValueForSave('units'),
      value: this.createDataRetentionValueForSave('periodLength')
    };

    // type is a required field if any fields are being saved so it should suffice by itself for this check.
    if (dataRetention.type) {
      return dataRetention;
    }

    return null;
  }

  private getSecurityControlOtherValueForSave() {
    this._securityControlOtherValue =
      this.step6Form.get('securityControlOther') &&
      this.step6Form.get('securityControlOtherFlg').value === true
        ? this.step6Form.get('securityControlOther').value
        : null;

    return this._securityControlOtherValue;
  }

  public canDeactivate(
    step6Component: Step6Component,
    currentRoute,
    currentState
  ): Observable<boolean> | boolean {
    if (!step6Component.checkValidityOfSave()) {
      return false;
    }
    return step6Component.createBusinessProcessesService.save();
  }

  private checkValidityOfSave() {
    if (this.createBusinessProcessesService.isUpdatingSubject.getValue()) {
      this.toastService.info(
        `Saving.  You can change pages after saving completes.`
      ); // [i18n-tobeinternationalized]
      return false;
    }

    if (!this.step6Form.valid) {
      return false;
    }

    if (!this.step6DataLoaded) {
      return false;
    }

    return true;
  }

  private saveSecurityAndRisk(): Observable<BaseDomainInterface> {
    const saveRequestData = {
      version: this.version,
      id: this.businessProcessId,
      additionalProcessingPurposeIds: this.selectedProcessingPurposeIds,
      additionalDataElementIds: this.selectedDataElementIds,
      dataRetention: this.getDataRetention(),
      securityControlIds: this.getSecurityControlIds(),
      securityControlOther: this.getSecurityControlOtherValueForSave()
    };
    return this.step6Service.save(saveRequestData);
  }
}
