import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { exists } from 'src/app/shared/utils/basic-utils';
import {
  DataSubjectFieldInterface,
  DataSubjectLocationsForRequest
} from 'src/app/data-inventory/my-inventory/it-system/it-system-details/it-system-details.model';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { TaModal } from '@trustarc/ui-toolkit';
import { LocationModalContentComponent } from 'src/app/shared/components/location-modal-content/location-modal-content.component';

declare const _: any;
@AutoUnsubscribe(['_formChangeSubscription'])
@Component({
  selector: 'ta-input-individual-type',
  templateUrl: './input-individual-type.component.html',
  styleUrls: ['./input-individual-type.component.scss']
})
export class InputIndividualTypeComponent implements OnDestroy, OnChanges {
  @Input() public redesign = false;
  @Input() public header: String;
  @Input() public iconTypeTooltip: 'information-circle' | 'help' =
    'information-circle';
  @Input() individualTypes: any[];
  @Input() dataSubjectsWithLocations: any[];
  @Input() fullCountriesList: any[];
  @Output() dataSubjectLocationsChanges = new EventEmitter();
  @Input() showRiskFields: boolean;
  @Output() toggleDisabled = new EventEmitter();

  public individualTypeForm: FormGroup;
  public dataSubjectForms: FormArray;
  public selectedLocationDataSnapshot: [];
  public locationData = [];
  public locationDataSnapshot = [];

  constructor(private formBuilder: FormBuilder, private modalService: TaModal) {
    this.individualTypeForm = formBuilder.group({
      dataSubjectForms: this.formBuilder.array([])
    });
    this.dataSubjectForms = this.individualTypeForm.get(
      'dataSubjectForms'
    ) as FormArray;

    this.clearFormDataSubjectTypeArray();
  }

  ngOnChanges() {
    this.dataSubjectsWithLocations = this.dataSubjectsWithLocations
      ? this.dataSubjectsWithLocations
      : [];
    this.loadDataSubjectLocations();
  }

  ngOnDestroy() {}

  public editSubjectUsedByBP(subject) {
    this.toggleDisabled.emit(subject.dataSubjectTypeId);
  }

  public toggleSubjectDisabled(id: String) {
    const formArray = this.individualTypeForm.get(
      'dataSubjectForms'
    ) as FormArray;
    formArray.controls.forEach(element => {
      if (element.get('dataSubjectTypeId').value.id === id) {
        element.get('disable').patchValue(!element.get('disable').value);
      }
    });
  }

  private clearFormDataSubjectTypeArray(): void {
    if (this.dataSubjectForms) {
      this.dataSubjectForms.value.forEach((dataSubjectType, index) => {
        this.dataSubjectForms.removeAt(index);
      });
    }
  }

  private loadDataSubjectLocations() {
    this.clearFormDataSubjectTypeArray();
    this.dataSubjectForms.updateValueAndValidity();

    if (this.dataSubjectsWithLocations.length === 0) {
      this.addEmptyDataSubjectTypeRow();
    }
    this.dataSubjectsWithLocations.forEach(dataSubjectType => {
      const existingDataSubjectType = this.dataSubjectForms.value.find(
        formDsSubjectType =>
          formDsSubjectType.dataSubjectTypeId.id ===
          dataSubjectType.dataSubjectTypeId
      );

      if (!exists(existingDataSubjectType)) {
        const foundIndividualType = this.individualTypes.find(
          individualType =>
            individualType.id === dataSubjectType.dataSubjectTypeId
        );
        const newDataSubjectType: DataSubjectFieldInterface = {
          id: dataSubjectType.id,
          dataSubjectTypeId: foundIndividualType,
          disable:
            dataSubjectType.disable != null
              ? dataSubjectType.disable
              : dataSubjectType.businessProcessUsage.length > 0, // TODO How to get actual data
          locations: this.mapLocationsValueToCountry(dataSubjectType.locations)
        };

        this.dataSubjectForms.push(
          this.createDataSubjectTypeForm(newDataSubjectType)
        );
      }
    });
  }

  public addEmptyDataSubjectTypeRow(): void {
    const dataSubject = {
      id: _.uniqueId('data-subject-'),
      dataSubjectTypeId: null,
      locations: null,
      disable: false
    };
    this.dataSubjectForms.push(this.createDataSubjectTypeForm(dataSubject));
  }

  private createDataSubjectTypeForm(
    dataSubjectType: DataSubjectFieldInterface
  ): FormGroup {
    const newDataSubjectTypeWithValidation = {
      ...dataSubjectType,
      dataSubjectTypeId: new FormControl(dataSubjectType.dataSubjectTypeId),
      locations: new FormControl(dataSubjectType.locations),
      disable: new FormControl(dataSubjectType.disable)
    };

    const newDataSubjectTypeForm = this.formBuilder.group(
      newDataSubjectTypeWithValidation
    );

    return newDataSubjectTypeForm;
  }

