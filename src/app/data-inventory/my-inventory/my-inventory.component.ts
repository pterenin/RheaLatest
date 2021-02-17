import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { noop, Subscription } from 'rxjs';
import {
  TableService,
  TaModal,
  TaPopover,
  TaTableRequest,
  ToastService
} from '@trustarc/ui-toolkit';
import { RISK_PROFILE_URL, ThirdPartyType } from 'src/app/app.constants';
import { DataInventoryService } from '../data-inventory.service';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { DatagridHeaderService } from 'src/app/shared/services/record-listing/datagrid-header.service';
import { DataInventoryInterface } from 'src/app/shared/models/bp-data-model';
import { ThirdPartyService } from 'src/app/shared/services/third-party/third-party.service';
import { CompanyAffiliateService } from 'src/app/shared/services/company-affiliate/company-affiliate.service';
import { CustomFiltersService } from 'src/app/shared/services/custom-filters/custom-filters.service';
import { ItSystemService } from 'src/app/shared/services/it-system/it-system.service';
import { DatatableService } from 'src/app/shared/services/record-listing/datatable.service';
import { MyInventoryService } from './my-inventory.service';
// tslint:disable-next-line: max-line-length
import { ConfirmDeleteContentComponent } from 'src/app/shared/components/record-datagrid/confirm-delete-content/confirm-delete-content.component';
import { exists, defaultTo } from 'src/app/shared/utils/basic-utils';
import {
  ColumnConfigInterface,
  FeatureFlagAllInterface
} from 'src/app/shared/_interfaces';
import { BaseRecordService } from 'src/app/shared/services/base-record/base-record.service';
import { ImportDataComponent } from 'src/app/data-inventory/my-inventory/import-data/import-data.component';
import { ExportService } from 'src/app/shared/services/export/export.service';
import { HeaderService } from 'src/app/shared/components/header/header.service';
import { CloneRecordInventoryModalComponent } from './clone-record-modal/clone-record-inventory-modal.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PageConfigControllerService } from '../../shared/_services/rest-api/page-config-controller/page-config-controller.service';
import { MainListTypesEnum } from '../../shared/_enums';
// tslint:disable-next-line:max-line-length
import { PrimaryEntityControllerService } from 'src/app/shared/_services/rest-api/primary-entity-controller/primary-entity-controller.service';

export type DataInventoryType =
  | 'COMPANY_AFFILIATE'
  | 'PRIMARY_ENTITY'
  | 'IT_SYSTEM'
  | 'VENDOR'
  | 'PARTNER'
  | 'CUSTOMER'
  | 'SERVICE_PROVIDER'
  | 'BUSINESS_ASSOCIATE'
  | 'OTHER';

const DATA_INVENTORY_LABELS = {
  COMPANY_AFFILIATE: 'Company Affiliate',
  PRIMARY_ENTITY: 'Primary Entity',
  IT_SYSTEM: 'System',
  VENDOR: 'Vendor',
  PARTNER: 'Partner',
  CUSTOMER: 'Customer',
  SERVICE_PROVIDER: 'Service Provider',
  BUSINESS_ASSOCIATE: 'Business Associate'
};

declare const _: any;

