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
import { ProcessingPurposePipe } from 'src/app/shared/pipes/processing-purpose/processing-purpose.pipe';
import { ProcessingPurposeInterface } from 'src/app/shared/models/processing-purposes.model';

declare const _: any;

@Component({
  selector: 'ta-system-record-tab-processing-purposes',
  templateUrl: './system-record-tab-processing-purposes.component.html',
  styleUrls: ['./system-record-tab-processing-purposes.component.scss']
})
export class SystemRecordTabProcessingPurposeComponent
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

  public processingPurposesProcessed: any[];
  public processingPurposesProcessedIds: string[];
  public processingPurposeIdsFromInventory: string[];
  public processingPurposeIdsFromDataFlow: string[];

  public processingPurposesAvailable: ProcessingPurposeInterface[];
  public searchValue: string;
  public isReady: boolean;
  public initialSelectedAddedIds: string[];

  public filterForm: FormGroup;
  public filterChecked: any[];
  public filterCheckedCategories: string[];

  constructor(
    private tableService: TableService,
    private formBuilder: FormBuilder,
    private processingPurposePipe: ProcessingPurposePipe,
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
    this.initProcessingPurposeIdsForCurrentType(this.type);
    this.initProcessingPurposeIdsAvailableForCurrentType(this.type);
    this.initProcessingPurposesProcessedForCurrentType(this.type);
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
    this.gridIdAttached = `${this.id}-pp-attached`;
    this.gridIdAvailable = `${this.id}-pp-available`;
  }

  private initProcessingPurposeIdsForCurrentType(type) {
    if (type === 'withDataFlow') {
      this.processingPurposeIdsFromDataFlow = this.dataAttachedDataFlow.processingPurposeIds.map(
        item => item
      );
      this.initialSelectedAddedIds = this.processingPurposeIdsFromDataFlow;
      this.processingPurposeIdsFromInventory = this.dataAttachedInventory.processingPurpose.map(
        item => item.id
      );
      this.processingPurposesProcessedIds = [
        ...this.processingPurposeIdsFromDataFlow,
        ...this.processingPurposeIdsFromInventory
      ];
    }
  }

  private initProcessingPurposeIdsAvailableForCurrentType(type) {
    if (type === 'withDataFlow') {
      this.processingPurposesAvailable = Array.from(this.dataAvailable);
    }
  }

  private initProcessingPurposesProcessedForCurrentType(type) {
    if (type === 'withDataFlow') {
      const processingPurposesProcessedFromDataFlow = this.getProcessingPurposesProcessedByAvailableIds(
        this.dataAvailable,
        this.processingPurposeIdsFromDataFlow
      );
      const processingPurposesProcessedFromInventory = this.getProcessingPurposesProcessedByAvailableIds(
        this.dataAvailable,
        this.processingPurposeIdsFromInventory
      );
      this.processingPurposesProcessed = _.union(
        processingPurposesProcessedFromDataFlow,
        processingPurposesProcessedFromInventory
      );
      this.processingPurposesProcessed = _.cloneDeep(
        this.processingPurposesProcessed
      );
      this.processingPurposesProcessed.forEach(data => {
        data.isSelected = this.determineSelected(data.id);
      });
    }
  }

  private getProcessingPurposesProcessedByAvailableIds(dataAvailable, ids) {
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
          (item.category = this.processingPurposePipe.transform(
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
    const resultProcessingPurposesAvailable = this.processingPurposesAvailable
      ? this.processingPurposesAvailable.filter(
          item => !this.processingPurposesProcessedIds.includes(item.id)
        )
      : [];

    const selectedFromAvailableIds = this.getSelected(
      resultProcessingPurposesAvailable
    );
    const selectedFromAddedIds = this.getSelected(
      this.processingPurposesProcessed
    );

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
    this.tableService.clearAllSelected(this.gridIdAttached);
    this.tableService.clearAllSelected(this.gridIdAvailable);
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
