import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked,
  Output,
  EventEmitter
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';
import { TableService, TaModal } from '@trustarc/ui-toolkit';
import { DataSubjectInterface } from '../../../../../shared/models/data-subjects.model';

import { LocationModalContentComponent } from '../../../../../shared/components/location-modal-content/location-modal-content.component';
import { LocationService } from '../../../../../shared/services/location/location.service';

declare const _: any;

@Component({
  selector: 'ta-system-record-tab-data-subjects',
  templateUrl: './system-record-tab-data-subjects.component.html',
  styleUrls: ['./system-record-tab-data-subjects.component.scss']
})
export class SystemRecordTabDataSubjectComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  @Input() public id: string;
  @Input() public entityName: string;
  @Input() public type: string;
  @Input() public dataAttachedDataFlow: any;
  @Input() public dataAttachedInventory: any;
  @Input() public dataAvailable: any;
  @Input() public allHostingLocations: any[] = [];
  @Input() public allDataElements: any[];
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

  public dataSubjectsProcessed: any[];
  public dataSubjectsProcessedIds: string[];
  public dataSubjectIdsFromInventory: string[];
  public dataSubjectIdsFromDataFlow: string[];

  public dataSubjectsAvailable: DataSubjectInterface[];
  public searchValue: string;
  public isReady: boolean;
  public initialSelectedAddedIds: string[];
  public initialSelectedDataSubjects: any[];

  public filterForm: FormGroup;
  public filterCheckedCategories: any[];
  public filterCheckedCountries: any[];
  public filterCheckedCategoryNames: string[];
  public filterCheckedLocationIds: string[];
  public isSelectFilterColumn: string;

  constructor(
    private taModal: TaModal,
    private tableService: TableService,
    private locationService: LocationService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    this.isCollapsedAttached = false;
    this.isCollapsedAdditional = false;
    this.isReady = false;
    this.filterCheckedCategories = [];
    this.filterCheckedCountries = [];
    this.filterCheckedCategoryNames = [];
    this.filterCheckedLocationIds = [];
    this.initialSelectedAddedIds = [];
    this.initialSelectedDataSubjects = [];
    this.isSelectFilterColumn = 'categories';

    this.filterForm = this.formBuilder.group({
      categories: this.formBuilder.array([]),
      countries: this.formBuilder.array([])
    });

    this.gridIdSystemReadOnly = 'gridIdSystemReadOnly';
  }

  ngOnInit() {
    this.initGridIds();
    this.initDataSubjectIdsForCurrentType(this.type);
    this.initDataSubjectIdsAvailableForCurrentType(this.type);
    this.initDataSubjectsProcessedForCurrentType(this.type);
    this.initTableSubscriptionsForCurrentType(this.type);
    this.initCategoryForFormArray();
    this.initCountriesForFormArray();

    setTimeout(() => {
      this.isReady = true;
    });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
    const isChanged = this.isChanged();
    this.selectionsUpdated.emit(isChanged);
  }

  ngOnDestroy(): void {
    this.unsubscribeFromAll();
  }

  private initGridIds() {
    this.gridIdAttached = `${this.id}-ds-attached`;
    this.gridIdAvailable = `${this.id}-ds-available`;
  }

  private initDataSubjectIdsForCurrentType(type) {
    if (type === 'withDataFlow') {
      this.dataSubjectIdsFromDataFlow = this.dataAttachedDataFlow.dataSubjects.map(
        item => item.entityId
      );
      this.initialSelectedAddedIds = this.dataSubjectIdsFromDataFlow;
      this.initialSelectedDataSubjects = _.cloneDeep(
        this.dataAttachedDataFlow.dataSubjects
      );
      this.dataSubjectIdsFromInventory = this.dataAttachedInventory.dataSubjectsWithLocations.map(
        item => item.dataSubjectTypeId
      );
      this.dataSubjectsProcessedIds = [
        ...this.dataSubjectIdsFromDataFlow,
        ...this.dataSubjectIdsFromInventory
      ];
    }
  }

  private initDataSubjectIdsAvailableForCurrentType(type) {
    if (type === 'withDataFlow') {
      this.dataSubjectsAvailable = _.cloneDeep(this.dataAvailable);
    }
  }

  private initDataSubjectsProcessedForCurrentType(type) {
    if (type === 'withDataFlow') {
      const fromInventory = this.dataAttachedInventory.dataSubjectsWithLocations.map(
        item => {
          return {
            entityId: item.dataSubjectTypeId,
            dataSubjectType: item.dataSubject,
            category: item.category.categoryName,
            locationIds: item.locations
              .filter(loc => loc.stateOrProvinceId === null)
              .map(loc => loc.id)
          };
        }
      );

      this.dataSubjectsProcessed = _.uniqBy(
        [...this.dataAttachedDataFlow.dataSubjects, ...fromInventory],
        'entityId'
      );
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

  // TODO: unused at the moment
  private getDataSubjectsProcessedByAvailableIds(dataAvailable, ids) {
    return dataAvailable.filter(item => ids.includes(item.id));
  }

  public determineSelectedByProperty(record, property) {
    return this.initialSelectedAddedIds.includes(record[property]);
  }

  public getSelectedCountByGridId(gridId) {
    const selected = this.tableService.getSelected(gridId);
    if (Array.isArray(selected)) {
      return selected.length;
    }
    return 0;
  }

  public isSelected(data, source, idField) {
    const selected = this.tableService.getSelected(source);
    const selectedIds = _.map(selected, idField);
    return selectedIds.includes(data[idField]);
  }

  public isMissingLocations(source) {
    const selected = this.tableService.getSelected(source);
    if (Array.isArray(selected)) {
      if (selected.length === 0) {
        return false;
      }

      return (
        selected.filter(
          item =>
            !Array.isArray(item.locationIds) || item.locationIds.length === 0
        ).length > 0
      );
    }
    return false;
  }

  public isInvalid() {
    const isInvalid =
      this.isMissingLocations(this.gridIdAttached) ||
      this.isMissingLocations(this.gridIdAvailable);

    // If locations are missing, i.e. is invalid - emit false for validity
    this.validityUpdated.emit(!isInvalid);
    return isInvalid;
  }

  private buildSelectedLocationsObject(data) {
    const countryHash = {};

    if (data.locationIds && data.locationIds.length > 0) {
      data.locationIds.forEach(id => {
        this.allHostingLocations.forEach(location => {
          if (location.id === id) {
            countryHash[location.id] = {
              id: location.id,
              version: location.version,
              i18nKey: location.i18nKey,
              name: location.name,
              threeLetterCode: location.threeLetterCode,
              twoLetterCode: location.twoLetterCode,
              stateOrProvinces: countryHash[location.id]
                ? countryHash[location.id].stateOrProvinces
                : [],
              globalRegions: [location.globalRegions],
              selectedStates: countryHash[location.id]
                ? countryHash[location.id].selectedStates
                : [],
              selected: true
            };
          }
        });
      });
    }

    return countryHash;
  }

  public editLocations(data) {
    const modalRef = this.taModal.open(LocationModalContentComponent, {
      windowClass: 'ta-modal-location-redesign',
      backdrop: 'static',
      keyboard: true,
      size: 'md'
    });

    const countryObjects = this.buildSelectedLocationsObject(data);
    const locationsArray = Object.keys(countryObjects).map(
      key => countryObjects[key]
    );

    const preselectedGeoIds = _.map(locationsArray, 'id');
    const isLocationSelected = locationsArray.length > 0;

    modalRef.componentInstance.redesign = true;
    modalRef.componentInstance.modalHeaderTile = `Locations for ${this
      .entityName || 'Untitled'}`;
    modalRef.componentInstance.selectedLocationData = locationsArray;
    modalRef.componentInstance.ignoreStatusSaveBtn = isLocationSelected;
    modalRef.componentInstance.saveButtonLabel = 'Add location';
    modalRef.componentInstance.stateProvinceIsSelectable = false;
    modalRef.componentInstance.setActiveTabId = isLocationSelected
      ? 'region-selected-panel'
      : null;

    modalRef.result
      .then(result => {
        const allSelectedGeoIds = this.getSelectedItemsGeoIds(result);

        if (allSelectedGeoIds.length === 0) {
          return (data.locationIds = []);
        }

        const isEqual = _.isEqual(
          _.sortBy(preselectedGeoIds),
          _.sortBy(allSelectedGeoIds)
        );

        if (isEqual) {
          return;
        }

        data.locationIds = allSelectedGeoIds;
      })
      .catch(reason => {
        console.log(reason);
      });
  }

  private getSelectedItemsGeoIds(data) {
    const [selectedItems] = data;

    const selectedCountryIds = [];
    const selectedStateOrProvincesIds = [];

    selectedItems.forEach(item => {
      selectedCountryIds.push(item.id);
      if (Array.isArray(item.selectedStates)) {
        selectedStateOrProvincesIds.push(...item.selectedStates);
      }
    });

    return [...selectedCountryIds, ...selectedStateOrProvincesIds];
  }

  private isChanged() {
    const selectedIdsFromAvailable = this.tableService.getSelected(
      this.gridIdAvailable
    );

    const selectedIdsFromAdded = this.tableService
      .getSelected(this.gridIdAttached)
      .map(selected => selected.entityId)
      .sort();

    // I. Determine if selections (ids) changed
    const addedIdsIsChanged = !_.isEqual(
      _.uniq(selectedIdsFromAdded),
      _.uniq(this.initialSelectedAddedIds.sort())
    );

    const availableIdsIsChanged = selectedIdsFromAvailable.length !== 0;

    // II. Determine if selections content changed
    const selectedItemsFromAdded = this.tableService.getSelected(
      this.gridIdAttached
    );

    let addedItemsIsChanged = false;
    selectedItemsFromAdded.forEach(item => {
      if (!addedItemsIsChanged) {
        const initialItem = this.initialSelectedDataSubjects.find(
          ds => ds.entityId === item.entityId
        );

        const initialLocations = (
          (initialItem && initialItem.locationIds) ||
          []
        ).sort();
        const selectedLocations = (item.locationIds || []).sort();

        // Check if locations selections changed
        addedItemsIsChanged = !_.isEqual(
          _.uniq(initialLocations),
          _.uniq(selectedLocations)
        );
      }
    });

    return {
      added: addedIdsIsChanged || addedItemsIsChanged,
      available: availableIdsIsChanged
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

  public get categories(): FormArray {
    return this.filterForm.get('categories') as FormArray;
  }

  public get countries(): FormArray {
    return this.filterForm.get('countries') as FormArray;
  }

  public initCategoryForFormArray() {
    _.chain(this.dataAvailable || [])
      .map('category.categoryName')
      .uniq()
      .sort()
      .value()
      .forEach(item => {
        this.categories.push(
          this.formBuilder.group({
            name: item,
            checked: false
          })
        );
      });

    this.filterForm.valueChanges.subscribe(() => {
      this.filterCheckedCategories = this.categories.value.filter(
        item => item.checked === true
      );
    });
  }

  public initCountriesForFormArray() {
    this.allHostingLocations.forEach(item => {
      this.countries.push(
        this.formBuilder.group({
          id: item.id,
          name: item.name,
          checked: false
        })
      );
    });

    this.countries.valueChanges.subscribe(() => {
      this.filterCheckedCountries = this.countries.value.filter(
        item => item.checked === true
      );
    });
  }

  public isCategoriesDirty() {
    const selected = this.categories.value.filter(
      item => item.checked === true
    );
    return this.filterForm.dirty && selected.length > 0;
  }

  public isCountriesDirty() {
    const selected = this.countries.value.filter(item => item.checked === true);
    return this.filterForm.dirty && selected.length > 0;
  }

  public resetFilterForm() {
    this.filterCheckedCategoryNames = [];
    this.filterCheckedLocationIds = [];

    this.categories.controls.forEach(item => {
      item.markAsPristine();
      (item as FormGroup).controls.checked.setValue(false);
    });

    this.countries.controls.forEach(item => {
      item.markAsPristine();
      (item as FormGroup).controls.checked.setValue(false);
    });
  }

  public applyFilterForm() {
    this.filterCheckedCategoryNames = this.filterCheckedCategories.map(
      item => item.name
    );
    this.filterCheckedLocationIds = this.filterCheckedCountries.map(
      loc => loc.id
    );
  }

  public updateCountriesFilter(locations) {
    const countryIds = _.map(locations, 'country.id');
    const controlsToUpdate = this.countries.controls.filter(control =>
      countryIds.includes(control.value.id)
    );
    locations.forEach(location => {
      const found = controlsToUpdate.find(
        control => control.value.id === location.country.id
      );
      if (found) {
        const locationIdsControls = (found as FormGroup).controls.locationIds;
        const existingIds = locationIdsControls.value;
        if (!existingIds.includes(location.id)) {
          // Add location id to form if it is newly created
          (locationIdsControls as FormArray).push(new FormControl(location.id));
        }
      }
    });
  }

  public selectFilterColumn(type: string) {
    this.isSelectFilterColumn = type;
  }
}
