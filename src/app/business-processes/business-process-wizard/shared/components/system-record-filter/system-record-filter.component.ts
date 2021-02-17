import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { SystemRecordsFilterType } from '../../../../../app.constants';

import {
  combineLatest,
  forkJoin,
  Observable,
  Subject,
  Subscription
} from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { CustomFiltersService } from '../../../../../shared/services/custom-filters/custom-filters.service';
import { CustomFilterType } from '../../../../../shared/models/filter-custom.model';
import { AutoUnsubscribe } from '../../../../../shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { DataFlowControllerService } from '../../../../../shared/_services/rest-api';
import { ActivatedRoute } from '@angular/router';
import {
  ItSystemNodeFilterItem,
  ItSystemNodeFilters
} from '../../../../../shared/_interfaces/rest-api';

declare const _: any;

@AutoUnsubscribe(['_sourceAll$'])
@Component({
  selector: 'ta-system-record-filter',
  templateUrl: './system-record-filter.component.html',
  styleUrls: ['./system-record-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SystemRecordFilterComponent implements OnInit, OnDestroy {
  @Input() sortingPlaceholder = 'Recently Added';
  @Input() filtersFormValue;
  @Input() fetchingType: 'single' | 'parallel' = 'parallel';
  @Output() cancel = new EventEmitter<void>();
  @Output() filtersApplied = new EventEmitter<FormGroup>();
  @Output() filtersUpdated = new EventEmitter<FormGroup>();

  public businessProcessId: string;
  public filterType = SystemRecordsFilterType;
  public labelProperty: string;
  public idProperty: string;

  // [i18n-tobeinternationalized]
  public textForSelectedFilterSORT = this.sortingPlaceholder;
  public textForSelectedFilterOWNER = 'Owner Type (0)';
  public textForSelectedFilterDS = 'Data Subjects (0)';
  public textForSelectedFilterDE = 'Data Elements (0)';
  public textForSelectedFilterHL = 'Hosting Locations (0)';
  public textForSelectedFilterPP = 'Processing Purposes (0)';

  public filtersForm: FormGroup;

  private _sourceAll$: Subscription;
  private _bpId$: Subscription;

  private sourceItSystemNodeFilters: Observable<ItSystemNodeFilters>;

  private subjectOwnerFilterItems$ = new Subject<CustomFilterType[]>();
  private sourceOwnerFilterItems$:
    | Observable<CustomFilterType[]>
    | Observable<ItSystemNodeFilterItem[]>;
  private searchStringOwnerFilter$: Observable<string>;
  public filteredOwnerFilterItems$: Observable<CustomFilterType[]>;

  private subjectDataSubjectFilterItems$ = new Subject<CustomFilterType[]>();
  private sourceDataSubjectFilterItems$:
    | Observable<CustomFilterType[]>
    | Observable<ItSystemNodeFilterItem[]>;
  private searchStringDataSubjectFilter$: Observable<string>;
  public filteredDataSubjectFilterItems$: Observable<CustomFilterType[]>;

  private subjectDataElementFilterItems$ = new Subject<CustomFilterType[]>();
  private sourceDataElementFilterItems$:
    | Observable<CustomFilterType[]>
    | Observable<ItSystemNodeFilterItem[]>;
  private searchStringDataElementFilter$: Observable<string>;
  public filteredDataElementFilterItems$: Observable<CustomFilterType[]>;

  private subjectProcessingPurposeFilterItems$ = new Subject<
    CustomFilterType[]
  >();
  private sourceProcessingPurposeFilterItems$:
    | Observable<CustomFilterType[]>
    | Observable<ItSystemNodeFilterItem[]>;
  private searchStringProcessingPurposeFilter$: Observable<string>;
  public filteredProcessingPurposeFilterItems$: Observable<CustomFilterType[]>;

  private subjectHostingLocationsFilterItems$ = new Subject<
    CustomFilterType[]
  >();
  private sourceHostingLocationsFilterItems$:
    | Observable<CustomFilterType[]>
    | Observable<ItSystemNodeFilterItem[]>;
  private searchStringHostingLocationsFilter$: Observable<string>;
  public filteredHostingLocationsFilterItems$: Observable<CustomFilterType[]>;

  // Filter for sorting
  public filter = {
    SORT: [
      { id: 'id0', value: 'ASC', text: 'Ascending (0-Z)' },
      { id: 'id1', value: 'DESC', text: 'Descending (Z-0)' }
    ]
  };

  public isLoading = false;

  private preselectedOwnerFilterItems;
  private preselectedDataSubjectFilterItems;
  private preselectedDataElementFilterItems;
  private preselectedProcessingPurposesFilterItems;
  private preselectedHostingLocationsFilterItems;

  private readonly filterTypes = [
    SystemRecordsFilterType.SORT,
    SystemRecordsFilterType.OWNER,
    SystemRecordsFilterType.DS,
    SystemRecordsFilterType.DE,
    SystemRecordsFilterType.HL,
    SystemRecordsFilterType.PP
  ];

  constructor(
    private formBuilder: FormBuilder,
    private customFilterService: CustomFiltersService,
    private dataFlowControllerService: DataFlowControllerService,
    private activatedRoute: ActivatedRoute
  ) {
    this._bpId$ = this.activatedRoute.parent.params.subscribe(params => {
      this.businessProcessId = params.id;
    });
  }

  ngOnInit() {
    this.labelProperty = this.getLabelPropertyName();
    this.idProperty = this.getIdPropertyName();
    this.getSortingFilter();

    this.sourceItSystemNodeFilters = this.dataFlowControllerService.getItSystemNodeFilters(
      this.businessProcessId
    );

    this.filtersForm = this.formBuilder.group({
      filterSort: new FormControl({}),
      filterOwner: this.formBuilder.array([]),
      filterOwnerSearch: new FormControl(''),
      filterDataSubjects: this.formBuilder.array([]),
      filterDataSubjectsSearch: new FormControl(''),
      filterDataElements: this.formBuilder.array([]),
      filterDataElementsSearch: new FormControl(''),
      filterProcessingPurposes: this.formBuilder.array([]),
      filterProcessingPurposesSearch: new FormControl(''),
      filterHostingLocations: this.formBuilder.array([]),
      filterHostingLocationsSearch: new FormControl('')
    });

    this.preselectedOwnerFilterItems = this.filtersFormValue
      ? this.filtersFormValue.filterOwner
      : [];

    this.preselectedDataSubjectFilterItems = this.filtersFormValue
      ? this.filtersFormValue.filterDataSubjects
      : [];

    this.preselectedDataElementFilterItems = this.filtersFormValue
      ? this.filtersFormValue.filterDataElements
      : [];

    this.preselectedProcessingPurposesFilterItems = this.filtersFormValue
      ? this.filtersFormValue.filterProcessingPurposes
      : [];

    this.preselectedHostingLocationsFilterItems = this.filtersFormValue
      ? this.filtersFormValue.filterHostingLocations
      : [];

    this.initForm();

    this.filtersForm.valueChanges.pipe(debounceTime(20)).subscribe(val => {
      this.filterTypes.forEach(type => this.getTextForSelectedFilter(type));
      this.filtersUpdated.emit(this.filtersForm.value);
    });
  }

  // Form getters
  get filterSort(): FormControl {
    return this.filtersForm.get('filterSort') as FormControl;
  }
  get filterOwner(): FormArray {
    return this.filtersForm.get('filterOwner') as FormArray;
  }
  get filterDataSubjects(): FormArray {
    return this.filtersForm.get('filterDataSubjects') as FormArray;
  }
  get filterDataElements(): FormArray {
    return this.filtersForm.get('filterDataElements') as FormArray;
  }
  get filterProcessingPurposes(): FormArray {
    return this.filtersForm.get('filterProcessingPurposes') as FormArray;
  }
  get filterHostingLocations(): FormArray {
    return this.filtersForm.get('filterHostingLocations') as FormArray;
  }

  public initForm() {
    if (this._sourceAll$) {
      this._sourceAll$.unsubscribe();
    }
    this.isLoading = true;

    if (this.filtersFormValue) {
      this.filterSort.setValue(this.filtersFormValue.filterSort);
    }

    // Init search string sources
    this.searchStringOwnerFilter$ = this.filtersForm.controls.filterOwnerSearch.valueChanges.pipe(
      startWith('')
    );
    this.searchStringDataSubjectFilter$ = this.filtersForm.controls.filterDataSubjectsSearch.valueChanges.pipe(
      startWith('')
    );
    this.searchStringDataElementFilter$ = this.filtersForm.controls.filterDataElementsSearch.valueChanges.pipe(
      startWith('')
    );
    this.searchStringProcessingPurposeFilter$ = this.filtersForm.controls.filterProcessingPurposesSearch.valueChanges.pipe(
      startWith('')
    );
    this.searchStringHostingLocationsFilter$ = this.filtersForm.controls.filterHostingLocationsSearch.valueChanges.pipe(
      startWith('')
    );

    // Init API sources
    this.sourceOwnerFilterItems$ =
      this.fetchingType === 'parallel'
        ? this.customFilterService
            .getFilterSubTypeOptionsForSystem(SystemRecordsFilterType.SYS_OWN)
            .pipe(map(res => res.filterOptions.content))
        : this.sourceItSystemNodeFilters.pipe(map(res => res.ownerTypes));

    this.sourceDataSubjectFilterItems$ =
      this.fetchingType === 'parallel'
        ? this.customFilterService
            .getFilterSubTypeOptionsForSystem(SystemRecordsFilterType.SYS_DS)
            .pipe(map(res => res.filterOptions.content))
        : this.sourceItSystemNodeFilters.pipe(map(res => res.dataSubjects));

    this.sourceDataElementFilterItems$ =
      this.fetchingType === 'parallel'
        ? this.customFilterService
            .getFilterSubTypeOptionsForSystem(SystemRecordsFilterType.SYS_DE)
            .pipe(map(res => res.filterOptions.content))
        : this.sourceItSystemNodeFilters.pipe(map(res => res.dataElements));

    this.sourceProcessingPurposeFilterItems$ =
      this.fetchingType === 'parallel'
        ? this.customFilterService
            .getFilterSubTypeOptionsForSystem(SystemRecordsFilterType.SYS_PP)
            .pipe(map(res => res.filterOptions.content))
        : this.sourceItSystemNodeFilters.pipe(
            map(res => res.processingPurposes)
          );

    this.sourceHostingLocationsFilterItems$ =
      this.fetchingType === 'parallel'
        ? this.customFilterService
            .getFilterSubTypeOptionsForSystem(SystemRecordsFilterType.SYS_LOC)
            .pipe(map(res => res.filterOptions.content))
        : this.sourceItSystemNodeFilters.pipe(map(res => res.locations));

    // Init sources for template - combining latest data from API and search string emitter
    this.filteredOwnerFilterItems$ = combineLatest([
      this.subjectOwnerFilterItems$,
      this.searchStringOwnerFilter$
    ]).pipe(
      map(([items, searchString]) => {
        items.forEach(item =>
          this.setHiddenBySearchString(item, this.labelProperty, searchString)
        );
        return items;
      })
    );

    this.filteredDataSubjectFilterItems$ = combineLatest([
      this.subjectDataSubjectFilterItems$,
      this.searchStringDataSubjectFilter$
    ]).pipe(
      map(([items, searchString]) => {
        items.forEach(item =>
          this.setHiddenBySearchString(item, this.labelProperty, searchString)
        );
        return items;
      })
    );

    this.filteredDataElementFilterItems$ = combineLatest([
      this.subjectDataElementFilterItems$,
      this.searchStringDataElementFilter$
    ]).pipe(
      map(([items, searchString]) => {
        items.forEach(item =>
          this.setHiddenBySearchString(item, this.labelProperty, searchString)
        );
        return items;
      })
    );

    this.filteredProcessingPurposeFilterItems$ = combineLatest([
      this.subjectProcessingPurposeFilterItems$,
      this.searchStringProcessingPurposeFilter$
    ]).pipe(
      map(([items, searchString]) => {
        items.forEach(item =>
          this.setHiddenBySearchString(item, this.labelProperty, searchString)
        );
        return items;
      })
    );

    this.filteredHostingLocationsFilterItems$ = combineLatest([
      this.subjectHostingLocationsFilterItems$,
      this.searchStringHostingLocationsFilter$
    ]).pipe(
      map(([items, searchString]) => {
        items.forEach(item =>
          this.setHiddenBySearchString(item, this.labelProperty, searchString)
        );
        return items;
      })
    );

    this._sourceAll$ = forkJoin([
      this.sourceOwnerFilterItems$,
      this.sourceDataSubjectFilterItems$,
      this.sourceDataElementFilterItems$,
      this.sourceProcessingPurposeFilterItems$,
      this.sourceHostingLocationsFilterItems$
    ]).subscribe(
      ([
        filterItemsOwner,
        filterItemsDataSubject,
        filterItemsDataElement,
        filterItemsProcessingPurpose,
        filterItemsHostingLocations
      ]) => {
        this.populateFormOwner(filterItemsOwner, this.labelProperty);
        this.populateFormDataSubject(
          filterItemsDataSubject,
          this.labelProperty
        );
        this.populateFormDataElement(
          filterItemsDataElement,
          this.labelProperty
        );
        this.populateFormProcessingPurpose(
          filterItemsProcessingPurpose,
          this.labelProperty
        );
        this.populateFormHostingLocations(
          filterItemsHostingLocations,
          this.labelProperty
        );

        this.subjectOwnerFilterItems$.next(filterItemsOwner);
        this.subjectDataSubjectFilterItems$.next(filterItemsDataSubject);
        this.subjectDataElementFilterItems$.next(filterItemsDataElement);
        this.subjectProcessingPurposeFilterItems$.next(
          filterItemsProcessingPurpose
        );
        this.subjectHostingLocationsFilterItems$.next(
          filterItemsHostingLocations
        );
        this.isLoading = false;
      }
    );
  }

  private populateFormOwner(filterItems, property) {
    filterItems.forEach(filterItem => {
      const checked = this.determineCheckedByProperty(
        this.getIdPropertyName(),
        filterItem,
        this.preselectedOwnerFilterItems
      );
      this.filterOwner.push(
        this.createCheckboxForFilterItem(filterItem, checked, property)
      );
    });
  }

  private populateFormDataSubject(filterItems, property) {
    filterItems.forEach(filterItem => {
      const checked = this.determineCheckedByProperty(
        property,
        filterItem,
        this.preselectedDataSubjectFilterItems
      );
      this.filterDataSubjects.push(
        this.createCheckboxForFilterItem(filterItem, checked, property)
      );
    });
  }

  private populateFormDataElement(filterItems, property) {
    filterItems.forEach(filterItem => {
      const checked = this.determineCheckedByProperty(
        property,
        filterItem,
        this.preselectedDataElementFilterItems
      );
      this.filterDataElements.push(
        this.createCheckboxForFilterItem(filterItem, checked, property)
      );
    });
  }

  private populateFormProcessingPurpose(filterItems, property) {
    filterItems.forEach(filterItem => {
      const checked = this.determineCheckedByProperty(
        property,
        filterItem,
        this.preselectedProcessingPurposesFilterItems
      );
      this.filterProcessingPurposes.push(
        this.createCheckboxForFilterItem(filterItem, checked, property)
      );
    });
  }

  private populateFormHostingLocations(filterItems, property) {
    filterItems.forEach(filterItem => {
      const checked = this.determineCheckedByProperty(
        property,
        filterItem,
        this.preselectedHostingLocationsFilterItems
      );
      this.filterHostingLocations.push(
        this.createCheckboxForFilterItem(filterItem, checked, property)
      );
    });
  }

  private createCheckboxForFilterItem(
    payload,
    checked,
    labelProperty = 'name'
  ): FormGroup {
    return this.formBuilder.group({
      id: payload.id,
      [labelProperty]: payload[labelProperty],
      checked: checked,
      hidden: false,
      text: payload[labelProperty]
    });
  }

  public getSummaryCheckboxStateByFilterType(
    type,
    state: 'indeterminate' | 'checked' | null
  ) {
    switch (type) {
      // Handle Owner type filter
      case SystemRecordsFilterType.OWNER:
        const valuesOwner = this.filterOwner.value;
        const checksOwner = _.map(valuesOwner, 'checked');
        if (state === 'checked') {
          return checksOwner.every(i => i === true);
        }
        if (state === 'indeterminate') {
          const allFalse = checksOwner.every(i => i === false);
          const allTrue = checksOwner.every(i => i === true);
          return !allFalse && !allTrue;
        }
        break;

      // Handle Data Subjects type filter
      case SystemRecordsFilterType.DS:
        const valuesDataSubjects = this.filterDataSubjects.value;
        const checksDataSubjects = _.map(valuesDataSubjects, 'checked');
        if (state === 'checked') {
          return checksDataSubjects.every(i => i === true);
        }
        if (state === 'indeterminate') {
          const allFalse = checksDataSubjects.every(i => i === false);
          const allTrue = checksDataSubjects.every(i => i === true);
          return !allFalse && !allTrue;
        }
        break;

      // Handle Data Elements type filter
      case SystemRecordsFilterType.DE:
        const valuesDataElements = this.filterDataElements.value;
        const checksDataElements = _.map(valuesDataElements, 'checked');
        if (state === 'checked') {
          return checksDataElements.every(i => i === true);
        }
        if (state === 'indeterminate') {
          const allFalse = checksDataElements.every(i => i === false);
          const allTrue = checksDataElements.every(i => i === true);
          return !allFalse && !allTrue;
        }
        break;

      // Handle Processing Purposes type filter
      case SystemRecordsFilterType.PP:
        const valuesProcessingPurposes = this.filterProcessingPurposes.value;
        const checksProcessingPurposes = _.map(
          valuesProcessingPurposes,
          'checked'
        );
        if (state === 'checked') {
          return checksProcessingPurposes.every(i => i === true);
        }
        if (state === 'indeterminate') {
          const allFalse = checksProcessingPurposes.every(i => i === false);
          const allTrue = checksProcessingPurposes.every(i => i === true);
          return !allFalse && !allTrue;
        }
        break;

      // Handle Hosting Locations type filter
      case SystemRecordsFilterType.HL:
        const valuesHostingLocations = this.filterHostingLocations.value;
        const checksHostingLocations = _.map(valuesHostingLocations, 'checked');
        if (state === 'checked') {
          return checksHostingLocations.every(i => i === true);
        }
        if (state === 'indeterminate') {
          const allFalse = checksHostingLocations.every(i => i === false);
          const allTrue = checksHostingLocations.every(i => i === true);
          return !allFalse && !allTrue;
        }
        break;
    }
  }

  public getSummaryCheckboxTextByFilterType(type, payload) {
    switch (type) {
      // Handle Owner type filter
      case SystemRecordsFilterType.OWNER:
        const valuesOwner = this.filterOwner.value;
        const checksOwner = _.map(valuesOwner, 'checked');
        const qtySelectedOwner = checksOwner.filter(i => i === true).length;
        const qtyTotalOwner = checksOwner.length;
        // [i18n-tobeinternationalized]
        return `Select All (${qtySelectedOwner} of ${qtyTotalOwner})`;

      // Handle Data Subjects type filter
      case SystemRecordsFilterType.DS:
        const valuesDataSubjects = this.filterDataSubjects.value;
        const checksDataSubjects = _.map(valuesDataSubjects, 'checked');
        const qtySelectedDataSubjects = checksDataSubjects.filter(
          i => i === true
        ).length;
        const qtyTotalDataSubjects = checksDataSubjects.length;
        // [i18n-tobeinternationalized]
        return `Select All (${qtySelectedDataSubjects} of ${qtyTotalDataSubjects})`;

      // Handle Data Elements type filter
      case SystemRecordsFilterType.DE:
        const valuesDataElements = this.filterDataElements.value;
        const checksDataElements = _.map(valuesDataElements, 'checked');
        const qtySelectedDataElements = checksDataElements.filter(
          i => i === true
        ).length;
        const qtyTotalDataElements = checksDataElements.length;
        // [i18n-tobeinternationalized]
        return `Select All (${qtySelectedDataElements} of ${qtyTotalDataElements})`;

      // Handle Processing Purposes type filter
      case SystemRecordsFilterType.PP:
        const valuesProcessingPurposes = this.filterProcessingPurposes.value;
        const checksProcessingPurposes = _.map(
          valuesProcessingPurposes,
          'checked'
        );
        const qtySelectedProcessingPurposes = checksProcessingPurposes.filter(
          i => i === true
        ).length;
        const qtyTotalProcessingPurposes = checksProcessingPurposes.length;
        // [i18n-tobeinternationalized]
        return `Select All (${qtySelectedProcessingPurposes} of ${qtyTotalProcessingPurposes})`;

      // Handle Hosting Locations type filter
      case SystemRecordsFilterType.HL:
        const valuesHostingLocations = this.filterHostingLocations.value;
        const checksHostingLocations = _.map(valuesHostingLocations, 'checked');
        const qtySelectedHostingLocations = checksHostingLocations.filter(
          i => i === true
        ).length;
        const qtyTotalHostingLocations = checksHostingLocations.length;
        // [i18n-tobeinternationalized]
        return `Select All (${qtySelectedHostingLocations} of ${qtyTotalHostingLocations})`;
    }
  }

  public handleSelectAllByFilterType(type, event, payload?) {
    switch (type) {
      // Handle Owner type filter
      case SystemRecordsFilterType.OWNER:
        if (event.target.checked !== undefined) {
          // Set all checkboxes to boolean "checked"
          this.filterOwner.controls.forEach(control => {
            (control as FormGroup).controls.checked.setValue(
              event.target.checked
            );
          });
        }
        break;

      // Handle Data Subjects type filter
      case SystemRecordsFilterType.DS:
        if (event.target.checked !== undefined) {
          // Set all checkboxes to boolean "checked"
          this.filterDataSubjects.controls.forEach(control => {
            (control as FormGroup).controls.checked.setValue(
              event.target.checked
            );
          });
        }
        break;

      // Handle Data Elements type filter
      case SystemRecordsFilterType.DE:
        if (event.target.checked !== undefined) {
          // Set all checkboxes to boolean "checked"
          this.filterDataElements.controls.forEach(control => {
            (control as FormGroup).controls.checked.setValue(
              event.target.checked
            );
          });
        }
        break;

      // Handle Processing Purposes type filter
      case SystemRecordsFilterType.PP:
        if (event.target.checked !== undefined) {
          // Set all checkboxes to boolean "checked"
          this.filterProcessingPurposes.controls.forEach(control => {
            (control as FormGroup).controls.checked.setValue(
              event.target.checked
            );
          });
        }
        break;

      // Handle Hosting Locations type filter
      case SystemRecordsFilterType.HL:
        if (event.target.checked !== undefined) {
          // Set all checkboxes to boolean "checked"
          this.filterHostingLocations.controls.forEach(control => {
            (control as FormGroup).controls.checked.setValue(
              event.target.checked
            );
          });
        }
        break;
    }
  }

  public onSearchByFilterType(type, value: any) {
    switch (type) {
      case SystemRecordsFilterType.DS:
        this.filtersForm.controls.filterDataSubjectsSearch.setValue(value);
        break;
      case SystemRecordsFilterType.DE:
        this.filtersForm.controls.filterDataElementsSearch.setValue(value);
        break;
      case SystemRecordsFilterType.PP:
        this.filtersForm.controls.filterProcessingPurposesSearch.setValue(
          value
        );
        break;
      case SystemRecordsFilterType.HL:
        this.filtersForm.controls.filterHostingLocationsSearch.setValue(value);
        break;
    }
  }

  public selectItemForSelectedFilter(option, type: string) {
    switch (type) {
      case SystemRecordsFilterType.SORT:
        (this.filtersForm.controls.filterSort as FormControl).setValue(option);
        return;
    }
  }

  public getTextForSelectedFilter(type: string) {
    switch (type) {
      // Handle Sort type filter
      case SystemRecordsFilterType.SORT:
        const value = this.filterSort.value;
        this.textForSelectedFilterSORT = value.text || this.sortingPlaceholder;
        break;

      // Handle Owner type filter
      case SystemRecordsFilterType.OWNER:
        const valuesOwner = this.filterOwner.value;
        const checksOwner = _.map(valuesOwner, 'checked');
        const qtySelectedOwner = checksOwner.filter(i => i === true).length;

        // [i18n-tobeinternationalized]
        this.textForSelectedFilterOWNER = `Owner Type (${qtySelectedOwner})`;
        break;

      // Handle Data Subjects type filter
      case SystemRecordsFilterType.DS:
        const valuesDataSubjects = this.filterDataSubjects.value;
        const checksDataSubjects = _.map(valuesDataSubjects, 'checked');
        const qtySelectedDataSubjects = checksDataSubjects.filter(
          i => i === true
        ).length;

        // [i18n-tobeinternationalized]
        this.textForSelectedFilterDS = `Data Subjects (${qtySelectedDataSubjects})`;
        break;

      // Handle Data Elements type filter
      case SystemRecordsFilterType.DE:
        const valuesDataElements = this.filterDataElements.value;
        const checksDataElements = _.map(valuesDataElements, 'checked');
        const qtySelectedDataElements = checksDataElements.filter(
          i => i === true
        ).length;

        // [i18n-tobeinternationalized]
        this.textForSelectedFilterDE = `Data Elements (${qtySelectedDataElements})`;
        break;

      // Handle Processing Purposes type filter
      case SystemRecordsFilterType.PP:
        const valuesProcessingPurposes = this.filterProcessingPurposes.value;
        const checksProcessingPurposes = _.map(
          valuesProcessingPurposes,
          'checked'
        );
        const qtySelectedProcessingPurposes = checksProcessingPurposes.filter(
          i => i === true
        ).length;

        // [i18n-tobeinternationalized]
        this.textForSelectedFilterPP = `Processing Purposes (${qtySelectedProcessingPurposes})`;
        break;

      // Handle Hosting Locations type filter
      case SystemRecordsFilterType.HL:
        const valuesHostingLocations = this.filterHostingLocations.value;
        const checksHostingLocations = _.map(valuesHostingLocations, 'checked');
        const qtySelectedHostingLocations = checksHostingLocations.filter(
          i => i === true
        ).length;

        // [i18n-tobeinternationalized]
        this.textForSelectedFilterHL = `Hosting Locations (${qtySelectedHostingLocations})`;
        break;
    }
  }

  private setHiddenBySearchString(item, property = 'name', searchString = '') {
    const prop = item[property].toLowerCase();
    if (prop.indexOf(searchString.toLowerCase()) === -1) {
      item.hidden = true;
    }
    if (prop.indexOf(searchString.toLowerCase()) !== -1) {
      item.hidden = false;
    }
    return item;
  }

  private determineCheckedByProperty(property, filterItem, array = []) {
    const found = array.find(item => item[property] === filterItem[property]);
    if (found) {
      return found.checked;
    }
    return false;
  }

  public applyFilter() {
    this.filtersApplied.emit(this.filtersForm.value);
  }

  public cancelChanges() {
    const currentValue = _.cloneDeep(this.filtersForm.value);

    Object.keys(currentValue).forEach(key => {
      if (key === 'filterSort') {
        currentValue[key] = {};
      }
      if (currentValue[key].length > 0) {
        currentValue[key].forEach(item => {
          if (item && item.checked) {
            item.checked = false;
          }
        });
      }
    });

    this.filtersForm.patchValue(currentValue);

    // Emit filters form value
    this.cancel.emit(this.filtersForm.value);
  }

  private getLabelPropertyName() {
    return this.fetchingType === 'single' ? 'label' : 'name';
  }

  private getIdPropertyName() {
    return this.fetchingType === 'single' ? 'id' : 'name';
  }

  private getSortingFilter() {
    if (this.fetchingType === 'parallel') {
      this.filter.SORT = [
        { id: 'id0', value: 'ASC', text: 'Ascending (0-Z)' },
        { id: 'id1', value: 'DESC', text: 'Descending (Z-0)' }
      ];
    }
    if (this.fetchingType === 'single') {
      this.filter.SORT = [
        { id: 'nameAsc', value: 'ASC', text: 'Name (Asc)' },
        { id: 'nameDesc', value: 'DESC', text: 'Name (Desc)' }
      ];
    }
  }

  ngOnDestroy() {}
}