  public onDataSubjectTouched(item, index) {
    const dataSubjectSelected = this.dataSubjectForms
      .get(String(index))
      .get('dataSubjectTypeId').value;

    const dataSubjectLocations = this.dataSubjectForms
      .get(String(index))
      .get('locations').value;

    if (
      dataSubjectSelected &&
      (!dataSubjectLocations || dataSubjectLocations.length === 0)
    ) {
      this.openDataSubjectLocationModal(index, dataSubjectSelected, []);
    }

    this.emitValue();
  }

  public removeLocation(index): void {
    this.dataSubjectForms = this.individualTypeForm.get(
      'dataSubjectForms'
    ) as FormArray;

    this.dataSubjectForms.removeAt(index);
    this.dataSubjectForms.markAsDirty();
    this.dataSubjectForms.markAsTouched();

    this.emitValue();
  }

  public openDataSubjectLocationModal(index, dataSubject, locations) {
    if (!dataSubject) {
      return;
    }
    locations = !locations ? [] : locations;

    const modalRef = this.modalService.open(LocationModalContentComponent);

    modalRef.componentInstance.type = 'Data Subject Location';
    modalRef.componentInstance.typeName = dataSubject.dataSubjectType;
    modalRef.componentInstance.style = 'width: 600px;';
    modalRef.componentInstance.stateProvinceIsSelectable = true;
    modalRef.componentInstance.selectedLocationData = _.cloneDeep(locations);
    modalRef.componentInstance.locationDataProp = 'stateOrProvinces';
    modalRef.componentInstance.ignoreStatusSaveBtn = true;
    modalRef.componentInstance.redesign = this.redesign;

    if (this.locationData.length) {
      modalRef.componentInstance.locationData = _.cloneDeep(this.locationData);
      modalRef.componentInstance.locationDataSnapshot = _.cloneDeep(
        this.locationDataSnapshot
      );
    }

    modalRef.componentInstance.selectedLocationDataSnapshot =
      this.selectedLocationDataSnapshot || [];

    modalRef.result.then(
      ([
        selectedLocationData,
        dataElements,
        selectedLocationDataSnapshot,
        locationData
      ]) => {
        selectedLocationData.forEach(region => {
          if (
            Array.isArray(region.selectedStates) &&
            !region.selectedStates.length
          ) {
            region.selected = false;
          }
        });

        this.selectedLocationDataSnapshot = selectedLocationDataSnapshot;
        this.locationData = _.cloneDeep(locationData);
        this.locationDataSnapshot = _.cloneDeep(selectedLocationData);

        this.updateFormLocations(index, [...selectedLocationData]);

        this.emitValue();
      },
      cancelMessage => {}
    );
  }

  private getDataForRequest() {
    const result: DataSubjectLocationsForRequest[] = [];
    this.dataSubjectForms.value.forEach(dataSubject => {
      if (dataSubject.dataSubjectTypeId) {
        result.push({
          dataSubjectTypeId: dataSubject.dataSubjectTypeId,
          locations: !dataSubject.locations ? [] : dataSubject.locations
        });
      }
    });

    return result;
  }

  private emitValue() {
    this.dataSubjectLocationsChanges.emit(this.getDataForRequest());
  }

  private mapLocationsValueToCountry(dataSubjectLocations): any[] {
    const locations = [];
    dataSubjectLocations.map(dsLocation => {
      const countryExists = locations.find(
        loc => loc.id === dsLocation.countryId
      );

      let countryData = null;
      this.fullCountriesList.map(region => {
        const countryInfo = region.countries.find(
          country => country.id === dsLocation.countryId
        );

        if (countryInfo) {
          countryData = Object.assign({}, countryInfo);
        }
      });

      if (!countryExists) {
        if (dsLocation.stateOrProvinceId) {
          countryData.selectedStates = [dsLocation.stateOrProvinceId];
        }
        locations.push(countryData);
      } else {
        if (countryExists.selectedStates) {
          countryExists.selectedStates.push(dsLocation.stateOrProvinceId);
        } else {
          countryData.selectedStates = [dsLocation.stateOrProvinceId];
        }
      }
    });
    return locations;
  }

  public updateFormLocations(index, locationData) {
    this.dataSubjectForms
      .get(String(index))
      .get('locations')
      .patchValue(locationData);

    this.emitValue();
  }

  public getIndividualTypesList() {
    if (!this.individualTypes) {
      return [];
    }
    const ids = this.dataSubjectForms.value.map(ds =>
      ds.dataSubjectTypeId ? ds.dataSubjectTypeId.id : null
    );
    return this.individualTypes.filter(type => !_.includes(ids, type.id));
  }
}
