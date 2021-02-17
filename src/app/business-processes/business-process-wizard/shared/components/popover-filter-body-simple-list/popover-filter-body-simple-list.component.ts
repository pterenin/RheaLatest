import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FormItemInterface } from 'src/app/shared/_interfaces';

declare const _: any;

@Component({
  selector: 'ta-popover-filter-body-simple-list',
  templateUrl: './popover-filter-body-simple-list.component.html',
  styleUrls: ['./popover-filter-body-simple-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopoverFilterBodySimpleListComponent implements OnInit {
  @Input() public filterData: FormItemInterface[] = [];
  @Input() public withSearch = true;

  // [i18n-tobeinternationalized]
  @Input() public selectAllPlaceholder = 'Select All';

  public isAllSelected = false;
  public isIndeterminate = false;
  public isSomeSelected = false;

  public filterForm: FormGroup;

  public get list(): FormArray {
    return this.filterForm.get('list') as FormArray;
  }

  constructor(private formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
      list: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.initFormData();
  }

  public initFormData() {
    (this.filterData || []).forEach(item => {
      this.list.push(
        this.formBuilder.group({
          id: item.id,
          label: item.label,
          checked: false,
          hidden: false
        })
      );
    });

    this.list.valueChanges.subscribe(value => {
      this.isSomeSelected = value.some(item => item.checked === true);
      this.isAllSelected = value.every(item => item.checked === true);
      this.isIndeterminate = !this.isAllSelected && this.isSomeSelected;
    });
  }

  public getFilterFormValue() {
    return this.filterForm.value.list;
  }

  public resetFilterForm() {
    this.setForEachCheckedStatus(false);
  }

  onSearch(event) {
    const { searchValue = '' } = event;

    this.list.controls.forEach(control => {
      const label = control.get('label').value;
      const regExp = new RegExp(searchValue, 'gi');
      const visible = regExp.test(label);
      control.get('hidden').setValue(!visible);
    });
  }

  public handleSelectAll(event) {
    const { checked } = event.target;
    this.setForEachCheckedStatus(checked);
  }

  public setForEachCheckedStatus(checked: boolean) {
    this.list.controls.forEach(control => {
      control.get('checked').setValue(checked);
    });
  }
}
