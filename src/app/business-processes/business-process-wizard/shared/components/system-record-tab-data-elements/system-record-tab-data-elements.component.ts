import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  AfterContentChecked,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { TableService } from '@trustarc/ui-toolkit';
import { DataElementInterface } from 'src/app/shared/models/data-elements.model';
import { DataElementPipe } from 'src/app/shared/pipes/data-element/data-element.pipe';

declare const _: any;

@Component({
  selector: 'ta-system-record-tab-data-elements',
  templateUrl: './system-record-tab-data-elements.component.html',
  styleUrls: ['./system-record-tab-data-elements.component.scss']
})
export class SystemRecordTabDataElementComponent
  implements OnInit, OnDestroy, AfterContentChecked {
  @Input() public id: string;
  @Input() public type: string;
  @Input() public dataAttachedDataFlow: any;
  @Input() public dataAttachedInventory: any;
  @Input() public dataAvailable: any;
  @Input() public itSystemReadOnly: any;
  @Output() public validityUpdated = new EventEmitter();
  @Output() public selectionsUpdated = new EventEmitter();
  @Output() public updateSelected = new EventEmitter();

  public isCollapsedAttached: boolean;
  public isCollapsedAdditional: boolean;

  public gridIdAttached: string;
  public gridIdAvailable: string;
  public gridIdSystemReadOnly: string;

  public dataElementsProcessed: any[];
  public dataElementsProcessedIds: string[];
  public dataElementIdsFromInventory: string[];
  public dataElementIdsFromDataFlow: string[];

  public dataElementsAvailable: DataElementInterface[];
  public searchValue: string;
  public isReady: boolean;
  public initialSelectedAddedIds: string[];

  public filterForm: FormGroup;
  public filterChecked: any[];
  public filterCheckedCategories: string[];

  constructor(
    private tableService: TableService,
    private formBuilder: FormBuilder,
    private dataElementPipe: DataElementPipe,
    private cdRef: ChangeDetectorRef
  ) {
    this.isCollapsedAttached = false;
    this.isCollapsedAdditional = false;
    this.isReady = false;
    this.filterChecked = [];
    this.filterCheckedCategories = [];
    this.initialSelectedAddedIds = [];

    this.filterForm = this.formBuilder.group({
      filters: this.formBuilder.array([])
    });

    this.gridIdSystemReadOnly = 'gridIdSystemReadOnly';
  }

  ngOnInit() {
    this.initGridIds();
    this.addCategoryToItSystemReadOnlyItem();
    this.initDataElementIdsForCurrentType(this.type);
    this.initDataElementIdsAvailableForCurrentType(this.type);
    this.initDataElementsProcessedForCurrentType(this.type);
    this.initFilterForFormArray();

    setTimeout(() => {
      this.isReady = true;
      this.validityUpdated.emit(true);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeFromAll();
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
    const isChanged = this.isChanged();
    this.selectionsUpdated.emit(isChanged);
  }

  private initGridIds() {
    this.gridIdAttached = `${this.id}-de-attached`;
    this.gridIdAvailable = `${this.id}-de-available`;
  }

  private initDataElementIdsForCurrentType(type) {
    if (type === 'withDataFlow') {
      this.dataElementIdsFromDataFlow = this.dataAttachedDataFlow.dataElementIds.map(
        item => item
      );
      this.initialSelectedAddedIds = this.dataElementIdsFromDataFlow;
      this.dataElementIdsFromInventory = this.dataAttachedInventory.dataElements.map(
        item => item.id
      );
      this.dataElementsProcessedIds = [
        ...this.dataElementIdsFromDataFlow,
        ...this.dataElementIdsFromInventory
      ];
    }
  }

  private initDataElementIdsAvailableForCurrentType(type) {
    if (type === 'withDataFlow') {
      this.dataElementsAvailable = Array.from(this.dataAvailable);
    }
  }

  private initDataElementsProcessedForCurrentType(type) {
    if (type === 'withDataFlow') {
      const dataElementsProcessedFromDataFlow = this.getDataElementsProcessedByAvailableIds(
        this.dataAvailable,
        this.dataElementIdsFromDataFlow
      );
      const dataElementsProcessedFromInventory = this.getDataElementsProcessedByAvailableIds(
        this.dataAvailable,
        this.dataElementIdsFromInventory
      );
      this.dataElementsProcessed = _.union(
        dataElementsProcessedFromDataFlow,
        dataElementsProcessedFromInventory
      );

      this.dataElementsProcessed = _.cloneDeep(this.dataElementsProcessed);
      this.dataElementsProcessed.forEach(data => {
        data.isSelected = this.determineSelected(data.id);
      });
    }
  }

  private getDataElementsProcessedByAvailableIds(dataAvailable, ids) {
    return dataAvailable.filter(item => ids.includes(item.id));
  }

  public determineSelected(id) {
    return this.initialSelectedAddedIds.includes(id);
  }

  public getSelectedCount(data) {
    return data.filter(d => d.isSelected).length;
  }

  public addCategoryToItSystemReadOnlyItem() {
    if (this.itSystemReadOnly) {
      this.itSystemReadOnly.forEach(
        item =>
          (item.category = this.dataElementPipe.transform(
            item,
            'lookup',
            this.dataAvailable
          ))
      );
    }
  }

  private getSelected(data = []) {
    return data
      .filter(d => d.isSelected)
      .map(selected => selected.id)
      .sort();
  }

  private isChanged() {
    const resultDataElementsAvailable = this.dataElementsAvailable
      ? this.dataElementsAvailable.filter(
          item => !this.dataElementsProcessedIds.includes(item.id)
        )
      : [];
    const selectedFromAvailableIds = this.getSelected(
      resultDataElementsAvailable
    );
    const selectedFromAddedIds = this.getSelected(this.dataElementsProcessed);

    this.updateSelected.emit([
      ...selectedFromAddedIds,
      ...selectedFromAvailableIds
    ]);
    return {
      added: !_.isEqual(
        _.uniq(selectedFromAddedIds),
        _.uniq(this.initialSelectedAddedIds.sort())
      ),
      available: selectedFromAvailableIds.length !== 0
    };
  }

  private unsubscribeFromAll() {
    this.selectionsUpdated.emit({
      added: false,
      available: false
    });
  }

  public onSearch($event) {
    this.searchValue = $event.searchValue;
  }

  public get filters(): FormArray {
    return this.filterForm.get('filters') as FormArray;
  }

  public initFilterForFormArray() {
    _.chain(this.dataAvailable || [])
      .map('category')
      .uniq()
      .sort()
      .value()
      .forEach(item => {
        this.filters.push(
          this.formBuilder.group({
            name: item,
            checked: false
          })
        );
      });

    this.filterForm.valueChanges.subscribe(() => {
      this.filterChecked = this.filters.value.filter(
        item => item.checked === true
      );
    });
  }

  public isFiltersDirty() {
    const selected = this.filters.value.filter(item => item.checked === true);
    return this.filterForm.dirty && selected.length > 0;
  }

  public resetFilterForm() {
    this.filterChecked = [];
    this.filterCheckedCategories = [];

    this.filters.controls.forEach(item => {
      item.markAsPristine();
      (item as FormGroup).controls.checked.setValue(false);
    });
  }

  public applyFilterForm() {
    this.filterCheckedCategories = this.filterChecked.map(item => item.name);
  }
}
