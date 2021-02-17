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
import { sortDanishStringArray } from 'src/app/shared/utils/basic-utils';

import { Subscription } from 'rxjs';
import { TableService } from '@trustarc/ui-toolkit';
import { REGION_IDS } from '../../../../../app.constants';

declare const _: any;

@Component({
  selector: 'ta-system-record-tab-hosting-locations',
  templateUrl: './system-record-tab-hosting-locations.component.html',
  styleUrls: ['./system-record-tab-hosting-locations.component.scss']
})
export class SystemRecordTabHostingLocationsComponent
  implements OnInit, OnDestroy, AfterContentChecked {
  @Input() public id: string;
  @Input() public type: string;
  @Input() public dataAttachedDataFlow: any;
  @Input() public dataAttachedInventory: any;
  @Input() public dataAvailable: any;
  @Input() public itSystemReadOnly: any;
  @Output() public validityUpdated = new EventEmitter();
  @Output() public selectionsUpdated = new EventEmitter();

  public isCollapsedAttached: boolean;
  public isCollapsedAdditional: boolean;

  public gridIdAttached: string;
  public gridIdAvailable: string;
  public gridIdSystemReadOnly: string;

  public eventSelectedAttachedRef: Subscription;
  public eventPageSelectedItemsAttachedRef: Subscription;
  public eventSelectedAvailableRef: Subscription;
  public eventPageSelectedItemsAvailableRef: Subscription;

  public hostingLocationsProcessed: any[];
  public hostingLocationsProcessedIds: string[];
  public hostingLocationCountryIdsFromInventory: string[];
  public hostingLocationCountryIdsFromDataFlow: any[];

  public hostingLocationsAvailable: any[];
  public searchValue: string;
  public isReady: boolean;
  public initialSelectedAddedIds: string[];

  public filterForm: FormGroup;
  public filterChecked: any[];
  public filterCheckedRegions: string[];

  constructor(
    private tableService: TableService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    this.isCollapsedAttached = false;
    this.isCollapsedAdditional = false;
    this.isReady = false;
    this.filterChecked = [];
    this.filterCheckedRegions = [];
    this.initialSelectedAddedIds = [];

    this.filterForm = this.formBuilder.group({
      filters: this.formBuilder.array([])
    });

    this.gridIdSystemReadOnly = 'gridIdSystemReadOnly';
  }

  ngOnInit() {
    this.initGridIds();
    this.initHostingLocationIdsForCurrentType(this.type);
    this.initHostingLocationIdsAvailableForCurrentType(this.type);
    this.initHostingLocationsProcessedForCurrentType(this.type);
    this.initTableSubscriptionsForCurrentType(this.type);
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
    this.gridIdAttached = `${this.id}-hl-attached`;
    this.gridIdAvailable = `${this.id}-hl-available`;
  }

  private initHostingLocationIdsForCurrentType(type) {
    if (type === 'withDataFlow') {
      this.hostingLocationCountryIdsFromDataFlow = this.dataAttachedDataFlow.locations.map(
        item => item.location.countryId
      );
      this.initialSelectedAddedIds = this.hostingLocationCountryIdsFromDataFlow;
      this.hostingLocationCountryIdsFromInventory = this.dataAttachedInventory.locations.map(
        item => item.countryId
      );
      this.hostingLocationsProcessedIds = [
        ...this.hostingLocationCountryIdsFromDataFlow,
        ...this.hostingLocationCountryIdsFromInventory
      ];
    }
  }

  private initHostingLocationIdsAvailableForCurrentType(type) {
    if (type === 'withDataFlow') {
      this.hostingLocationsAvailable = sortDanishStringArray(
        Array.from(this.dataAvailable),
        'name'
      );
    }
  }

  private initHostingLocationsProcessedForCurrentType(type) {
    if (type === 'withDataFlow') {
      const hostingLocationsProcessedFromDataFlow = this.getHostingLocationsProcessedByAvailableIds(
        this.dataAvailable,
        this.hostingLocationCountryIdsFromDataFlow
      );
      const hostingLocationsProcessedFromInventory = this.getHostingLocationsProcessedByAvailableIds(
        this.dataAvailable,
        this.hostingLocationCountryIdsFromInventory
      );
      this.hostingLocationsProcessed = _.union(
        hostingLocationsProcessedFromDataFlow,
        hostingLocationsProcessedFromInventory
      );
      this.addRegionToHostingLocationsProcessed();
    }
  }

  private initTableSubscriptionsForCurrentType(type) {
    if (type === 'withDataFlow') {
      this.eventSelectedAttachedRef = this.tableService
        .listenSelectAllEvents(this.gridIdAttached)
        .subscribe(request => {
          // console.log(request);
        });

      this.eventPageSelectedItemsAttachedRef = this.tableService
        .listenSelectedItemsEvents(this.gridIdAttached)
        .subscribe(request => {
          // console.log(request);
        });

      this.eventSelectedAvailableRef = this.tableService
        .listenSelectAllEvents(this.gridIdAvailable)
        .subscribe(request => {
          // console.log(request);
        });

      this.eventPageSelectedItemsAvailableRef = this.tableService
        .listenSelectedItemsEvents(this.gridIdAvailable)
        .subscribe(request => {
          // console.log(request);
        });
    }
  }

  private getHostingLocationsProcessedByAvailableIds(dataAvailable, ids) {
    return dataAvailable.filter(item => ids.includes(item.id));
  }

  public determineSelected(id) {
    return this.initialSelectedAddedIds.includes(id);
  }

  public getSelectedCountByGridId(gridId) {
    const selected = this.tableService.getSelected(gridId);
    if (Array.isArray(selected)) {
      return selected.length;
    }
    return 0;
  }

  public addRegionToHostingLocationsProcessed() {
    if (this.hostingLocationsProcessed) {
      this.hostingLocationsProcessed.forEach(item => {
        item.globalRegion = item.globalRegions[0].id;
      });
    }

    if (this.hostingLocationsAvailable) {
      this.hostingLocationsAvailable.forEach(item => {
        if (item.globalRegions[0]) {
          item.globalRegion = item.globalRegions[0].id;
        }
      });
    }
  }

  private isChanged() {
    const selectedFromAvailable = this.tableService.getSelected(
      this.gridIdAvailable
    );

    const selectedFromAdded = this.tableService
      .getSelected(this.gridIdAttached)
      .map(selected => selected.id)
      .sort();

    this.validityUpdated.emit(
      selectedFromAdded.length !== 0 || selectedFromAvailable.length !== 0
    );

    return {
      added: !_.isEqual(
        _.uniq(selectedFromAdded),
        _.uniq(this.initialSelectedAddedIds.sort())
      ),
      available: selectedFromAvailable.length !== 0
    };
  }

  private unsubscribeFromAll() {
    if (this.eventSelectedAttachedRef) {
      this.eventSelectedAttachedRef.unsubscribe();
    }
    if (this.eventPageSelectedItemsAttachedRef) {
      this.eventPageSelectedItemsAttachedRef.unsubscribe();
    }
    if (this.eventSelectedAvailableRef) {
      this.eventSelectedAvailableRef.unsubscribe();
    }
    if (this.eventPageSelectedItemsAvailableRef) {
      this.eventPageSelectedItemsAvailableRef.unsubscribe();
    }
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
    Object.keys(REGION_IDS)
      .sort()
      .forEach(key => {
        this.filters.push(
          this.formBuilder.group({
            name: REGION_IDS[key],
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
    this.filterCheckedRegions = [];

    this.filters.controls.forEach(item => {
      item.markAsPristine();
      (item as FormGroup).controls.checked.setValue(false);
    });
  }

  public applyFilterForm() {
    this.filterCheckedRegions = this.filterChecked.map(item => item.name);
  }
}
