import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  QueryList,
  ViewChildren
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  TableService,
  TaModal,
  TaPopover,
  ToastService,
  TaTabChangeEvent
} from '@trustarc/ui-toolkit';
import { forkJoin, Subscription, timer, throwError } from 'rxjs';
import { flatMap, catchError } from 'rxjs/operators';

import { CreateBusinessProcessesService } from 'src/app/business-processes/create-bp/create-business-processes.service';
import { ProcessingPurposeService } from 'src/app/shared/_services/data-inventory/processing-purpose/processing-purpose.service';
import { DataElementService } from 'src/app/shared/_services/data-inventory/data-element/data-element.service';
import { DataSubjectService } from 'src/app/shared/_services/data-inventory/data-subject/data-subject.service';
import { LocationService } from 'src/app/shared/services/location/location.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { SystemRecordAddService } from '../shared/components/system-record-add/system-record-add.service';
import { BusinessProcessService } from 'src/app/shared/services/business-process/business-process.service';

import {
  SearchControllerService,
  ItSystemControllerService,
  DataFlowControllerService,
  FeatureFlagControllerService
} from 'src/app/shared/_services/rest-api';

import {
  ItSystemRecordsFilterInterface,
  ItSystemControllerInterfaceInterface,
  GetItSystemEntityInterface
} from 'src/app/shared/_interfaces';
import { GlobalRegionInterface } from 'src/app/shared/models/location.model';
import { DataInventoryDataType, ThirdPartyType } from 'src/app/app.constants';

import { BUSINESS_PROCESS_NAVIGATION } from 'src/app/shared/_constant';
import { UtilsClass } from 'src/app/shared/_classes';

declare const _: any;

