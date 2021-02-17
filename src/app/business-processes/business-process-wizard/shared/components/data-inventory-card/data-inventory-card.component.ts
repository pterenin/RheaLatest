import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TableService } from '@trustarc/ui-toolkit';
import { Subscription } from 'rxjs';
import { remove, map, uniqBy } from 'lodash';

@Component({
  selector: 'ta-data-inventory-card',
  templateUrl: './data-inventory-card.component.html',
  styleUrls: ['./data-inventory-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataInventoryCardComponent implements OnInit, OnDestroy {
  @Input() gridID: string;
  @Input() type: 'PP' | 'DE';
  @Input() title: string;
  @Input() subtitle: string;
  @Input() image: string;
  @Input() subImageString: string;
  @Input() subImageStringBtnText: string;
  @Input() subImageStringBtnType: string;
  @Input() columnsSettings: { name: string; sortBy?: string }[];
  @Input() rowsSettings: {
    pathId: string;
    pathName: string;
    pathCategoryName: string;
    pathCategoryId: string;
  };

  public categoryIds: string[];
  public categoryMap = new Map<string, string>();

  // Setter/Getter for data input
  private _data: any;
  @Input() set data(value: any) {
    if (value) {
      this._data = value;
      this.categoryIds = Object.keys(value);
      this.buildCategoryMap(this._data);
      this.buildForm(this._data);
      this.buildFilterForm();
      this.applyFilterForm();
    }
  }
  get data(): any {
    return this._data;
  }

  // Setter/Getter for selectedData input
  private _selectedData: any;
  @Input() set selectedData(value: any) {
    if (value) {
      this._selectedData = value;
      this.patchForm(this._selectedData);
    }
  }
  get selectedData(): any {
    return this._selectedData;
  }

  get filters() {
    return this.filterForm.get('filters') as FormArray;
  }

  public form: FormGroup;
  public selectedCategoryId: string;
  public tableSearchString = '';
  public addFormSearchString = '';

  eventRequestRef: Subscription = null;
  public rowsData: any[] = [];

  public filterForm: FormGroup;
  filterChecked: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private tableService: TableService
  ) {
    this.filterForm = this.formBuilder.group({
      filters: this.formBuilder.array([])
    });
    this.columnsSettings = [];
  }

  ngOnInit() {
    this.eventRequestRef = this.tableService
      .listenRequestEvents(this.gridID)
      .subscribe(req => {
        if (req['sortType']) {
          this.sortRows(req['columnSort'], req['sortType']);
        }
      });
  }

  public buildCategoryMap(data) {
    this.categoryIds.forEach(id => {
      const [first = {}] = data[id];
      if (first) {
        this.categoryMap.set(id, first[this.rowsSettings.pathCategoryName]);
      }
    });
  }

  public buildForm(data) {
    const group = {};
    this.categoryIds.forEach(id => (group[id] = this.formBuilder.array([])));
    this.form = this.formBuilder.group(group);

    this.categoryIds.forEach(id => {
      data[id].forEach(item => {
        const control = this.formBuilder.group({
          id: item[this.rowsSettings.pathId],
          name: item[this.rowsSettings.pathName],
          category: item[this.rowsSettings.pathCategoryName],
          categoryId: item[this.rowsSettings.pathCategoryId],
          checked: false,
          hidden: item.hidden || false
        });
        (this.form.get(id) as FormArray).push(control);
      });
    });

    this.selectedCategoryId = Object.keys(data)[0];
  }

  public buildFilterForm() {
    this.filterForm = this.formBuilder.group({
      filters: this.formBuilder.array([])
    });

    this.categoryIds.forEach(id => {
      (this.filterForm.get('filters') as FormArray).push(
        this.formBuilder.group({
          id,
          name: this.categoryMap.get(id),
          checked: false
        })
      );
    });
  }

  public patchForm(data: string[]) {
    Object.keys(this.form.value).forEach(key => {
      (this.form.get(key) as FormArray).controls.forEach(control => {
        const { value } = control;
        if (data.includes(value.id)) {
          control.get('checked').setValue(true);
          this.rowsData.push(value);
        }
      });
    });
    this.rowsData = [...this.rowsData];
  }

  public onTableSearch(event) {
    this.tableSearchString = event;
  }

  public sortRows(column, type) {
    if (type === '' || type === 'asc') {
      type = 'desc';
      this.rowsData.sort((b, a) => {
        return b[column].toString().localeCompare(a[column].toString());
      });
      this.rowsData = [...this.rowsData];
    } else if (type === 'desc') {
      type = 'asc';
      this.rowsData.sort((a, b) => {
        return b[column].toString().localeCompare(a[column].toString());
      });
      this.rowsData = [...this.rowsData];
    }
  }

  public onAddFormSearch(event) {
    this.addFormSearchString = event;

    // Need to wait till end of filtering pipe run before making new selection
    setTimeout(() => {
      const eligible = [];
      Object.keys(this.form.value).forEach(key => {
        const { value } = this.form.get(key);
        const show = value.filter(item => item.hidden === false).length > 0;
        if (show) {
          eligible.push(key);
        }
      });

      if (eligible.length > 0) {
        this.selectedCategoryId = eligible[0];
      }
    }, 0);
  }

  public getSelectedCounterString() {
    const selected = this.rowsData.filter(r => r.isSelected === true);

    // [i18n-tobeinternationalized]
    return `${selected.length} of ${this.rowsData.length} item(s) selected`;
  }

  public determineCategoryVisibility(categoryId) {
    const { value = [] } = this.form.get(categoryId);
    return value.filter(item => item.hidden === false).length === 0;
  }

  public selectCategory(categoryId) {
    this.selectedCategoryId = categoryId;
  }

  public getSearchPlaceholderByType(type: 'PP' | 'DE') {
    switch (type) {
      case 'PP':
        // [i18n-tobeinternationalized]
        return 'Search Processing Purposes';
      case 'DE':
        // [i18n-tobeinternationalized]
        return 'Search Data Elements';
    }
  }

  public isDeleteDisabled() {
    return !this.rowsData.some(r => r.isSelected === true);
  }

  public deleteSelectedRows() {
    const selected = this.rowsData.filter(r => r.isSelected === true);

    // Update table data
    this.rowsData = this.rowsData.filter(r => r.isSelected !== true);

    // Update form selections
    selected.forEach(row => {
      const categoryIdField = this.rowsSettings.pathCategoryId;
      const idField = this.rowsSettings.pathId;
      this.resetFormControlForCategoryIdToState(
        row[categoryIdField],
        row[idField],
        false
      );
    });
  }

  public deleteRowById(event) {
    const { row } = event;

    const categoryIdField = this.rowsSettings.pathCategoryId;
    const categoryId = row[categoryIdField];

    this.resetFormControlForCategoryIdToState(categoryId, row.id, false);
    this.rowsData = this.rowsData.filter(r => r.id !== row.id);
  }

  public handleItemCheckboxChange(event, control) {
    const { checked } = event.target;
    const { value } = control;

    if (checked) {
      this.rowsData.push(value);
      this.rowsData = [...this.rowsData];
    } else {
      this.rowsData = this.rowsData.filter(r => r.id !== value.id);
    }
  }

  public isIndeterminateForCategory(category) {
    const value = this.form.get(category).value;

    const checks = map(value, 'checked');
    const allFalse = checks.every(i => i === false);
    const allTrue = checks.every(i => i === true);

    return !allFalse && !allTrue;
  }

  public isCheckedForCategory(category) {
    const value = this.form.get(category).value;

    const checks = map(value, 'checked');
    return checks.every(i => i === true);
  }

  public getCounterStringForCategory(category) {
    const value = this.form.get(category).value;

    const checks = map(value, 'checked');
    const qtySelected = checks.filter(i => i === true).length;
    const qtyTotal = checks.length;

    // [i18n-tobeinternationalized]
    return `Selected ${qtySelected} of ${qtyTotal}`;
  }

  public selectAllForCategory(event, category) {
    const { checked } = event.target;
    const controls = (this.form.get(category) as FormArray).controls;

    controls.forEach(control => {
      control.get('checked').setValue(checked);

      if (checked) {
        this.rowsData.push(control.value);
      } else {
        remove(this.rowsData, r => r.id === control.value.id);
      }
    });

    this.rowsData = uniqBy([...this.rowsData], 'id');
  }

  public resetFormToState(state: boolean) {
    Object.keys(this.form.value).forEach(key => {
      const controls = (this.form.get(key) as FormArray).controls;
      controls.forEach(control => control.get('checked').setValue(state));
    });
  }

  public resetFormControlForCategoryIdToState(
    categoryId: string,
    itemId: string,
    state: boolean
  ) {
    const controls = (this.form.get(categoryId) as FormArray).controls;
    controls.forEach(control => {
      if (control.value.id === itemId) {
        control.get('checked').setValue(state);
      }
    });
  }

  public applyFilterForm() {
    const value = (this.filterForm.get('filters') as FormArray).value;
    const checkedValues = value.filter(item => item.checked === true);
    this.filterChecked = map(checkedValues, 'id');
  }

  public resetFilterFormToState(state: boolean) {
    const controls = (this.filterForm.get('filters') as FormArray).controls;
    controls.forEach(control => control.get('checked').setValue(state));
  }

  public getFilterFormCounter() {
    const value = (this.filterForm.get('filters') as FormArray).value;
    return value.filter(item => item.checked === true).length;
  }

  public isFiltersDirty() {
    const value = (this.filterForm.get('filters') as FormArray).value;
    return !value.every(item => item.checked === false);
  }

  public getRowsData() {
    return this.rowsData;
  }

  public handleRowCheckboxChange(change) {
    const { event, row } = change;
    const { checked } = event.target;

    row.isSelected = checked;
    this.rowsData = [...this.rowsData];
  }

  public isAllSelected(): boolean {
    if (!this.rowsData || !this.rowsData.length) {
      return false;
    }

    return this.rowsData.every(r => r.isSelected);
  }

  public isSomeSelected(): boolean {
    if (!this.rowsData || !this.rowsData.length) {
      return false;
    }

    return this.rowsData.some(r => r.isSelected);
  }

  public isIndeterminate(): boolean {
    if (!this.rowsData || !this.rowsData.length) {
      return false;
    }

    return !this.isAllSelected() && this.isSomeSelected();
  }

  public allFiltersClick($event) {
    $event.preventDefault();
    if (this.isSomeSelected()) {
      this.deselectAll();
    } else {
      this.selectAll();
    }
  }

  public selectAll() {
    this.rowsData.forEach(r => (r.isSelected = true));
  }

  public deselectAll() {
    this.rowsData.forEach(r => (r.isSelected = false));
  }

  ngOnDestroy() {
    if (this.eventRequestRef) {
      this.eventRequestRef.unsubscribe();
    }
  }
}
