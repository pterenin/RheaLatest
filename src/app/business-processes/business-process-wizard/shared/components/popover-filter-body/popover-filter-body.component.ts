import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

declare const _: any;

@Component({
  selector: 'ta-popover-filter-body',
  templateUrl: './popover-filter-body.component.html',
  styleUrls: ['./popover-filter-body.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopoverFilterBodyComponent implements OnInit {
  @Input() public filterData: any = {};
  @Input() public gridId: string;

  public filterForm: FormGroup;

  public isFilterEnabledCategory = false;
  public isFilterEnabledLocations = false;
  public isFilterEnabledDataElements = false;
  public isFilterEnabledProcessingPurposes = false;

  public get categories(): FormArray {
    return this.filterForm.get('categories') as FormArray;
  }
  public get locations(): FormArray {
    return this.filterForm.get('locations') as FormArray;
  }
  public get dataElements(): FormArray {
    return this.filterForm.get('dataElements') as FormArray;
  }
  public get processingPurposes(): FormArray {
    return this.filterForm.get('processingPurposes') as FormArray;
  }

  constructor(private formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
      categories: this.formBuilder.array([]),
      locations: this.formBuilder.array([]),
      dataElements: this.formBuilder.array([]),
      processingPurposes: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.initFormData();
    this.getFiltersAvailability();
  }

  public initFormData() {
    Object.keys(this.filterData || {}).forEach(key => {
      _.chain(this.filterData[key].data)
        .uniqBy('id')
        .sort()
        .value()
        .forEach(item => {
          (this.filterForm.get(key) as FormArray).push(
            this.formBuilder.group({
              id: item.id,
              label: item.label,
              checked: false,
              hidden: false
            })
          );
        });
    });
  }

  public getFiltersAvailability() {
    this.isFilterEnabledCategory = this.filterExists('categories');
    this.isFilterEnabledLocations = this.filterExists('locations');
    this.isFilterEnabledDataElements = this.filterExists('dataElements');
    this.isFilterEnabledProcessingPurposes = this.filterExists(
      'processingPurposes'
    );
  }

  private filterExists(type) {
    return Object.keys(this.filterData || {}).includes(type);
  }

  public isDirty() {
    const someCategories = this.categories.value.some(
      item => item.checked === true
    );
    const someLocations = this.locations.value.some(
      item => item.checked === true
    );
    const someDataElements = this.dataElements.value.some(
      item => item.checked === true
    );
    const someProcessingPurposes = this.processingPurposes.value.some(
      item => item.checked === true
    );

    return (
      this.filterForm.dirty &&
      (someCategories ||
        someLocations ||
        someDataElements ||
        someProcessingPurposes)
    );
  }

  public getFilterFormValue() {
    return this.filterForm.value;
  }

  public resetFilterForm() {
    this.categories.controls.forEach(control => {
      control.get('checked').setValue(false);
    });
    this.locations.controls.forEach(control => {
      control.get('checked').setValue(false);
    });
    this.dataElements.controls.forEach(control => {
      control.get('checked').setValue(false);
    });
    this.processingPurposes.controls.forEach(control => {
      control.get('checked').setValue(false);
    });
  }

  public getFilterHeaderTitle() {
    const count = this.getSelectedFiltersCount();

    // [i18n-tobeinternationalized]
    return `Filters (${count})`;
  }

  public getSelectedFiltersCount() {
    const selectedCategories = this.categories.value.filter(
      item => item.checked === true
    );
    const selectedLocations = this.locations.value.filter(
      item => item.checked === true
    );
    const selectedDataElements = this.dataElements.value.filter(
      item => item.checked === true
    );
    const selectedProcessingPurposes = this.processingPurposes.value.filter(
      item => item.checked === true
    );

    return (
      selectedCategories.length +
      selectedLocations.length +
      selectedDataElements.length +
      selectedProcessingPurposes.length
    );
  }

  onSearch(event, filterType) {
    const filterId = this.filterData[filterType].id;
    (this.filterForm.get(filterId) as FormArray).controls.forEach(control => {
      const label = control.get('label').value;
      const regExp = new RegExp(event, 'gi');
      const visible = regExp.test(label);
      control.get('hidden').setValue(!visible);
    });
  }
}