@Component({
  selector: 'ta-systems-selection',
  templateUrl: './systems-selection.component.html',
  styleUrls: ['./systems-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SystemsSelectionComponent implements OnInit {
  @ViewChild('modalConfirmation') modalConfirmation: ElementRef;
  @ViewChild('modalConfirmationThreeButton')
  modalConfirmationThreeButton: ElementRef;
  @ViewChild('popSysRecordsFilter') popSysRecordsFilter: TaPopover;

  public readonly businessProcessNavigation = BUSINESS_PROCESS_NAVIGATION;

  public isDisabledSave: boolean;
  public isSaving: boolean;
  public isCollapsedDataSubject: boolean;
  public isCollapsedAdditionDataSubject: boolean;
  public systemReadOnly: boolean;
  public isFetching = false;
  public isAddedSystemLoading = false;

  public reRender: boolean;
  public totalFilters = 0;
  public filtersFormValue;
  public searchString;

  public activeContent:
    | null
    | 'none'
    | 'info'
    | 'add-system'
    | 'add-third-party'
    | 'add-company-affiliate'
    | 'from-available'
    | 'from-added' = 'none';

  /**
   * TABS CONTENT ENABLING/DISABLING
   */
  public tabEnabledDataSubjects = true;
  public tabEnabledDataElements = true;
  public tabEnabledHostingLocations = true;
  public tabEnabledProcessingPurposes = true;

  /**
   * CONFIRM MODALS PROPERTIES
   */
  public confirmModalTitle: string;
  public confirmModalDescription: string;
  public confirmModalType: string;
  public confirmModalIcon: string;
  public confirmModalLabelCancel: string;
  public confirmModalLabelDiscard: string;
  public confirmModalLabelConfirm: string;
  public confirmModalFunction: any;

  /**
   * FROM AVAILABLE FOR SELECTED SYSTEM RECORD
   */
  public fromAvailableSelectedSystemRecord: {
    dataItSystemInventory: ItSystemControllerInterfaceInterface;
  };
  private _fromAvailableSelectedSystemRecord$: Subscription;

  /**
   * FROM ADDED FOR SELECTED SYSTEM RECORD
   */
  public fromAddedSelectedSystemRecord: {
    dataItSystemDataFlow: GetItSystemEntityInterface;
    dataItSystemInventory: GetItSystemEntityInterface;
  };
  private _fromAddedSelectedSystemRecord$: Subscription;

  /**
   * FLAGS
   */
  public disableAddAndRemove: boolean;
  public currentSelectedItSystemId: string;
  public filterSystemRecordsIsDirty: boolean;

  /**
   * SEARCH SYSTEM RECORDS PROPERTIES
   */
  public showYourSystemRecordsSearch: boolean;

  /**
   * IT SYSTEMS PROPERTIES
   */
  public availableItSystemRecordData: ItSystemControllerInterfaceInterface;
  public addedItSystemRecordData: GetItSystemEntityInterface;
  public itSystemRecords: ItSystemRecordsFilterInterface;

  private _itSystemRecordsFilters$: Subscription;
  private _getItSystems$: Subscription;

  /**
   * IT SYSTEM HASH DATA
   */
  public itSystemAddedHashData: any;
  public itSystemAvailableHashData: any;
  public itSystemHashDataByEntityIdFull: any;
  public itSystemHashDataByEntityIdInventoryOnly: any;

  /**
   * BUSINESS PROCESS PROPERTIES
   */
  public businessProcessId: string;
  public record = {};

  /**
   * ALL DATA
   */
  public allDataSubjects: any;
  public allDataElements: any;
  public allHostingLocations: GlobalRegionInterface[];
  public allProcessingPurposes: any;

  /**
   * TABS MANAGEMENT
   */
  public activeTabAdded: string;
  public nextActiveTabAdded: string;

  /**
   * TRACK CHANGES
   */
  public isTabChangedDataSubjects = {
    added: false,
    available: false
  };
  public isTabChangedDataElements = {
    added: false,
    available: false
  };
  public isTabChangedHostingLocations = {
    added: false,
    available: false
  };
  public isTabChangedProcessingPurposes = {
    added: false,
    available: false
  };
  public isAddSystemContentChanged = false;
  public isAddThirdPartyContentChanged = false;
  public isAddCompanyAffiliateContentChanged = false;

  // VIEW PROPERTIES
  public isStandardView: boolean;
  public isExpandedView: boolean;

  // POPOVERS
  @ViewChildren(TaPopover) yourSystemRecordsPopovers: QueryList<TaPopover>;
  private _yourSystemRecordsPopovers$: Subscription;

  // Getters
  get dataFlowEntityId(): string {
    return this.fromAddedSelectedSystemRecord.dataItSystemDataFlow.entityId;
  }
  get dataFlowEntityName(): string {
    return this.fromAddedSelectedSystemRecord.dataItSystemDataFlow.name;
  }
  get dataFlowForAdded(): GetItSystemEntityInterface {
    return this.fromAddedSelectedSystemRecord.dataItSystemDataFlow;
  }
  get dataInventoryForAdded(): GetItSystemEntityInterface {
    return this.fromAddedSelectedSystemRecord.dataItSystemInventory;
  }
  get entityId(): string {
    return this.fromAvailableSelectedSystemRecord.dataItSystemInventory.id;
  }
  get dataItSystemInventory(): ItSystemControllerInterfaceInterface {
    return this.fromAvailableSelectedSystemRecord.dataItSystemInventory;
  }

  private updatedValue: [] = [];

  constructor(
    private businessProcessService: BusinessProcessService,
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private searchControllerService: SearchControllerService,
    private itSystemControllerService: ItSystemControllerService,
    private dataFlowControllerService: DataFlowControllerService,
    private processingPurposeService: ProcessingPurposeService,
    private dataElementsService: DataElementService,
    private dataSubjectsService: DataSubjectService,
    private systemRecordAddService: SystemRecordAddService,
    private locationService: LocationService,
    private notificationService: NotificationService,
    private tableService: TableService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private taModal: TaModal,
    private toastService: ToastService,
    private featureFlagControllerService: FeatureFlagControllerService
  ) {
    this.activeTabAdded = 'tabDataSubjectsAdded';
    this.isDisabledSave = true;
    this.isCollapsedDataSubject = true;
    this.isCollapsedAdditionDataSubject = true;
    this.systemReadOnly = false;
    this.reRender = true;
    this.showYourSystemRecordsSearch = false;
    this.disableAddAndRemove = true;
    this.confirmModalLabelCancel = 'Cancel';
    this.itSystemAvailableHashData = {};
    this.itSystemAddedHashData = {};
    this.itSystemHashDataByEntityIdFull = {};
    this.itSystemHashDataByEntityIdInventoryOnly = {};
    this.isStandardView = true;
    this.isExpandedView = false;
  }

  ngOnInit() {
    this.getBusinessProcessRecordAndSetFilters();

    this.getDataForCurrentSystemNodeAvailable().subscribe(
      ([
        allDataSubjects,
        { content: allDataElements },
        globalRegions,
        { content: allProcessingPurposes }
      ]) => {
        const countries = this.getCountriesFromRegionsData(globalRegions);

        this.allDataSubjects = allDataSubjects;
        this.allDataElements = allDataElements;
        this.allHostingLocations = countries;
        this.allProcessingPurposes = allProcessingPurposes;
        this.disableAddAndRemove = false;
      }
    );
  }

  private getBusinessProcessRecordAndSetFilters() {
    this.isFetching = true;
    this.activatedRoute.parent.params
      .pipe(
        flatMap(params => {
          this.businessProcessId = params.id;
          this.searchString = '';
          this.apiItSystemRecordsFilters();
          return this.businessProcessService.getBackground(
            this.businessProcessId
          );
        })
      )
      .subscribe(
        record => {
          this.record = record;
          this.isFetching = false;
        },
        err => {
          console.error(
            'There was an error in setting filters and obtaining bp record:',
            err
          );
          this.isFetching = false;
        }
      );
  }

  public handleAddSystem(event, clear?) {
    if (event !== 'ADD_SYSTEM') {
      event.preventDefault();
      event.stopPropagation();
    }
    if (clear) {
      this.currentSelectedItSystemId = undefined;
    }
    this.activeContent = 'add-system';
  }

  public showSystemRecordsSearch() {
    this.showYourSystemRecordsSearch = true;

    setTimeout(() => {
      const searchField: HTMLElement = document.querySelector(
        '#search-selected-records-component .form-control'
      );

      searchField.focus();
    });
  }

  public searchItSystemRecordsFilters(event) {
    if (event) {
      const { searchValue } = event;
      if (typeof searchValue === 'string') {
        this.searchString = searchValue;
        this.apiItSystemRecordsFilters();
      }
    }
  }

  public clearSearchItSystemRecords() {
    this.searchString = '';
    this.showYourSystemRecordsSearch = false;
    this.apiItSystemRecordsFilters();
  }

  private addAndRemoveToRecordFlags(itSystemId: string) {
    this.disableAddAndRemove = true;
    this.currentSelectedItSystemId = itSystemId;
  }

  public addToRecord(itSystemId: string, bubbleUp = false, options) {
    this.addAndRemoveToRecordFlags(itSystemId);
    this.apiDataFlowAddNewItSystemEntityToItSystem(
      itSystemId,
      bubbleUp,
      options
    );
  }

  public removeToRecord(itSystemId: string) {
    this.addAndRemoveToRecordFlags(itSystemId);
    this.apiDataFlowDeleteItSystemEntityFromDataFlow(itSystemId);
  }

  public onSelectSystemFromAdded(itSystemId: string) {
    this.activeContent = null;

    this.cancelFromAddedSelectedSystemRecord();

    this.currentSelectedItSystemId = itSystemId;

    this.fromAddedSelectedSystemRecord = null;

    setTimeout(() => {
      if (!this.itSystemHashDataByEntityIdFull[itSystemId]) {
        forkJoin([
          this.apiItSystemGetItSystems(itSystemId),
          this.apiDataFlowGetItSystems(itSystemId)
        ]).subscribe(([itSystemDataInventory, itSystemDataFlow]) => {
          this.itSystemHashDataByEntityIdFull[itSystemId] = {};
          this.itSystemHashDataByEntityIdFull[itSystemId].dataItSystemInventory = itSystemDataInventory; // prettier-ignore
          this.itSystemHashDataByEntityIdFull[itSystemId].dataItSystemDataFlow = itSystemDataFlow; // prettier-ignore
          this.fromAddedSelectedSystemRecord = this.itSystemHashDataByEntityIdFull[itSystemId]; // prettier-ignore
          this.fromAvailableSelectedSystemRecord = null;
          this.activeContent = 'from-added';
        });
      } else {
        this.fromAddedSelectedSystemRecord = this.itSystemHashDataByEntityIdFull[itSystemId]; // prettier-ignore
        this.fromAvailableSelectedSystemRecord = null;
        this.activeContent = 'from-added';
      }
    });
    this.activeTabAdded = 'tabDataSubjectsAdded';
  }

  public onSelectRecordFromAvailable(itSystemId: string) {
    this.activeContent = null;

    this.cancelFromAvailableSelectedSystemRecord();

    this.currentSelectedItSystemId = itSystemId;

    this.fromAvailableSelectedSystemRecord = null;

    setTimeout(() => {
      if (!this.itSystemHashDataByEntityIdInventoryOnly[itSystemId]) {
        this.apiItSystemGetItSystems(itSystemId).subscribe(
          itSystemDataInventory => {
            this.itSystemHashDataByEntityIdInventoryOnly[itSystemId] = {};
            this.itSystemHashDataByEntityIdInventoryOnly[itSystemId].dataItSystemInventory = itSystemDataInventory; // prettier-ignore
            this.fromAvailableSelectedSystemRecord = this.itSystemHashDataByEntityIdInventoryOnly[itSystemId]; // prettier-ignore
            this.fromAddedSelectedSystemRecord = null;
            this.activeContent = 'from-available';
          }
        );
      } else {
        this.fromAvailableSelectedSystemRecord = this.itSystemHashDataByEntityIdInventoryOnly[itSystemId]; // prettier-ignore
        this.fromAddedSelectedSystemRecord = null;
        this.activeContent = 'from-available';
      }
    });
  }

  public isSelectedRecord(itSystemId: string) {
    return this.currentSelectedItSystemId === itSystemId;
  }

  /**
   * POPOVERS METHODS
   */
  public popoverHandler() {
    if (this._yourSystemRecordsPopovers$) {
      this._yourSystemRecordsPopovers$.unsubscribe();
    }

    this.yourSystemRecordsPopovers.forEach(eachPopover => {
      if (eachPopover) {
        eachPopover.close();
      }
    });
  }

  public popoverSystemRecords(
    itSystemId: string,
    recordFrom: string,
    popover: TaPopover
  ) {
    if (
      recordFrom === 'available' &&
      this.itSystemRecords.availableRecords.length === 0
    ) {
      return;
    }
    if (
      recordFrom === 'added' &&
      this.itSystemRecords.addedRecords.length === 0
    ) {
      return;
    }
    if (this.isAddedSystemLoading) {
      return;
    }
    this.popoverHandler();
    this.cancelGetItSystems();

    this.addedItSystemRecordData = null;
    this.availableItSystemRecordData = null;

    const getAddedPopoverData = () => {
      if (this.itSystemAddedHashData[itSystemId]) {
        this.addedItSystemRecordData = this.itSystemAddedHashData[itSystemId];
      } else {
        this.forAddedItSystemPopoverData(itSystemId);
      }
    };

    const getAvailablePopoverData = () => {
      if (this.itSystemAvailableHashData[itSystemId]) {
        this.availableItSystemRecordData = this.itSystemAvailableHashData[
          itSystemId
        ];
      } else {
        this.forAvailableItSystemPopoverData(itSystemId);
      }
    };

    this._yourSystemRecordsPopovers$ = timer(300).subscribe(() => {
      if (recordFrom === 'added') {
        getAddedPopoverData();
      }

      if (recordFrom === 'available') {
        getAvailablePopoverData();
      }
      popover.open();
    });
  }

  public popoverSystemRecordsDestroy(popover: TaPopover) {
    this.popoverHandler();
    if (popover) {
      popover.close();
    }
  }

  private forAddedItSystemPopoverData(itSystemId: string) {
    this.isAddedSystemLoading = true;
    this._getItSystems$ = this.apiDataFlowGetItSystems(itSystemId).subscribe(
      response => {
        this.addedItSystemRecordData = this.mapAddedItSystem(response);
        this.itSystemAddedHashData[itSystemId] = this.addedItSystemRecordData;
        this.isAddedSystemLoading = false;
      },
      err => {
        console.error('There was an error in getting IT System:', err);
        this.isAddedSystemLoading = false;
      }
    );
  }

  private forAvailableItSystemPopoverData(itSystemId: string) {
    this._getItSystems$ = this.apiItSystemGetItSystems(itSystemId).subscribe(
      response => {
        this.availableItSystemRecordData = response;
        this.itSystemAvailableHashData[itSystemId] = response;
      }
    );
  }

  /**
   * MAP FOR ADDED IT SYSTEM
   */
  public mapAddedItSystem(itSystemResponse: GetItSystemEntityInterface) {
    return itSystemResponse;
  }

  /**
   * ALL API CALLS - TABLE OF CONTENT
   *
   * 1. apiItSystemRecordsFilters
   * 2. apiItSystemGetItSystems
   * 3. apiDataFlowGetItSystems
   * 4. apiDataFlowAddNewItSystemEntityToItSystem
   * 5. apiDataFlowDeleteItSystemEntityFromDataFlow
   */
  private apiItSystemRecordsFilters(itSystemId = '', bubbleUp = false) {
    if (this._itSystemRecordsFilters$) {
      this._itSystemRecordsFilters$.unsubscribe();
    }

    const query = this.getSearchQueryBySelectedFilters(
      this.searchString,
      this.filtersFormValue
    );

    this.filterSystemRecordsIsDirty = Object.keys(query.customFilters).some(
      key => query.customFilters[key].value.length > 0
    );

    this._itSystemRecordsFilters$ = this.searchControllerService
      .itSystemRecordsFilters(query, this.businessProcessId)
      .subscribe(response => {
        const filterAvailableRecordsWithLegalEntity = response.availableRecords.filter(
          record => record.legalEntityType && record.legalEntityName
        );

        response.availableRecords = filterAvailableRecordsWithLegalEntity;

        this.itSystemRecords = response;

        if (bubbleUp) {
          const moveItem = (data, from, to) => {
            // remove `from` item and store it
            const f = data.splice(from, 1)[0];
            // insert stored item into position `to`
            data.splice(to, 0, f);
          };
          const fromIndex = this.itSystemRecords.addedRecords.findIndex(
            item => item.entityId === itSystemId
          );

          moveItem(this.itSystemRecords.addedRecords, fromIndex, 0);
        }

        this.disableAddAndRemove = false;
      });
  }

  public apiItSystemGetItSystems(itSystemId: string) {
    return this.itSystemControllerService.getItSystems(itSystemId, true);
  }

  public apiDataFlowGetItSystems(itSystemId: string) {
    return this.dataFlowControllerService.getItSystems(
      this.businessProcessId,
      itSystemId
    );
  }

  public apiDataFlowAddNewItSystemEntityToItSystem(
    itSystemId = '',
    bubbleUp = false,
    options = {
      navigateUrl: null
    }
  ) {
    this.dataFlowControllerService
      .addNewItSystemEntityToItSystem(this.businessProcessId, itSystemId)
      .subscribe(() => {
        this.apiItSystemRecordsFilters(itSystemId, bubbleUp);

        if (this.currentSelectedItSystemId === itSystemId) {
          // Programmatically selected in Added
          this.onSelectSystemFromAdded(itSystemId);

          // If "Options" includes navigation - navigate to respective url
          if (options.navigateUrl) {
            this.navigate(options.navigateUrl);
          }
        } else {
          this.fromAvailableSelectedSystemRecord = null;
        }
      }, this.readableErrorHandler.bind(this));
  }

  public apiDataFlowDeleteItSystemEntityFromDataFlow(itSystemId: string) {
    this.dataFlowControllerService
      .deleteItSystemEntityFromDataFlow(this.businessProcessId, itSystemId)
      .pipe(catchError(err => this.readableErrorHandler(err)))
      .subscribe(() => {
        this.apiItSystemRecordsFilters();

        if (this.currentSelectedItSystemId === itSystemId) {
          // Programmatically selected in Available
          this.onSelectRecordFromAvailable(itSystemId);
        } else {
          this.fromAddedSelectedSystemRecord = null;
        }
      });
  }

  public apiDataFlowUpdateItSystemEntityFromDataFlow(
    itSystemEntityId: string,
    payload: GetItSystemEntityInterface
  ) {
    this.isSaving = true;

    forkJoin([
      // Update data for data flow
      this.dataFlowControllerService.updateItSystemEntityFromDataFlow(
        this.businessProcessId,
        itSystemEntityId,
        payload
      ),
      // Fetch updated it system from inventory
      this.itSystemControllerService.getItSystems(itSystemEntityId, true)
    ]).subscribe(([responseDataFlow, responseItSystem]) => {
      this.isSaving = false;

      this.closeAllModals();

      const gridIds = [
        `${itSystemEntityId}-ds-attached`,
        `${itSystemEntityId}-de-attached`,
        `${itSystemEntityId}-hl-attached`,
        `${itSystemEntityId}-pp-attached`,
        `${itSystemEntityId}-ds-available`,
        `${itSystemEntityId}-de-available`,
        `${itSystemEntityId}-hl-available`,
        `${itSystemEntityId}-pp-available`
      ];
      gridIds.forEach(gridId => {
        this.tableService.clearAllSelected(gridId);
      });

      this.fromAddedSelectedSystemRecord = null;
      this.forAddedItSystemPopoverData(itSystemEntityId);
      setTimeout(() => {
        this.itSystemHashDataByEntityIdFull[itSystemEntityId].dataItSystemDataFlow = responseDataFlow; // prettier-ignore
        this.itSystemHashDataByEntityIdFull[itSystemEntityId].dataItSystemInventory = responseItSystem; // prettier-ignore
        this.fromAddedSelectedSystemRecord = this.itSystemHashDataByEntityIdFull[itSystemEntityId]; // prettier-ignore
      });
      this.successHandler();
    }, this.readableErrorHandler.bind(this));
  }

  public cancelGetItSystems() {
    if (this._getItSystems$) {
      this._getItSystems$.unsubscribe();
    }
  }

  public cancelFromAddedSelectedSystemRecord() {
    if (this._fromAddedSelectedSystemRecord$) {
      this._fromAddedSelectedSystemRecord$.unsubscribe();
    }
  }

  public cancelFromAvailableSelectedSystemRecord() {
    if (this._fromAvailableSelectedSystemRecord$) {
      this._fromAvailableSelectedSystemRecord$.unsubscribe();
    }
  }

  /**
   * Get data for current system node record
   */
  public getDataForCurrentSystemNodeAvailable() {
    return forkJoin([
      this.dataSubjectsService.getDataSubjectsList(),
      this.dataElementsService.getDataElementsList(),
      this.locationService.getFullCountryList(),
      this.processingPurposeService.getProcessingPurposesList()
    ]);
  }
  /* END - API CALLS */

  /**
   * FILTER AND SEARCH FUNCTIONS
   */
  private getFilterSortDirectionValue(filterValue) {
    return filterValue && filterValue.filterSort.value
      ? filterValue.filterSort.value
      : 'ASC';
  }

  private getFilterCheckedValues(filterValue, property) {
    return filterValue
      ? _.chain(filterValue[property])
          .filter('checked')
          .map('name')
          .value()
      : [];
  }

  private getSearchQueryBySelectedFilters(searchString, filterValue) {
    return {
      search: searchString,
      sortField: 'name',
      sortDirection: this.getFilterSortDirectionValue(filterValue),
      customFilters: {
        SYS_OWN: {
          value: this.getFilterCheckedValues(filterValue, 'filterOwner'),
          nestedFilterValue: null
        },
        SYS_DS: {
          value: this.getFilterCheckedValues(filterValue, 'filterDataSubjects'),
          nestedFilterValue: null
        },
        SYS_DE: {
          value: this.getFilterCheckedValues(filterValue, 'filterDataElements'),
          nestedFilterValue: null
        },
        SYS_PP: {
          value: this.getFilterCheckedValues(
            filterValue,
            'filterProcessingPurposes'
          ),
          nestedFilterValue: null
        },
        SYS_LOC: {
          value: this.getFilterCheckedValues(
            filterValue,
            'filterHostingLocations'
          ),
          nestedFilterValue: null
        }
      },
      filters: {
        operand: 'AND',
        filters: [
          {
            fieldName: 'recordType',
            values: ['ItSystem']
          }
        ]
      }
    };
  }

  public navigate(url: string) {
    if (url === 'cancel' || url === 'home') {
      this.router.navigateByUrl('/business-process');
    } else {
      if (url === 'owner') {
        this.featureFlagControllerService
          .getAllFeatureFlags()
          .subscribe(allLicenses => {
            if (allLicenses.RHEA_NEW_UI_STEPS_12_LICENSE === true) {
              this.router.navigate([
                UtilsClass.getRelativeUrl(this.router.url, `../details`)
              ]);
            } else {
              this.navigateToUrl(url);
            }
          });
      } else if (url === 'data-flow') {
        this.featureFlagControllerService
          .getAllFeatureFlags()
          .subscribe(allLicenses => {
            if (allLicenses.RHEA_NEW_UI_STEPS_5_LICENSE === true) {
              this.navigateToUrl('build-data-flow');
            } else {
              this.navigateToUrl(url);
            }
          });
      } else {
        this.navigateToUrl(url);
      }
    }
  }

  public applySelectedFilter(event) {
    this.filtersFormValue = event;
    this.apiItSystemRecordsFilters();

    // Close popover
    this.popSysRecordsFilter.close();
  }

  public clearSelectedFilter(event) {
    this.filtersFormValue = event;
    this.filterSystemRecordsIsDirty = false;
    this.totalFilters = 0;
    this.apiItSystemRecordsFilters();

    // Close popover
    this.popSysRecordsFilter.close();
  }

  public updateSelectedFilter(event) {
    this.filtersFormValue = event;

    const totals = [];

    if (event) {
      // Calculate Sort filters totals
      const valueFormSort = this.filtersFormValue.filterSort.value ? 1 : 0;
      totals.push(valueFormSort);

      // Calculate Owner filters totals
      const valueFormOwner = _.map(
        this.filtersFormValue.filterOwner,
        'checked'
      ).filter(item => item === true).length;
      totals.push(valueFormOwner);

      // Calculate Data Subjects filters totals
      const valueFormDataSubjects = _.map(
        this.filtersFormValue.filterDataSubjects,
        'checked'
      ).filter(item => item === true).length;
      totals.push(valueFormDataSubjects);

      // Calculate Data Elements filters totals
      const valueFormDataElements = _.map(
        this.filtersFormValue.filterDataElements,
        'checked'
      ).filter(item => item === true).length;
      totals.push(valueFormDataElements);

      // Calculate Processing Purposes filters totals
      const valueFormProcessingPurposes = _.map(
        this.filtersFormValue.filterProcessingPurposes,
        'checked'
      ).filter(item => item === true).length;
      totals.push(valueFormProcessingPurposes);

      // Calculate Hosting Locations filters totals
      const valueFormHostingLocations = _.map(
        this.filtersFormValue.filterHostingLocations,
        'checked'
      ).filter(item => item === true).length;
      totals.push(valueFormHostingLocations);

      // Calculate total
      this.totalFilters = totals.reduce((a, b) => a + b, 0);
    }
  }

  public preventDestroy() {
    if (
      this.activeContent === 'add-system' ||
      this.activeContent === 'add-third-party' ||
      this.activeContent === 'add-company-affiliate'
    ) {
      return this.getChangeStatusByActiveContent(this.activeContent);
    } else {
      const isChanged = this.getChangeStatusByTabId(this.activeTabAdded);
      return isChanged.available || isChanged.added;
    }
  }

  private confirmChanges() {
    this.toastService.clear();

    this.taModal.open(this.modalConfirmation, {
      windowClass: 'ta-modal-confirmation',
      backdrop: 'static',
      keyboard: true,
      size: 'sm'
    });
  }

  private confirmChangesForAddingNewSystem() {
    this.toastService.clear();

    this.taModal.open(this.modalConfirmationThreeButton, {
      windowClass: 'ta-modal-confirmation',
      backdrop: 'static',
      keyboard: true,
      size: 'sm'
    });
  }

  private confirmChangesForAddingNewThirdParty() {
    this.toastService.clear();

    this.taModal.open(this.modalConfirmationThreeButton, {
      windowClass: 'ta-modal-confirmation',
      backdrop: 'static',
      keyboard: true,
      size: 'sm'
    });
  }

  private confirmChangesForAddingNewCompanyAffiliate() {
    this.toastService.clear();

    this.taModal.open(this.modalConfirmationThreeButton, {
      windowClass: 'ta-modal-confirmation',
      backdrop: 'static',
      keyboard: true,
      size: 'sm'
    });
  }

  public confirmDestroy(method: string, target: string | MouseEvent) {
    if (
      this.activeContent !== 'add-system' &&
      this.activeContent !== 'add-third-party' &&
      this.activeContent !== 'add-company-affiliate'
    ) {
      this.confirmModalFunction = {
        method,
        target
      };
      // [i18n-tobeinternationalized]
      this.confirmModalTitle = `Are you sure you want to discard your changes?`;
      this.confirmModalDescription = `Saving your changes will update the system record with any new data that was selected.
    ${
      this.isDisabledSave
        ? `<div class="text-danger">*At least one (1) location is required for each Data Subjects added.</div>`
        : ``
    }`;
      this.confirmModalType = 'question';
      this.confirmModalIcon = 'help';
      this.confirmModalLabelCancel = 'Yes, discard changes';
      this.confirmModalLabelConfirm = this.isDisabledSave
        ? 'Edit'
        : 'No, save changes';
      this.confirmChanges();
    } else if (this.activeContent === 'add-system') {
      this.confirmModalFunction = {
        method,
        target
      };
      // [i18n-tobeinternationalized]
      this.confirmModalTitle = 'You have unsaved new record.';
      this.confirmModalDescription = 'Do you want to create this record?';
      this.confirmModalType = 'question';
      this.confirmModalIcon = 'help';
      this.confirmModalLabelCancel = 'Cancel';
      this.confirmModalLabelDiscard = 'Discard';
      this.confirmModalLabelConfirm = 'Add record';
      this.confirmChangesForAddingNewSystem();
    } else if (this.activeContent === 'add-third-party') {
      this.confirmModalFunction = {
        method,
        target
      };
      // [i18n-tobeinternationalized]
      this.confirmModalTitle = 'You have unsaved new record.';
      this.confirmModalDescription = 'Do you want to create this record?';
      this.confirmModalType = 'question';
      this.confirmModalIcon = 'help';
      this.confirmModalLabelCancel = 'Cancel';
      this.confirmModalLabelDiscard = 'Discard';
      this.confirmModalLabelConfirm = 'Add record';
      this.confirmChangesForAddingNewThirdParty();
    } else if (this.activeContent === 'add-company-affiliate') {
      this.confirmModalFunction = {
        method,
        target
      };
      // [i18n-tobeinternationalized]
      this.confirmModalTitle = 'You have unsaved new record.';
      this.confirmModalDescription = 'Do you want to create this record?';
      this.confirmModalType = 'question';
      this.confirmModalIcon = 'help';
      this.confirmModalLabelCancel = 'Cancel';
      this.confirmModalLabelDiscard = 'Discard';
      this.confirmModalLabelConfirm = 'Add record';
      this.confirmChangesForAddingNewCompanyAffiliate();
    } else {
      console.warn('Unsupported activeContent');
    }
  }

  public confirmChangesAvailable() {
    this.confirmModalFunction = null;
    this.confirmModalTitle = `You've selected additional data that is not<br />on the system record.`;
    this.confirmModalDescription = `<div class="mt-3">
      Do you want to update your system record to include this data?
    </div>
    ${
      this.isDisabledSave
        ? `<div class="text-danger">*At least one (1) location is required for each Data Subjects added.</div>`
        : ``
    }`;
    this.confirmModalType = 'question';
    this.confirmModalIcon = 'help';
    this.confirmModalLabelCancel = 'Cancel';
    this.confirmModalLabelConfirm = this.isDisabledSave
      ? 'Edit'
      : 'Update Record';
    this.confirmChanges();
  }

  public async confirmChangesAdded() {
    this.confirmModalFunction = null;
    this.confirmModalTitle = `Are you sure you want to discard the changes you<br /> made?`;
    this.confirmModalDescription = ``;
    this.confirmModalType = 'question';
    this.confirmModalIcon = 'help';
    this.confirmModalLabelCancel = 'Yes, discard changes';
    this.confirmModalLabelConfirm = this.isDisabledSave
      ? 'Edit'
      : 'Save Changes';
    this.confirmChanges();
  }

  public async closeAllModals(preventChange?: boolean) {
    if (this.taModal.hasOpenModals) {
      this.isSaving = false;

      this.taModal.dismissAll();

      if (this.confirmModalFunction && !preventChange) {
        switch (this.confirmModalFunction.method) {
          case 'onSelectSystemFromAdded':
            this.onSelectSystemFromAdded(this.confirmModalFunction.target);
            break;
          case 'onSelectRecordFromAvailable':
            this.onSelectRecordFromAvailable(this.confirmModalFunction.target);
            break;
          case 'addToRecord':
            this.addToRecord(this.confirmModalFunction.target, false, {});
            break;
          case 'handleAddSystem':
            this.handleAddSystem(this.confirmModalFunction.target);
            break;
          case 'removeToRecord':
            this.removeToRecord(this.confirmModalFunction.target);
            break;
          case 'navigate':
            this.navigate(this.confirmModalFunction.target);
            break;
        }
      }

      if (this.nextActiveTabAdded && !preventChange) {
        this.activeTabAdded = this.nextActiveTabAdded;
      }
    }
  }

  public handleTabChange(event: TaTabChangeEvent) {
    this.updatedValue = [];
    const activeTabId = event.activeId;
    const isChanged = this.getChangeStatusByTabId(activeTabId);
    this.nextActiveTabAdded = event.nextId;

    if (isChanged.available) {
      event.preventDefault();
      this.confirmChangesAvailable();
    } else if (isChanged.added) {
      event.preventDefault();
      this.confirmChangesAdded();
    } else {
      this.activeTabAdded = this.nextActiveTabAdded;
    }
  }

  public saveDataFromSaveButton() {
    const activeTabId = this.activeTabAdded;
    const isChanged = this.getChangeStatusByTabId(activeTabId);
    if (isChanged.available) {
      this.confirmChangesAvailable();
    } else {
      this.saveDataByActiveTab();
    }
  }

  public saveDataByActiveTab() {
    const data = this.getSelectedItemsByEntityIdAndActiveTab(
      this.currentSelectedItSystemId,
      this.activeTabAdded
    );

    // Make a copy of payload
    const payloadOriginal = Object.assign(
      {},
      this.itSystemHashDataByEntityIdFull[this.currentSelectedItSystemId]
        .dataItSystemDataFlow
    );

    // Construct a new payload
    const payloadNew: any = {
      entityId: payloadOriginal.entityId
    };

    if (this.activeTabAdded === 'tabDataSubjectsAdded') {
      payloadNew.dataSubjects = data.DS;
      payloadNew.dataElementIds = this.getDataFromPayloadByType(
        DataInventoryDataType.DE,
        payloadOriginal
      );
      payloadNew.locationIds = this.getDataFromPayloadByType(
        DataInventoryDataType.HL,
        payloadOriginal
      );
      payloadNew.processingPurposeIds = this.getDataFromPayloadByType(
        DataInventoryDataType.PP,
        payloadOriginal
      );
    }

    if (this.activeTabAdded === 'tabDataElementsAdded') {
      payloadNew.dataSubjects = this.getDataFromPayloadByType(
        DataInventoryDataType.DS,
        payloadOriginal
      );
      payloadNew.dataElementIds = data.DE;
      payloadNew.locationIds = this.getDataFromPayloadByType(
        DataInventoryDataType.HL,
        payloadOriginal
      );
      payloadNew.processingPurposeIds = this.getDataFromPayloadByType(
        DataInventoryDataType.PP,
        payloadOriginal
      );
    }

    if (this.activeTabAdded === 'tabHostingLocationsAdded') {
      payloadNew.dataSubjects = this.getDataFromPayloadByType(
        DataInventoryDataType.DS,
        payloadOriginal
      );
      payloadNew.dataElementIds = this.getDataFromPayloadByType(
        DataInventoryDataType.DE,
        payloadOriginal
      );
      payloadNew.locationIds = data.HL;
      payloadNew.processingPurposeIds = this.getDataFromPayloadByType(
        DataInventoryDataType.PP,
        payloadOriginal
      );
    }

    if (this.activeTabAdded === 'tabProcessingPurposesAdded') {
      payloadNew.dataSubjects = this.getDataFromPayloadByType(
        DataInventoryDataType.DS,
        payloadOriginal
      );
      payloadNew.dataElementIds = this.getDataFromPayloadByType(
        DataInventoryDataType.DE,
        payloadOriginal
      );
      payloadNew.locationIds = this.getDataFromPayloadByType(
        DataInventoryDataType.HL,
        payloadOriginal
      );
      payloadNew.processingPurposeIds = data.PP;
    }

    if (payloadNew.locationIds.length === 0) {
      // This error message will catch if the initial locationsIds is empty
      this.errorToastMessage(
        'You must have at least 1 hosting location to save'
      );
    } else {
      this.apiDataFlowUpdateItSystemEntityFromDataFlow(
        this.currentSelectedItSystemId,
        payloadNew
      );
    }
  }

  public notifySavingIsNeeded() {
    if (this.taModal.hasOpenModals) {
      this.taModal.dismissAll();
    }
    this.notificationService.emit({
      action: 'NEW_IT_SYSTEM_SAVE_START',
      payload: {
        confirmModalFunction: this.confirmModalFunction
      }
    });
  }

  public handleSystemAdded(event, bubbleUp = false) {
    const { res, options = {} } = event;
    this.addToRecord(res.id, bubbleUp, options);
  }

  public handleThirdPartyAdded(event) {
    const state = this.systemRecordAddService.getState();
    const newState = _.merge(state, {
      details: {
        data: {
          legalEntity: {
            id: event.id,
            name: event.name
          }
        }
      }
    });
    this.systemRecordAddService.setState(newState);
    this.activeContent = 'add-system';
  }

  public handleCompanyAffiliateAdded(event) {
    const state = this.systemRecordAddService.getState();
    const newState = _.merge(state, {
      details: {
        data: {
          legalEntity: {
            id: event.id,
            name: event.name
          }
        }
      }
    });
    this.systemRecordAddService.setState(newState);
    this.activeContent = 'add-system';
  }

  public handleDiscarded(event) {
    const { selectedRecordId } = event;
    if (selectedRecordId) {
      const foundInAdded = this.itSystemRecords.addedRecords.find(
        item => item.entityId === selectedRecordId
      );
      if (foundInAdded) {
        return this.onSelectSystemFromAdded(selectedRecordId);
      }
      return this.onSelectRecordFromAvailable(selectedRecordId);
    }
    return (this.activeContent = 'none');
  }

  public handleDiscardAddingThirdParty() {
    return (this.activeContent = 'add-system');
  }

  public handleDiscardAddingCompanyAffiliate() {
    return (this.activeContent = 'add-system');
  }

  public handleBackRedirect() {
    return (this.activeContent = 'add-system');
  }

  public handleAddNewEntity(event) {
    if (event === ThirdPartyType.THIRD_PARTY) {
      this.activeContent = 'add-third-party';
    }
    if (event === ThirdPartyType.COMPANY_AFFILIATE) {
      this.activeContent = 'add-company-affiliate';
    }
  }

  private getDataFromPayloadByType(type, payload) {
    switch (type) {
      case DataInventoryDataType.DS:
        return payload.dataSubjects.map(item => ({
          dataSubjectId: item.entityId,
          locationIds: item.locationIds
        }));
      case DataInventoryDataType.DE:
        return payload.dataElementIds;
      case DataInventoryDataType.HL:
        return payload.locations.map(item => item.location.id);
      case DataInventoryDataType.PP:
        return payload.processingPurposeIds;
      default:
        return [];
    }
  }

  public updateSelected(event) {
    this.updatedValue = event;
  }

  private getSelectedItemsByEntityIdAndActiveTab(entityId, activeTab) {
    const getData = gridId => this.tableService.getSelected(gridId);

    // Data Subjects
    if (activeTab === 'tabDataSubjectsAdded') {
      const attachedDS = getData(`${entityId}-ds-attached`).map(i => {
        return {
          dataSubjectId: i.entityId,
          locationIds: i.locationIds
        };
      });
      const availableDS = getData(`${entityId}-ds-available`).map(i => {
        return {
          dataSubjectId: i.id,
          locationIds: i.locationIds
        };
      });

      return {
        DS: [...attachedDS, ...availableDS]
      };
    }

    // Data Elements
    if (activeTab === 'tabDataElementsAdded') {
      return { DE: this.updatedValue };
    }

    // Hosting Locations
    if (activeTab === 'tabHostingLocationsAdded') {
      const attachedHL = getData(`${entityId}-hl-attached`).map(i => i.id);
      const availableHL = getData(`${entityId}-hl-available`).map(i => i.id);

      const cachedLocationsForDataFlow = this.itSystemHashDataByEntityIdFull[
        this.currentSelectedItSystemId
      ].dataItSystemDataFlow.locations.map(item => item.location);

      const cachedLocationsForInventory = this.itSystemHashDataByEntityIdFull[
        this.currentSelectedItSystemId
      ].dataItSystemInventory.locations;

      const locationIdForAttached = attachedHL
        .map(countryId => {
          const foundFromDataFlow = cachedLocationsForDataFlow.find(
            loc => loc.countryId === countryId && loc.stateOrProvinceId === null
          );
          if (foundFromDataFlow) {
            return foundFromDataFlow.id;
          }
          const foundFromInventory = cachedLocationsForInventory.find(
            loc => loc.countryId === countryId && loc.stateOrProvinceId === null
          );
          if (foundFromInventory) {
            return foundFromInventory.id;
          }
          return null;
        })
        .filter(id => id !== null);

      const allHL = _.uniq([...locationIdForAttached, ...availableHL]);

      return {
        HL: allHL
      };
    }

    // Processing purposes
    if (activeTab === 'tabProcessingPurposesAdded') {
      return {
        PP: this.updatedValue
      };
    }
  }

  private getCountriesFromRegionsData(regions) {
    return _.chain(regions)
      .map('countries')
      .flatten()
      .sortBy('name')
      .value();
  }

  public updateValidity(event) {
    // If validity is truthy - set Save disability to false
    return (this.isDisabledSave = !event);
  }

  public updateChangeStatusByTabId(event, tabId) {
    if (tabId === 'tabDataSubjectsAdded') {
      this.isTabChangedDataSubjects = event;
    }
    if (tabId === 'tabDataElementsAdded') {
      this.isTabChangedDataElements = event;
    }
    if (tabId === 'tabHostingLocationsAdded') {
      this.isTabChangedHostingLocations = event;
    }
    if (tabId === 'tabProcessingPurposesAdded') {
      this.isTabChangedProcessingPurposes = event;
    }
  }

  public updateChangeStatusByActiveContent(event, activeContent) {
    if (activeContent === 'add-system') {
      this.isAddSystemContentChanged = event;
    }
    if (activeContent === 'add-third-party') {
      this.isAddThirdPartyContentChanged = event;
    }
    if (activeContent === 'add-company-affiliate') {
      this.isAddCompanyAffiliateContentChanged = event;
    }
  }

  private getChangeStatusByTabId(tabId) {
    if (tabId === 'tabDataSubjectsAdded') {
      return this.isTabChangedDataSubjects;
    }
    if (tabId === 'tabDataElementsAdded') {
      return this.isTabChangedDataElements;
    }
    if (tabId === 'tabHostingLocationsAdded') {
      return this.isTabChangedHostingLocations;
    }
    if (tabId === 'tabProcessingPurposesAdded') {
      return this.isTabChangedProcessingPurposes;
    }
  }

  private getChangeStatusByActiveContent(activeContent) {
    if (activeContent === 'add-system') {
      return this.isAddSystemContentChanged;
    }
    if (activeContent === 'add-third-party') {
      return this.isAddThirdPartyContentChanged;
    }
    if (activeContent === 'add-company-affiliate') {
      return this.isAddCompanyAffiliateContentChanged;
    }
  }

  private successHandler() {
    this.toastService.clear();
    this.toastService.success(
      'System Record has been successfully updated.',
      null,
      5000
    );
  }

  private errorHandler(errorMessage?) {
    const message = errorMessage
      ? errorMessage
      : // to be Internalize src/assets/i18n
        'Error updating record.';

    this.closeAllModals(true);
    this.errorToastMessage(message);
    this.disableAddAndRemove = false;
    this.isSaving = false;
  }

  readableErrorHandler(exception) {
    const errorMessage =
      exception && exception.error && exception.error.message
        ? exception.error.message
        : null;
    this.errorHandler(errorMessage);
    return throwError(exception);
  }

  private errorToastMessage(message) {
    this.toastService.clear();
    this.toastService.error(message, null, 5000);
  }

  public handlerExpanded() {
    // this.isStandardView = !this.isStandardView;
    if (this.isExpandedView) {
      this.isExpandedView = false;
    } else {
      this.isStandardView = !this.isStandardView;
    }
  }

  private navigateToUrl(url): void {
    const currentUrl = _.last(this.router.url.split('/'));
    this.router
      .navigate([this.router.url.replace(currentUrl, url)])
      .then(() => {
        this.createBusinessProcessesService.setSelectedStep(url);
      });
  }
}