@AutoUnsubscribe([
  '_pageConfig$',
  '_getDataInventoryData$',
  '_recordsDeleted$',
  '_deleteRecord$',
  '_cacheFilters$',
  '_hasPrimaryEntity$',
  'eventRequestRef',
  'loadApiRef',
  'eventSelectedRef',
  'eventPageSelectedItemsRef',
  '_getLinkedBPs$'
])
@Component({
  selector: 'ta-my-inventory',
  templateUrl: './my-inventory.component.html',
  styleUrls: ['./my-inventory.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyInventoryComponent implements OnInit, OnDestroy {
  @ViewChildren(TaPopover) popovers: QueryList<TaPopover>;

  private readonly NO_REVIEW_RISK_ITEMS = [
    ThirdPartyType.PARTNER,
    ThirdPartyType.VENDOR,
    ThirdPartyType.CUSTOMER,
    ThirdPartyType.SERVICE_PROVIDER,
    ThirdPartyType.BUSINESS_ASSOCIATE,
    ThirdPartyType.COMPANY_AFFILIATE
  ];

  public tableData: DataInventoryInterface[] = [];
  public isFetching = false;
  public gridID = 'dataInventoryTable';
  public totalRows: number;
  public request: TaTableRequest = {};
  public riskStatus = null;
  public page = 1;
  public maxRows = 25;
  public isFilterDirty = false;
  public filterValue = '';
  public customFilters = null;
  public licenses: FeatureFlagAllInterface = {};
  public deleteBtnDisabled = true;
  public downloadSelectedBtnDisabled = true;
  public columnsConfigForm: FormGroup;
  public columnsChecked: ColumnConfigInterface[] = [];
  // [i18n-tobeinternationalized]
  public hasPrimaryEntityTooltip = 'Primary Entity already exists';
  public hasPrimaryEntity = false;
  public elpisUrl: string;
  public currentColumnLength: number;
  public get columns(): FormArray {
    return this.columnsConfigForm.get('columns') as FormArray;
  }
  public isLoadingLinkedBPs: boolean;

  private previousRequest: TaTableRequest = {};
  private search = null;
  private selectedItems: DataInventoryInterface[] = [];
  private currentPageSelectedItems: DataInventoryInterface[] = [];
  private _pageConfig$: Subscription = null;
  private _recordsDeleted$: Subscription = null;
  private _deleteRecord$: Subscription = null;
  private eventRequestRef: Subscription = null;
  private _cacheFilters$: Subscription = null;
  private _hasPrimaryEntity$: Subscription = null;
  private loadApiRef: Subscription = null;
  private eventSelectedRef: Subscription = null;
  private eventPageSelectedItemsRef: Subscription = null;
  private _getLinkedBPs$: Subscription;
  private _getDataInventory$: Subscription;
  private isRiskEnabled = false;
  private clioAppDetails: any;
  // Seems only way to obtain user information is through the window object :S
  private userEmail = window.truste ? window.truste.aaa.topHeader.name : '';

  constructor(
    private companyAffiliateService: CompanyAffiliateService,
    private primaryEntityService: PrimaryEntityControllerService,
    private pageConfigControllerService: PageConfigControllerService,
    private datatableService: DatatableService,
    private dataInventoryService: DataInventoryService,
    private myInventoryService: MyInventoryService,
    private datagridHeaderService: DatagridHeaderService,
    private customFiltersService: CustomFiltersService,
    private baseRecordService: BaseRecordService,
    private itSystemService: ItSystemService,
    private modalService: TaModal,
    private router: Router,
    private tableService: TableService,
    private thirdPartyService: ThirdPartyService,
    private toastService: ToastService,
    private exportService: ExportService,
    private headerService: HeaderService,
    private formBuilder: FormBuilder
  ) {
    this.columnsConfigForm = this.formBuilder.group({
      columns: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.initCachedFilter();
    this.filterResultsOnSearch();
    this.checkHasPrimaryEntity();

    this.page = this.myInventoryService.getPage();

    this.datatableService.initGridSources(this.gridID);

    // subscribe service sort, search
    if (this.eventRequestRef) {
      this.eventRequestRef.unsubscribe();
    }

    this.eventRequestRef = this.tableService
      .listenRequestEvents(this.gridID)
      .subscribe(request => {
        this.request = request;

        if (
          request.columnSort !== this.previousRequest.columnSort ||
          request.sortType !== this.previousRequest.sortType
        ) {
          this.renderData();
        }

        this.previousRequest = request;
      });

    // subscribe event selected items of all page
    this.eventSelectedRef = this.tableService
      .listenSelectedItemsEvents(this.gridID)
      .subscribe((items: DataInventoryInterface[]) => {
        this.selectedItems = items;
        this.updateDownloadSelectedBtnDisabled();
      });

    // subscribe event selected items of current page
    this.eventPageSelectedItemsRef = this.tableService
      .listenPageSelectedItemsEvents(this.gridID)
      .subscribe((items: DataInventoryInterface[]) => {
        this.currentPageSelectedItems = items;
        this.updateDeleteBtnDisabled();
      });

    this._recordsDeleted$ = this.baseRecordService
      .getRecordsDeleted()
      .subscribe(happened => {
        this.renderData();
      });

    this.datatableService.riskEnabled$.subscribe(status => {
      this.isRiskEnabled = status;
    });
    this.datatableService.riskService$.subscribe(riskStatus => {
      this.riskStatus = riskStatus;
    });

    this.clioAppDetails = this.headerService.getClientApp('clio-client');

    this.initColumnConfiguration();
    this.isLoadingLinkedBPs = false;
  }

  ngOnDestroy() {
    this.datatableService.clearGridSources(this.gridID);
  }

  private filterResultsOnSearch() {
    const boundSearch = this.onSearch.bind(this);
    _.delay(() => {
      document
        .querySelector('.ta-table-toolbar-search input')
        .addEventListener('keyup', (searchEvent: any) => {
          const fn = _.debounce(
            () => boundSearch(searchEvent.target.value),
            50
          );
          fn();
        });
    }, 200);
  }

  public refreshData() {
    this.renderData();
  }

  public renderData() {
    if (this._getDataInventory$) {
      this._getDataInventory$.unsubscribe();
    }
    if (this.loadApiRef) {
      this.loadApiRef.unsubscribe();
    }
    this.isFetching = true;
    this.setColumnForSkeletonLoader();
    this.loadApiRef = this.loadAPI().subscribe(
      response => {
        this.tableData = response.content;
        this.totalRows = Number(response.totalElements);
        this.isFetching = false;
      },
      error => {
        this.toastService.error('Error retrieving data inventory.'); // [i18n-tobeinternationalized]
      }
    );
  }

  public loadLinkedBPs(item): void {
    this.isLoadingLinkedBPs = true;
    if (this._getLinkedBPs$) {
      this._getLinkedBPs$.unsubscribe();
    }
    this.dataInventoryService.getLinkedBPs(item.id).subscribe(response => {
      item.linkedBPs = response.businessProcesses;
      this.isLoadingLinkedBPs = false;
    });
  }

  private loadAPI() {
    this.request.page = this.page;
    this.request.maxRows = this.maxRows;
    this.request.search = this.search;
    this.request.customFilters =
      this.customFilters && this.customFilters.filters
        ? this.customFilters.filters
        : {};

    this.request.sortType = this.search ? 'asc' : this.request.sortType;
    return this.dataInventoryService.getDataInventory(this.request);
  }

  public onChangeMax(event) {
    this.maxRows = event;
    this.renderData();
  }

  public onChangePage(event) {
    this.page = event;
    this.myInventoryService.setPage(event);
    this.renderData();
  }

  public onSearch(event) {
    this.search = event;
    this.page = 1;
    this.myInventoryService.setPage(1);
    this.renderData();
  }

  public onRiskItem(item) {
    if (this.clioAppDetails) {
      const url =
        this.riskStatus && this.riskStatus.riskService
          ? RISK_PROFILE_URL.VERSION_2
          : RISK_PROFILE_URL.VERSION_1;
      window.open(this.clioAppDetails.url + url + item.id, '_blank');
    } else {
      this.toastService.error('Error accessing risk assessment.'); // [i18n-tobeinternationalized]
    }
  }

  public getTypeTheme(type: DataInventoryType) {
    switch (type) {
      case 'COMPANY_AFFILIATE':
        return 'inverted-green';
      case 'PRIMARY_ENTITY':
        return 'inverted-green';
      case 'IT_SYSTEM':
        return 'inverted-blue';
      case 'VENDOR':
        return 'inverted-orange';
      case 'PARTNER':
        return 'inverted-orange';
      case 'CUSTOMER':
        return 'inverted-orange';
      case 'SERVICE_PROVIDER':
        return 'inverted-orange';
      case 'BUSINESS_ASSOCIATE':
        return 'inverted-orange';
      case 'OTHER':
        return 'inverted-blue';
      default:
        return 'inverted-blue';
    }
  }

  public getType(type: DataInventoryType) {
    return type.replace('_', ' ');
  }

  public getRiskEnabled() {
    if (this.riskStatus && this.riskStatus.riskService) {
      return this.riskStatus.riskProfile;
    } else {
      return this.isRiskEnabled;
    }
  }

  public isOldSRiskIndicatorEnabled() {
    return (
      this.getRiskEnabled() &&
      (!this.riskStatus || !this.riskStatus.riskService)
    );
  }

  public isTrafficLightEnabled() {
    return (
      this.getRiskEnabled() && this.riskStatus && this.riskStatus.riskService
    );
  }

  public isRiskColumnVisible(item) {
    if (
      item.entityType === 'IT_SYSTEM' ||
      item.entityType === ThirdPartyType.COMPANY_AFFILIATE ||
      item.entityType === ThirdPartyType.PRIMARY_ENTITY
    ) {
      return this.riskStatus && this.riskStatus.riskService;
    } else {
      if (
        item.entityType === ThirdPartyType.VENDOR ||
        item.entityType === ThirdPartyType.SERVICE_PROVIDER ||
        item.entityType === ThirdPartyType.PARTNER
      ) {
        return (
          this.riskStatus &&
          this.riskStatus.riskService &&
          this.riskStatus.riskProfileThirdParty
        );
      } else {
        return false;
      }
    }
  }

  public getRisk(record) {
    return defaultTo('--', record.riskLevel);
  }

  public isRiskPopoverDisabled(record) {
    if (this.riskStatus && this.riskStatus.riskService) {
      if (
        record.entityType === ThirdPartyType.VENDOR ||
        record.entityType === ThirdPartyType.SERVICE_PROVIDER ||
        record.entityType === ThirdPartyType.PARTNER
      ) {
        return !this.riskStatus.riskProfileThirdParty;
      } else {
        return record.algorithmRiskIndicator === 'INCOMPLETE_FIELDS';
      }
    }
    return record.riskLevel === 'INCOMPLETE_FIELDS';
  }

  public showReviewAndActionPopup(entityType) {
    const disableOptionFor = ['BUSINESS_ASSOCIATE', 'CUSTOMER'];
    const existInDisabled = disableOptionFor.find(item => item === entityType);
    return existInDisabled ? false : true;
  }

  public exists(value: any): boolean {
    return exists(value);
  }

  public getTooltip(isRules: boolean): string {
    return isRules ? 'Rules Fields Complete' : 'Rules Fields Incomplete'; // [i18n-tobeinternationalized]
  }

  public showBusinessProcess(bp: any) {
    this.router.navigate([`/business-process/${bp.id}`]);
  }

  public checkServerAndNavigate(url: string, type: string) {
    this.loadAPI().subscribe(
      response => {
        this.router.navigate([url], {
          queryParams: { action: 'Add' }
        });
      },
      error => this.toastService.error(`Error creating a new ${type}.`) // [i18n-tobeinternationalized]
    );
  }

  public newThirdParty() {
    const url = `/data-inventory/my-inventory/third-party/new`;
    this.checkServerAndNavigate(url, 'Third Party');
  }

  public newITSystem() {
    const url = `/data-inventory/my-inventory/it-system/new`;
    this.checkServerAndNavigate(url, 'System');
  }

  public newCompanyAffiliate() {
    const url = `/data-inventory/my-inventory/company-affiliate/new`;
    this.checkServerAndNavigate(url, 'Company Affiliate');
  }

  public newPrimaryEntity(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (this.hasPrimaryEntity) {
      return;
    }

    if (exists(this.elpisUrl)) {
      window.open(this.elpisUrl, '_blank');
    } else {
      // [i18n-tobeinternationalized]
      this.toastService.error(
        'Error redirecting to Edit Full Company Profile page'
      );
    }
  }

  public importData() {
    this.modalService.open(ImportDataComponent);
  }

  public cloneRecord(rec) {
    const modalRef = this.modalService.open(CloneRecordInventoryModalComponent);

    modalRef.componentInstance.record = rec;
    modalRef.result.then(
      ({ inputs, record }) => {
        const body = {
          copyAttachments: inputs.allAttachments,
          copyTags: inputs.allTags,
          name: inputs.businessProcessName
        };

        let source;
        switch (record.entityType) {
          case 'COMPANY_AFFILIATE':
            source = this.companyAffiliateService.clone(record.id, body);
            break;
          case 'CUSTOMER':
          case 'PARTNER':
          case 'THIRD_PARTY':
          case 'VENDOR':
          case 'SERVICE_PROVIDER':
          case 'BUSINESS_ASSOCIATE':
            source = this.thirdPartyService.clone(record.id, body);
            break;
          case 'IT_SYSTEM':
            source = this.itSystemService.clone(record.id, body);
            break;
        }

        source.subscribe(
          data => {
            _.delay(() => this.renderData(), 1000);
          },
          err => {
            console.error(err);
          }
        );
      },
      reason => {
        // Cancel modal
      }
    );
  }

  public totalSelectedItems() {
    return this.currentPageSelectedItems.length;
  }

  public onEditItem(item) {
    const entityTypeToUrlPathMapping = {
      PRIMARY_ENTITY: 'primary-company',
      COMPANY_AFFILIATE: 'company-affiliate',
      VENDOR: 'third-party',
      PARTNER: 'third-party',
      CUSTOMER: 'third-party',
      SERVICE_PROVIDER: 'third-party',
      BUSINESS_ASSOCIATE: 'third-party',
      OTHER: 'third-party',
      IT_SYSTEM: 'it-system',
      BUSINESS_PROCESS: null
    };

    const entityUrlPath = entityTypeToUrlPathMapping[item.entityType];
    if (exists(entityUrlPath)) {
      this.router.navigate(
        [`/data-inventory/my-inventory/${entityUrlPath}/${item.id}`],
        { queryParams: { action: 'Edit' } }
      );
    } else {
      console.warn('Unexpected entity type for selected item:', item);
    }
  }

  public edit() {
    if (this.totalSelectedItems() !== 1) {
      this.toastService.warn('Only one item can be edited at once.'); // [i18n-tobeinternationalized]
    } else {
      this.onEditItem(this.currentPageSelectedItems[0]);
    }
  }

  public deleteRecord(record) {
    this.datagridHeaderService.deleteIndividualBp(record);
    this.modalService
      .open(ConfirmDeleteContentComponent, { windowClass: 'modal-white' })
      .result.then(success => {})
      .catch(closed => {});
  }

  public delete() {
    this.datatableService.setCurrentGridId(this.gridID);
    const modalRef = this.modalService.open(ConfirmDeleteContentComponent, {
      windowClass: 'modal-white'
    });
    modalRef.componentInstance.items = this.currentPageSelectedItems;
    modalRef.componentInstance.gridId = this.gridID;

    modalRef.result.then(success => {
      this.tableService.clearAllSelected(this.gridID);
    }, noop);
  }

  private updateDeleteBtnDisabled() {
    if (this.currentPageSelectedItems.length === 0) {
      this.deleteBtnDisabled = true;
    } else if (
      this.currentPageSelectedItems.length === 1 &&
      this.currentPageSelectedItems[0].entityType === 'PRIMARY_ENTITY'
    ) {
      // check primary entity
      this.deleteBtnDisabled = true;
    } else {
      this.deleteBtnDisabled = false;
    }
  }

  public getRecordTypeLabel(type: DataInventoryType, customLabel: string) {
    switch (type) {
      case 'COMPANY_AFFILIATE':
        return DATA_INVENTORY_LABELS.COMPANY_AFFILIATE;
      case 'PRIMARY_ENTITY':
        return DATA_INVENTORY_LABELS.PRIMARY_ENTITY;
      case 'IT_SYSTEM':
        return DATA_INVENTORY_LABELS.IT_SYSTEM;
      case 'VENDOR':
        return DATA_INVENTORY_LABELS.VENDOR;
      case 'PARTNER':
        return DATA_INVENTORY_LABELS.PARTNER;
      case 'CUSTOMER':
        return DATA_INVENTORY_LABELS.CUSTOMER;
      case 'SERVICE_PROVIDER':
        return DATA_INVENTORY_LABELS.SERVICE_PROVIDER;
      case 'BUSINESS_ASSOCIATE':
        return DATA_INVENTORY_LABELS.BUSINESS_ASSOCIATE;
      case 'OTHER':
        return customLabel || 'Other';
      default:
        return '--';
    }
  }

  public openImportModal() {
    this.modalService.open(ImportDataComponent);
  }

  public updateDownloadSelectedBtnDisabled() {
    if (this.selectedItems && this.selectedItems.length > 0) {
      this.downloadSelectedBtnDisabled = false;
    } else {
      this.downloadSelectedBtnDisabled = true;
    }
  }

  private successfulExportToastMessage() {
    if (this.userEmail) {
      this.toastService.success(
        `Export complete! The export file has been sent to ${this.userEmail}`
      );
    } else {
      this.toastService.success(
        'Export complete! The export file has been sent to your email.'
      );
    }
  }

  public downloadAll() {
    this.exportService.exportAll().subscribe(
      response => {
        this.successfulExportToastMessage();
      },
      error => {
        const errorMessage = this.getExportErrorMessage(this.tableData.length);
        this.toastService.error(errorMessage);
      }
    );
  }

  public downloadSelected() {
    this.exportService.exportSelected(this.selectedItems).subscribe(
      response => {
        this.successfulExportToastMessage();
      },
      error => {
        const errorMessage = this.getExportErrorMessage(
          this.selectedItems ? this.selectedItems.length : 0
        );
        this.toastService.error(errorMessage);
      }
    );
  }

  private getExportErrorMessage(exportsAttempted: number) {
    const isPlural = exportsAttempted > 1;
    // [i18n-tobeinternationalized]
    return isPlural
      ? 'There was an error exporting the requested records'
      : 'There was an error exporting the requested record';
  }

  public triggerRiskPopover(popover, entityType) {
    // Close other popovers
    this.popovers.forEach(pop => pop.close());

    // Do nothing if no popover required
    if (this.NO_REVIEW_RISK_ITEMS.includes(entityType)) {
      return;
    }

    if (this.showReviewAndActionPopup(entityType)) {
      popover.open();
    }
  }

  public applyFilters(filterData) {
    this.customFilters = filterData;
    this.page = 1;
    this.updateIsFilterDirty();
    this.renderData();
  }

  public updateIsFilterDirty() {
    this.isFilterDirty = false;
    this.checkForSelection(this.customFilters.filters);
  }

  public checkForSelection(filters) {
    if (!filters || _.isEmpty(filters)) {
      return;
    }
    Object.keys(filters).forEach(key => {
      const hasValue: boolean = filters[key].value && filters[key].value.length;
      const hasNestedFilters: boolean = !_.isEmpty(
        filters[key].nestedFilterValue
      );
      // once isFilterDirty is true it should stay true
      this.isFilterDirty = this.isFilterDirty || hasValue;
      // if filter is durty there is no deed to check all nested filters
      if (!this.isFilterDirty && hasNestedFilters) {
        this.checkForSelection(hasNestedFilters);
      }
    });
  }

  private initCachedFilter() {
    this._cacheFilters$ = this.customFiltersService
      .getCachedFilters()
      .subscribe(cachedFilter => {
        if (
          cachedFilter &&
          cachedFilter.INV_ALL &&
          cachedFilter.INV_ALL.filters
        ) {
          this.customFilters = cachedFilter.INV_ALL;
          this.updateIsFilterDirty();
        }
      });
  }

  public updateFilterValue(value) {
    // [i18n-tobeinternationalized]
    this.filterValue = value ? `Filters (${value})` : 'Filters';
  }

  public getSearchPlaceholder() {
    // [i18n-tobeinternationalized]
    return 'Enter to search...';
  }

  public initColumnConfiguration() {
    const cachedConfig = this.datatableService.getTableConfigByType(
      'columns-inventory'
    );
    if (cachedConfig) {
      return this.initColumnConfigForm(cachedConfig.columns);
    }

    if (this._pageConfig$) {
      this._pageConfig$.unsubscribe();
    }
    this._pageConfig$ = this.pageConfigControllerService
      .getColumnConfig(MainListTypesEnum.InventoryList)
      .subscribe(
        res => {
          return this.initColumnConfigForm(res.columnConfig);
        },
        err => console.error(err)
      );
  }

  public initColumnConfigForm(value) {
    // Build columns config form
    value.forEach(col => {
      this.columns.push(
        this.formBuilder.group({
          columnName: col.columnName,
          columnAlias: col.columnAlias,
          selectable: col.selectable,
          selected: col.selected
        })
      );
    });

    // Disable unselectable form control
    this.columns.controls.forEach(control => {
      if (control.get('selectable').value === false) {
        control.disable();
      }
    });

    // Store value in service for caching
    const rawValue = this.columnsConfigForm.getRawValue();
    this.datatableService.setTableConfigByType('columns-inventory', rawValue);

    // Get checked columns
    this.columnsChecked = this.columns
      .getRawValue()
      .filter(item => item.selected === true);

    // Subscribe to changes
    this.columnsConfigForm.valueChanges.subscribe(() => {
      // Clone the current data
      const cloneData = _.cloneDeep(this.tableData);

      // This will empty the current data in the table for immutable purpose
      this.tableData = [];

      // Get updated checked columns
      this.columnsChecked = this.columns
        .getRawValue()
        .filter(item => item.selected === true);

      // Store in service for caching
      this.datatableService.setTableConfigByType(
        'columns-inventory',
        this.columnsConfigForm.getRawValue()
      );

      this.currentColumnLength = this.columnsChecked.length + 1;
      this.datatableService.setTableCurrentColumn = this.currentColumnLength;

      // Apply new data
      this.tableData = cloneData;
    });
  }

  public saveConfigAsDefault() {
    this.pageConfigControllerService
      .updateColumnConfig(MainListTypesEnum.InventoryList, {
        columnConfig: this.columnsChecked
      })
      .subscribe(noop, err => console.error(err));
  }

  public determineColumnVisibilityByAlias(alias: string) {
    const found = this.columnsChecked.find(item => item.columnAlias === alias);
    return found ? found.selected : false;
  }

  public setColumnForSkeletonLoader() {
    const column = Array.from(
      document.querySelectorAll('ta-table ta-table-column') || []
    ).length;

    this.currentColumnLength = column || 0;
    this.datatableService.setTableCurrentColumn = this.currentColumnLength;
  }

  public checkHasPrimaryEntity() {
    if (this._hasPrimaryEntity$) {
      this._hasPrimaryEntity$.unsubscribe();
    }

    this._hasPrimaryEntity$ = this.primaryEntityService
      .hasPrimaryEntity()
      .subscribe(
        res => {
          this.elpisUrl = res.companyProfileEditUrl;
          this.hasPrimaryEntity = res.primaryEntityExists;
        },
        err => {
          console.log(err);
        }
      );
  }
}
