import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataFlowService } from 'src/app/shared/_services/data-flow/data-flow.service';
import { DATA_FLOW_CONSTANTS } from 'src/app/shared/_constant';
import { TableService, TaModalRef } from '@trustarc/ui-toolkit';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { DataFlowControllerService } from 'src/app/shared/_services/rest-api';
import {
  DataElementItemResponseRawInterface,
  FormItemInterface,
  NodeDetailsData,
  ProcessingPurposeItemResponseRawInterface
} from 'src/app/shared/_interfaces';
import { DataElementService } from 'src/app/shared/_services/data-inventory/data-element/data-element.service';
import { ProcessingPurposeService } from 'src/app/shared/_services/data-inventory/processing-purpose/processing-purpose.service';
import { LocationService } from 'src/app/shared/services/location/location.service';

declare const _: any;

interface AppliedFilters {
  locations: string[];
  dataElements: string[];
  processingPurposes: string[];
}

interface FilteredKey {
  locations: string;
  dataElements: string;
  processingPurposes: string;
  region: string;
}

@AutoUnsubscribe([
  '_nodeSubscription$',
  '_loadingSubscription$',
  '_eventRequestRefDataElements$',
  '_eventRequestRefLocations$',
  '_eventRequestRefProcessingPurposes$',
  '_detailsDataSubscription$'
])
@Component({
  selector: 'ta-data-flow-chart-modal-details',
  templateUrl: './data-flow-chart-modal-details.component.html',
  styleUrls: ['./data-flow-chart-modal-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataFlowChartModalDetailsComponent implements OnInit, OnDestroy {
  @Input() public modal: TaModalRef;
  @Input() public nodeInfo: NodeDetailsData;
  @Output() public closeModal = new EventEmitter<null>();
  @Output() public edit = new EventEmitter<string>();

  public isLoading: boolean;

  public readonly locationsGrid = DATA_FLOW_CONSTANTS.locationsGrid;
  public readonly dataElementsGrid = DATA_FLOW_CONSTANTS.dataElementsGrid;
  public readonly processingPurposesGrid =
    DATA_FLOW_CONSTANTS.processingPurposesGrid;

  public readonly locationsKey = DATA_FLOW_CONSTANTS.locationsKey;
  public readonly dataElementsKey = DATA_FLOW_CONSTANTS.dataElementsKey;
  public readonly processingPurposesKey =
    DATA_FLOW_CONSTANTS.processingPurposesKey;

  public selectedEntities = {
    locations: [],
    dataElements: [],
    processingPurposes: []
  };

  private _nodeSubscription$: Subscription;
  private _loadingSubscription$: Subscription;
  private _eventRequestRefDataElements$: Subscription = null;
  private _eventRequestRefLocations$: Subscription = null;
  private _eventRequestRefProcessingPurposes$: Subscription = null;
  private _detailsDataSubscription$: Subscription = null;
  private filteredItems = [];

  private isShowingSelectedItems: {
    locations: boolean;
    dataElements: boolean;
    processingPurposes: boolean;
  };

  public filterDataRegions: FormItemInterface[] = [];
  public filterSelectedRegions: string[] = [];
  public searchTermRegions = '';

  public filterDataDataElements: FormItemInterface[] = [];
  public filterSelectedDataElements: string[] = [];
  public searchTermDataElements = '';

  public filterDataProcessingPurposes: FormItemInterface[] = [];
  public filterSelectedProcessingPurposes: string[] = [];
  public searchTermProcessingPurposes = '';

  // [i18n-tobeinternationalized]
  public headerTitleCategory = 'Filter by Category';
  // [i18n-tobeinternationalized]
  public headerTitleRegion = 'Filter by Region';
  // [i18n-tobeinternationalized]
  public searchPlaceholderLocations = 'Search Location';
  // [i18n-tobeinternationalized]
  public searchPlaceholderDataElements = 'Search Data Element';
  // [i18n-tobeinternationalized]
  public searchPlaceholderProcessingPurposes = 'Search Processing Purpose';

  constructor(
    private dataFlowService: DataFlowService,
    private tableService: TableService,
    private dataFlowControllerService: DataFlowControllerService,
    private dataElementService: DataElementService,
    private processingPurposeService: ProcessingPurposeService,
    private locationService: LocationService
  ) {}

  public ngOnInit(): void {
    this.isLoading = true;
    this.isShowingSelectedItems = {
      locations: false,
      dataElements: false,
      processingPurposes: false
    };

    if (this.nodeInfo && this.nodeInfo.editable) {
      this.getDetailsData();
    } else {
      this.initNodeDataSubscription();
    }
  }

  public ngOnDestroy(): void {
    this.nodeInfo = null;
  }

  public handleCloseModal(): void {
    this.dataFlowService.setDetailsNode(null);
    this.closeModal.emit();
  }

  private initNodeDataSubscription(): void {
    this._nodeSubscription$ = this.dataFlowService._detailsNode$.subscribe(
      nodeData => {
        this.nodeInfo = nodeData;
      }
    );
    this._loadingSubscription$ = this.dataFlowService._detailsNodeModalLoading$.subscribe(
      isLoading => {
        this.isLoading = isLoading;
        this.subscribeTableEvents();
      }
    );
  }

  public sort(colmn, type, key): void {
    if (this.nodeInfo) {
      if (type === '' || type === 'asc') {
        type = 'desc';
        this.nodeInfo.node[key].sort((b, a) => {
          const strb = b[colmn];
          const stra = a[colmn];
          return strb.toString().localeCompare(stra.toString());
        });
      } else if (type === 'desc') {
        type = 'asc';
        this.nodeInfo.node[key].sort((a, b) => {
          const strb = b[colmn];
          const stra = a[colmn];
          return strb.toString().localeCompare(stra.toString());
        });
      }
    }

    this.nodeInfo.node[key] = [...this.nodeInfo.node[key]];
  }

  public getSelected(prop) {
    return this.nodeInfo.node[prop].filter(entity =>
      this.determineSelected(entity.id, prop)
    );
  }

  public showAllSelected(event, prop, gridId): void {
    if (event && event.target.checked !== undefined) {
      if (event.target.checked) {
        this.isShowingSelectedItems[prop] = true;
        this.nodeInfo.node[prop] = this.getSelected(prop);
      } else {
        this.isShowingSelectedItems[prop] = false;
        this.nodeInfo.node[prop] = this.setDataToNode(prop);
      }
    }
  }

  public determineSelected(id: string, key: string): boolean {
    return !!this.selectedEntities[key].find(item => item.id === id);
  }

  public async saveDataTransFerDetails() {
    this.dataFlowService.setDataTransferUpdateData({
      id: this.nodeInfo.node.uniqueId,
      data: { ...this.selectedEntities },
      direction: this.nodeInfo.direction,
      type: this.nodeInfo.type
    });
    this.dataFlowService.setDetailsNode(null);
    this.closeModal.emit();
  }

  public checkAll(event, key: string): void {
    if (event && event.target.checked !== undefined) {
      const appliedFilters = {
        locations: this.filterSelectedRegions,
        dataElements: this.filterSelectedDataElements,
        processingPurposes: this.filterSelectedProcessingPurposes
      };
      const filteredKey = {
        locations: 'globalRegions[0].name',
        dataElements: 'category',
        processingPurposes: 'category',
        region: 'region'
      };
      if (event.target.checked) {
        if (!this.isShowingSelectedItems[key]) {
          this.selectAllIncludeFilters(appliedFilters, key, filteredKey);
        }
      } else {
        if (this.isShowingSelectedItems[key]) {
          this.selectedEntities[key] = [];
          this.nodeInfo.node[key] = this.getSelected(key);
        } else {
          if (appliedFilters[key].length > 0) {
            this.unSelectWithFilters(filteredKey, key, appliedFilters);
            this.filteredItems = [];
          } else {
            this.selectedEntities[key] = [];
            this.filteredItems = [];
          }
        }
      }
    }
  }

  public isAllSelected(key: string): boolean {
    return (
      this.selectedEntities[key].length ===
      this.dataFlowControllerService.allDataNodes[key].length
    );
  }

  public isIndeterminate(key: string): boolean {
    if (this.selectedEntities[key].length === 0) {
      return false;
    }
    return (
      this.selectedEntities[key].length !==
      this.dataFlowControllerService.allDataNodes[key].length
    );
  }

  public updateSelected(event, node, key: string) {
    if (event && event.target.checked !== undefined) {
      if (event.target.checked) {
        this.selectedEntities[key].push(node);
      } else {
        const foundIndex = this.selectedEntities[key].findIndex(
          item => item.id === node.id
        );
        this.selectedEntities[key].splice(foundIndex, 1);
      }
    }
  }

  public getLeftClass(): string {
    return this.nodeInfo.editable ? 'left-editable' : 'left-not-editable';
  }
  public editDataTransfer(): void {
    this.edit.emit(this.nodeInfo.systemId);
  }

  private selectAllIncludeFilters(
    appliedFilters: AppliedFilters,
    key: string,
    filteredKey: FilteredKey
  ) {
    if (appliedFilters[key].length > 0) {
      appliedFilters[key].forEach(applied => {
        const allByApplied = this.dataFlowControllerService.allDataNodes[
          key
        ].reduce((ac, current) => {
          const attrFilter = filteredKey[key];
          const found = this.selectedEntities[key].find(
            item => item.id === current.id
          );
          if (_.get(current, attrFilter) === applied && !found) {
            ac.push(current);
          }
          return ac;
        }, []);

        this.filteredItems = [...this.filteredItems, ...allByApplied];
      });
      this.selectedEntities[key] = [
        ...this.selectedEntities[key],
        ...this.filteredItems
      ];
    } else {
      this.selectedEntities[key] = this.dataFlowControllerService.allDataNodes[
        key
      ];
    }
  }

  private unSelectWithFilters(
    filteredKey: FilteredKey,
    key: string,
    appliedFilters: AppliedFilters
  ) {
    const attrFilter = filteredKey[key];
    const selectedEntitiesIds = this.selectedEntities[key].map(
      selected => selected.id
    );
    this.selectedEntities[key] = this.dataFlowControllerService.allDataNodes[
      key
    ].filter(item => selectedEntitiesIds.includes(item.id));
    appliedFilters[key].forEach(applied => {
      this.selectedEntities[key] = this.selectedEntities[key].reduce(
        (ac, current) => {
          if (_.get(current, attrFilter) !== applied) {
            ac.push(current);
          }
          return ac;
        },
        []
      );
    });
  }

  private subscribeSortEvents(
    gridId: string,
    keyOnNode: string,
    subscription: Subscription
  ): void {
    subscription = this.tableService
      .listenRequestEvents(gridId)
      .subscribe(request => {
        if (request['sortType']) {
          this.sort(request['columnSort'], request['sortType'], keyOnNode);
        }
      });
  }

  private getDetailsData(): void {
    this.initializedVariables();
    if (
      this.dataFlowControllerService.allDataNodes.locations.length === 0 ||
      this.dataFlowControllerService.allDataNodes.dataElements.length === 0 ||
      this.dataFlowControllerService.allDataNodes.processingPurposes.length ===
        0
    ) {
      this._detailsDataSubscription$ = forkJoin([
        this.getAllDataElements(),
        this.getAllProcessingPurposes(),
        this.locationService.getCountries()
      ]).subscribe(([dataElements, processingPurposes, countries]) => {
        this.dataFlowControllerService.allDataNodes.dataElements = dataElements;
        this.dataFlowControllerService.allDataNodes.processingPurposes = processingPurposes;
        this.dataFlowControllerService.allDataNodes.locations = countries;
        this.loadAllData();
      });
    } else {
      this.loadAllData();
    }
  }

  private initializedSelection(key): void {
    if (this.selectedEntities[key].length === 0) {
      this.selectedEntities[key] = this.nodeInfo.node[key];
    }
  }

  private loadAllData(): void {
    if (this.nodeInfo.node[this.locationsKey]) {
      this.initializedSelection(this.locationsKey);
      this.nodeInfo.node[this.locationsKey] = this.setDataToNode(
        this.locationsKey
      );
    }
    if (this.nodeInfo.node[this.dataElementsKey]) {
      this.initializedSelection(this.dataElementsKey);
      this.nodeInfo.node[this.dataElementsKey] = this.setDataToNode(
        this.dataElementsKey
      );
    }
    if (this.nodeInfo.node[this.processingPurposesKey]) {
      this.initializedSelection(this.processingPurposesKey);
      this.nodeInfo.node[this.processingPurposesKey] = this.setDataToNode(
        this.processingPurposesKey
      );
    }

    this.getFilterData(
      this.nodeInfo.node[this.locationsKey],
      this.locationsKey,
      'region'
    );

    this.getFilterData(
      this.nodeInfo.node[this.dataElementsKey],
      this.dataElementsKey,
      'category'
    );

    this.getFilterData(
      this.nodeInfo.node[this.processingPurposesKey],
      this.processingPurposesKey,
      'category'
    );

    this.subscribeTableEvents();

    this.isLoading = false;
  }

  private setDataToNode(keyAllData: string): [] {
    const nameInData = {
      [DATA_FLOW_CONSTANTS.locationsKey]: 'name',
      [DATA_FLOW_CONSTANTS.dataElementsKey]: 'dataElement',
      [DATA_FLOW_CONSTANTS.processingPurposesKey]: 'processingPurpose'
    };

    return this.dataFlowControllerService.allDataNodes[keyAllData].map(
      dataItem => {
        return {
          id: dataItem.id,
          label: dataItem[nameInData[keyAllData]],
          region:
            keyAllData === this.locationsKey
              ? dataItem.globalRegions[0].name
              : null,
          category: dataItem.category ? dataItem.category : null
        };
      }
    );
  }

  private subscribeTableEvents(): void {
    this.subscribeSortEvents(
      this.dataElementsGrid,
      this.dataElementsKey,
      this._eventRequestRefDataElements$
    );
    this.subscribeSortEvents(
      this.processingPurposesGrid,
      this.processingPurposesKey,
      this._eventRequestRefProcessingPurposes$
    );
    this.subscribeSortEvents(
      this.locationsGrid,
      this.locationsKey,
      this._eventRequestRefLocations$
    );
  }

  private initializedVariables(): void {
    this.tableService.clearAllSelected(this.processingPurposesGrid);
    this.tableService.clearAllSelected(this.dataElementsGrid);
    this.tableService.clearAllSelected(this.locationsGrid);
    this.selectedEntities = {
      locations: [],
      dataElements: [],
      processingPurposes: []
    };
  }

  private getAllDataElements(): Observable<
    DataElementItemResponseRawInterface[]
  > {
    return this.dataElementService
      .getDataElementsList()
      .pipe(map(res => res.content));
  }

  private getAllProcessingPurposes(): Observable<
    ProcessingPurposeItemResponseRawInterface[]
  > {
    return this.processingPurposeService
      .getProcessingPurposesList()
      .pipe(map(res => res.content));
  }

  public getFilterData(data, type, groupField) {
    const filterData = [];
    _.chain(data)
      .cloneDeep()
      .groupBy(groupField)
      .keys()
      .sort()
      .value()
      .forEach(region => {
        filterData.push({
          id: region,
          label: region
        });
      });

    if (type === this.locationsKey) {
      this.filterDataRegions = filterData;
    }
    if (type === this.dataElementsKey) {
      this.filterDataDataElements = filterData;
    }
    if (type === this.processingPurposesKey) {
      this.filterDataProcessingPurposes = filterData;
    }
  }

  public applyFilterForm(value, type) {
    const applied = value
      .filter(item => item.checked === true)
      .map(item => item.id);

    if (type === this.locationsKey) {
      this.filterSelectedRegions = applied;
    }
    if (type === this.dataElementsKey) {
      this.filterSelectedDataElements = applied;
    }
    if (type === this.processingPurposesKey) {
      this.filterSelectedProcessingPurposes = applied;
    }
  }

  public onSearch(event, type) {
    if (type === this.locationsKey) {
      this.searchTermRegions = event;
    }
    if (type === this.dataElementsKey) {
      this.searchTermDataElements = event;
    }
    if (type === this.processingPurposesKey) {
      this.searchTermProcessingPurposes = event;
    }
  }
}
