import {
  AfterContentChecked,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {
  FilterNonLeafNode,
  RecordRequestInterface
} from 'src/app/shared/models/filter-model';
import { MainListTypesEnum } from 'src/app/shared/_enums';
import { forkJoin, noop, of, Subject, Subscription } from 'rxjs';
import {
  BusinessProcessOverviewInterface,
  ColumnConfigInterface,
  FeatureFlagAllInterface
} from 'src/app/shared/_interfaces/rest-api';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import {
  BusinessProcessControllerService,
  FeatureFlagControllerService,
  SearchControllerService
} from 'src/app/shared/_services/rest-api';
import { PageConfigControllerService } from 'src/app/shared/_services/rest-api/page-config-controller/page-config-controller.service';
import { DatatableService } from 'src/app/shared/services/record-listing/datatable.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { RecordListingService } from 'src/app/shared/services/record-listing/record-listing.service';
import {
  TableService,
  TaDropdown,
  TaModal,
  TaPopover,
  TaTableRequest,
  ToastService
} from '@trustarc/ui-toolkit';
import { RISK_TYPE } from 'src/app/shared/components/traffic-risk-indicator/traffic-risk-indicator.model';
import {
  DownloadReportEvent,
  RISK_PROFILE_URL,
  STATUS_BUSINESS_PROCESS_LIST_PAGE
} from 'src/app/app.constants';
import { ClientApp } from 'src/app/shared/components/header/header.model';
// tslint:disable-next-line:max-line-length
import { ModalRevalidationDateEditComponent } from 'src/app/business-processes/business-process-wizard/shared/components/modals/modal-revalidation-date-edit/modal-revalidation-date-edit.component';
import { ReportDownloadType } from 'src/app/shared/services/report-download/report-download.constant';
import { ReportDownloadService } from 'src/app/shared/services/report-download/report-download.service';
import {
  defaultTo,
  downloadReturnedFile,
  exists
} from 'src/app/shared/utils/basic-utils';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { ExportService } from 'src/app/shared/services/export/export.service';
import { Router } from '@angular/router';
import { CloneRecordModalComponent } from 'src/app/shared/components/record-datagrid/clone-record-modal/clone-record-modal.component';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ModalConfirmationBasicComponent } from 'src/app/business-processes/business-process-wizard/shared';
import { BaseRecordService } from 'src/app/shared/services/base-record/base-record.service';
import { BusinessProcessService } from 'src/app/shared/services/business-process/business-process.service';
import { TagsSelectorService } from 'src/app/shared/components/tags-selector/tags-selector.service';
import { BaseRecord } from 'src/app/shared/_interfaces/rest-api/search-controller/search-controller';
import { UserService } from 'src/app/shared/services/user/user.service';
import { ModalReportDownloadComponent } from 'src/app/shared/components/modals/modal-report-download/modal-report-download.component';
import {
  MultiDocumentFileRequest,
  ReportDownloadDataFlowOptions
} from 'src/app/shared/services/report-download/report-download.model';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  map,
  mergeMap
} from 'rxjs/operators';
import { RecordType } from 'src/app/shared/services/record-listing/record-listing.model';
import { HeaderService } from 'src/app/shared/components/header/header.service';
// tslint:disable-next-line:max-line-length
import { BusinessProcessDataTransfersInterface } from '../../../../../projects/rhea-ui-library/src/lib/components/data-flow-chart/data-flow-chart.model';
import { InlineBpNameEditorComponent } from 'src/app/shared/components/inline-bp-name-editor/inline-bp-name-editor.component';
import { InlineOwnerEditorComponent } from 'src/app/shared/components/inline-owner-editor/inline-owner-editor.component';

declare const _: any;

@AutoUnsubscribe([
  '_featureFlags$',
  '_pageConfig$',
  '_getSearchBp$',
  '_eventSelectedRef$',
  '_riskEnabled$',
  '_checkAssessmentEnabled$',
  '_getTagsData$',
  '_getOverview$',
  '_updateOverview$',
  '_keyUp$'
])
@Component({
  selector: 'ta-business-processes-list',
  templateUrl: './business-processes-list.component.html',
  styleUrls: ['./business-processes-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BusinessProcessesListComponent
  implements OnInit, OnDestroy, AfterContentChecked {
  @Input() public gridId: string;
  @Input() public recordType: RecordType;
  @Input() public emptyCTAText: string;
  @Output() public emptyCTAClick: EventEmitter<any>;

  // Popovers and Dropdowns
  @ViewChildren(TaPopover) popover: QueryList<TaPopover>;
  @ViewChildren(TaDropdown) multiDropdown: QueryList<TaDropdown>;
  @ViewChildren('inlineEditorBpName') inlineEditorBpName: QueryList<
    InlineBpNameEditorComponent
  >;
  @ViewChildren('inlineEditorOwners') inlineEditorOwners: QueryList<
    InlineOwnerEditorComponent
  >;

  // Grid data
  public gridData: BaseRecord[] = [];
  private tableRequest: TaTableRequest = {};
  public currentPageSelectedItems: any[] = [];

  // Pagination
  public page = 1;
  public pageSize = 25;
  public search = '';
  public totalElements = 0;

  // Search/Counters
  public selectedCounterString = '';
  public keyUp = new Subject<KeyboardEvent>();
  // [i18n-tobeinternationalized]
  @Input() public searchPlaceholder = 'Search record name, ID or contact';

  // Licenses
  public licenses: FeatureFlagAllInterface = {};
  public oldRiskIndicatorEnabled = false;
  public isInternalAdmin = false;

  // Risk indicators
  public riskStatus = null;
  public isRiskEnabled = false;
  public visibilityByLicense: {
    showDataTransfer: boolean;
    showRiskProfile: boolean;
  };

  // Subscriptions
  private _initDataFetch$: Subscription;
  private _getSearchBp$: Subscription;
  private _eventSelectedRef$: Subscription = null;
  private _eventRequestRef$: Subscription = null;
  private _riskEnabled$: Subscription = null;
  private _checkAssessmentEnabled$: Subscription = null;
  private _getTagsData$: Subscription = null;
  private _getOverview$: Subscription = null;
  private _updateOverview$: Subscription = null;
  private _keyUp$: Subscription = null;

  // Loading indicators
  public initFetched = false;
  public isSaving = false;
  public isFetching = false;
  public renderSkeleton = false;

  // Column configuration
  public currentColumnLength: number;
  public columnsChecked: ColumnConfigInterface[];
  public columnsConfigForm: FormGroup = this.formBuilder.group({
    columns: this.formBuilder.array([])
  });
  public visibilityBySettings = {
    BP_DATA_TRANSFER: false,
    BP_RISK: false,
    BP_OWNER_NAME: false,
    BP_TAG: false,
    BP_LAST_UPDATED: false,
    BP_REVALIDATION_DATE: false,
    BP_STATUS: false
  };
  public get columns(): FormArray {
    return this.columnsConfigForm.get('columns') as FormArray;
  }

  // Filters
  public customFilters = null;
  public isFilterDirty = false;
  public filterValue = '';
  public filterPlaceholder = 'Filters'; // [i18n-tobeinternationalized]
  public defaultFilters = [
    'Status', // [i18n-tobeinternationalized]
    'Tag', // [i18n-tobeinternationalized]
    `Owner's Name`, // [i18n-tobeinternationalized]
    'Data Subject', // [i18n-tobeinternationalized]
    'Data Element' // [i18n-tobeinternationalized]
  ];
  public businessProcessFilters: FilterNonLeafNode = {
    operand: 'AND',
    filters: [
      {
        fieldName: 'recordType',
        values: ['BusinessProcess']
      }
    ]
  };

  // Tags
  public allTags: any[] = [];
  public userTags: any[] = [];

  // Business process Status
  public readonly BP_STATUS_LIST = STATUS_BUSINESS_PROCESS_LIST_PAGE;
  public selectedRecordStatus: string;

  // Business process Overview
  public currentBusinessRecord: BusinessProcessOverviewInterface;

  // Other Apps
  private clioAppDetails: ClientApp;

  // Download reports
  public readonly ReportDownloadType = ReportDownloadType;
  public readonly DOWNLOAD_REPORT_RETRIES_DELAY_MS = 3000;
  public readonly DOWNLOAD_REPORT_RETRIES_COUNT_MAX = 10;
  private downloadReportIsInProcess = false;
  private downloadReportRetriesCount = 0;

  // Assessment
  public assessmentEnabled = false;

  // Delete buttons
  public deleteBtnDisabled = true;

  constructor(
    private featureFlagControllerService: FeatureFlagControllerService,
    private pageConfigControllerService: PageConfigControllerService,
    private baseRecordService: BaseRecordService,
    private businessProcessControllerService: BusinessProcessControllerService,
    private businessProcessService: BusinessProcessService,
    private tagsSelectorService: TagsSelectorService,
    private datatableService: DatatableService,
    private formBuilder: FormBuilder,
    private recordListingService: RecordListingService,
    private searchControllerService: SearchControllerService,
    private toastService: ToastService,
    private modalService: TaModal,
    private headerService: HeaderService,
    private reportDownloadService: ReportDownloadService,
    private notificationService: NotificationService,
    private exportService: ExportService,
    private router: Router,
    private authService: AuthService,
    private tableService: TableService,
    private userService: UserService
  ) {
    this.emptyCTAClick = new EventEmitter();
  }

  ngOnInit() {
    this.initData();
    this.initSubscriptions();
    this.checkAssessmentEnabled();
    this.getClioAppDetails();
  }

  public ngAfterContentChecked(): void {
    this.isInternalAdmin = this.authService.isInternalAdmin();
  }

  public initData() {
    if (this._initDataFetch$) {
      this._initDataFetch$.unsubscribe();
    }

    const request = this.buildRequest();

    this.isFetching = true;
    this._initDataFetch$ = forkJoin([
      this.featureFlagControllerService.getAllFeatureFlags(),
      this.searchControllerService.baseRecordsFilters(request),
      this.pageConfigControllerService.getColumnConfig(
        MainListTypesEnum.BusinessProcessList
      )
    ]).subscribe(
      ([featureFlags, gridData, columnConfig]) => {
        this.initFetched = true;
        this.isFetching = false;

        this.handleLicenseData(featureFlags);
        this.handleGridData(gridData);
        this.handleColumnConfig(columnConfig);
        this.getTagsData();
      },
      err => {
        this.isFetching = false;
        console.error('Error fetching data', err);
      }
    );

    this.selectedCounterString = this.getSelectedCounterString();
  }

  public initSubscriptions() {
    this._eventSelectedRef$ = this.tableService
      .listenPageSelectedItemsEvents(this.gridId)
      .subscribe((items: any[]) => {
        this.currentPageSelectedItems = items;
        this.selectedCounterString = this.getSelectedCounterString();
        this.updateDeleteBtnDisabled();
      });

    this._eventRequestRef$ = this.tableService
      .listenRequestEvents(this.gridId)
      .subscribe(event => {
        this.tableRequest.columnSort = event.columnSort;
        this.tableRequest.sortType = event.sortType;
        this.renderSkeleton = true;
        this.renderData();
      });

    this._riskEnabled$ = this.datatableService.riskEnabled$.subscribe(
      status => {
        this.isRiskEnabled = !status ? false : status;
        this.datatableService.riskService$.subscribe(riskStatus => {
          this.riskStatus = riskStatus;
          this.isOldRiskIndicatorEnabled();
          this.getRiskEnabled();
        });
      }
    );

    this._keyUp$ = this.keyUp
      .pipe(
        map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
        debounceTime(150),
        distinctUntilChanged(),
        mergeMap(search => of(search).pipe(delay(200)))
      )
      .subscribe(res => this.onSearch(res));
  }

  //#region Feature Flags

  private handleLicenseData(featureFlags) {
    this.licenses = featureFlags;
    this.determineVisibilityByLicense();
    if (
      this.licenses.RISK_PROFILE_LICENSE === true &&
      this.licenses.RISK_PROFILE_THIRD_PARTY_LICENSE === true &&
      this.licenses.RISK_SERVICE_V2 === true
    ) {
      this.defaultFilters.push('Risk Indicator');
    }
  }

  public determineVisibilityByLicense() {
    const { RISK_PROFILE_LICENSE, PRIVACY_SHIELD } = this.licenses;
    this.visibilityByLicense = {
      showDataTransfer: PRIVACY_SHIELD === true,
      showRiskProfile: RISK_PROFILE_LICENSE === true
    };
  }

  //#endregion Feature Flags

  //#region Column Configuration

  public handleColumnConfig(config) {
    const cachedConfig = this.datatableService.getTableConfigByType(
      'columns-bp'
    );
    if (cachedConfig) {
      return this.initColumnConfigForm(cachedConfig.columns);
    }

    this.initColumnConfigForm(config.columnConfig);
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
    this.datatableService.setTableConfigByType('columns-bp', rawValue);

    // Get checked columns
    this.columnsChecked = this.columns
      .getRawValue()
      .filter(item => item.selected === true);

    this.currentColumnLength = this.columnsChecked.length + 1;

    // Map column visibility settings
    this.mapVisibleColumns(rawValue.columns);

    // Subscribe to changes
    this.columnsConfigForm.valueChanges.subscribe(() => {
      // Clone the current data
      const cloneData = _.cloneDeep(this.gridData);

      // This will empty the current data in the table for immutable purpose
      this.gridData = [];

      // Get updated checked columns
      const updated = this.columns.getRawValue();
      this.mapVisibleColumns(updated);
      this.columnsChecked = updated.filter(item => item.selected === true);

      // Store in service for caching
      this.datatableService.setTableConfigByType(
        'columns-bp',
        this.columnsConfigForm.getRawValue()
      );

      this.currentColumnLength = this.columnsChecked.length + 1;
      this.datatableService.setTableCurrentColumn = this.currentColumnLength;

      // Apply new data
      this.gridData = cloneData;
    });
  }

  public mapVisibleColumns(columns) {
    columns.forEach(col => {
      const { columnAlias, selected, selectable } = col;

      if (selectable) {
        this.visibilityBySettings[columnAlias] = selected;
      }
    });
  }

  public saveConfigAsDefault() {
    this.pageConfigControllerService
      .updateColumnConfig(MainListTypesEnum.BusinessProcessList, {
        columnConfig: this.columnsChecked
      })
      .subscribe(noop, err => console.error(err));
  }

  //#endregion Column Configuration

  //#region Fetching grid data

  public handleGridData(data) {
    this.gridData = data.content;
    this.totalElements = data.totalElements;
  }

  public renderData() {
    if (this._getSearchBp$) {
      this._getSearchBp$.unsubscribe();
    }

    const request = this.buildRequest();

    this.isFetching = true;
    this._getSearchBp$ = this.searchControllerService
      .baseRecordsFilters(request)
      .subscribe(
        res => {
          this.handleGridData(res);
          this.isFetching = false;
          this.renderSkeleton = false;
          this.attachFlattenTags();
        },
        err => {
          this.isFetching = false;
          this.renderSkeleton = false;
          console.error(err);
        }
      );
  }

  public buildRequest() {
    const request: RecordRequestInterface = {};
    const sortDirection = (this.tableRequest.sortType || 'desc').toUpperCase();
    request.page = this.page - 1;
    request.search = this.search;
    request.size = this.pageSize;
    request.sortDirection = sortDirection;
    request.sortField = this.tableRequest.columnSort || 'lastModified';
    request.filters = this.businessProcessFilters;

    request.customFilters =
      this.customFilters && this.customFilters.filters
        ? this.customFilters.filters
        : {};

    return request;
  }

  //#endregion Fetching grid data

  //#region Business process Name

  public formatRecordType(recordType) {
    return defaultTo('', recordType.replace(/([A-Z])/g, ' $1').toLowerCase());
  }

  public handleNameUpdated(event: string, item: BaseRecord) {
    this.currentBusinessRecord.name = event;
    this.updateOverview(item);
  }

  public handleOpenDropdownBpName(dropdown: TaDropdown) {
    this.inlineEditorBpName.forEach(editor => editor.closeEditingDropdown());
    dropdown.open();
  }

  //#endregion Business process Name

  //#region Risk management

  public getClioAppDetails() {
    this.clioAppDetails = this.headerService.getClientApp('clio-client');
  }

  public onRiskItem(record) {
    const { algorithmRiskIndicator } = record;

    if (algorithmRiskIndicator !== RISK_TYPE.INCOMPLETE_FIELDS) {
      if (this.clioAppDetails) {
        const riskProfileUrl =
          this.riskStatus && this.riskStatus.riskService
            ? RISK_PROFILE_URL.VERSION_2
            : RISK_PROFILE_URL.VERSION_1;

        const url = `${this.clioAppDetails.url}${riskProfileUrl}${record.id}`;
        window.open(url, '_blank');
      } else {
        // [i18n-tobeinternationalized]
        this.toastService.error('Error accessing risk assessment.');
      }
    }
  }

  public isRiskIncomplete(record) {
    if (this.riskStatus && this.riskStatus.riskService) {
      return record.algorithmRiskIndicator === 'INCOMPLETE_FIELDS';
    } else {
      return record.riskLevel === 'INCOMPLETE_FIELDS';
    }
  }

  public triggerRiskPopover(popover) {
    this.closePopovers();
    this.closeDropdowns();
    popover.open();
  }

  public isOldRiskIndicatorEnabled() {
    const oldRisk =
      this.isRiskEnabled && (!this.riskStatus || !this.riskStatus.riskService);

    this.oldRiskIndicatorEnabled = !(oldRisk === null || oldRisk === false);
  }

  public getRiskEnabled() {
    if (this.riskStatus && this.riskStatus.riskService) {
      this.isRiskEnabled = this.riskStatus.riskProfile;
    }
  }

  //#endregion Risk management

  //#region Owners management

  public ownersNamedUpdated() {
    this.renderSkeleton = true;
    this.renderData();
  }

  public handleOpenDropdownOwnerNames(dropdown: TaDropdown) {
    this.inlineEditorOwners.forEach(editor => editor.closeEditingDropdown());
    dropdown.open();
  }

  //#endregion Owners management

  //#region Revalidation date management

  public handleRevalidationEdit(event, record) {
    event.stopPropagation();

    const modalRef = this.modalService.open(
      ModalRevalidationDateEditComponent,
      {
        windowClass: 'ta-modal-revalidation-date-edit',
        backdrop: 'static',
        keyboard: true,
        size: 'md'
      }
    );

    const { ALERT_NOTIFICATION = false } = this.licenses;
    modalRef.componentInstance.baseRecordId = record.id;
    modalRef.componentInstance.alertsEnabled = ALERT_NOTIFICATION === true;

    modalRef.result.then(
      result => {
        record.revalidationDate = new Date(result.date);

        // This is to force detecting changes
        this.gridData = [...this.gridData];

        // [i18n-tobeinternationalized]
        this.toastService.success('Successfully updated revalidation date');
      },
      reason => {}
    );
  }

  //#endregion Revalidation date management

  //#region Download report management

  public checkDataFlowAndDownloadMultiReport(
    type: ReportDownloadType,
    singleItem
  ): void {
    const entities = (singleItem
      ? [singleItem]
      : this.currentPageSelectedItems) as BaseRecord[];
    this.businessProcessService
      .getContainsDataTransfers(entities.map(entity => entity.id))
      .subscribe(
        (bpDataTransfers: BusinessProcessDataTransfersInterface[]) => {
          if (bpDataTransfers.find(bpDt => bpDt.dataTransfers)) {
            this.downloadMultiReportThroughDataFlowModal(type, singleItem);
          } else {
            // without pop-up
            this.checkReportsDownloadInProgressAndDoDownload(
              type,
              singleItem,
              false,
              false
            );
          }
        },
        err => {
          this.toastService.error('Error checking DataFlow data.');
        }
      );
  }

  private downloadMultiReportThroughDataFlowModal(
    type: ReportDownloadType,
    singleItem
  ): void {
    const modalRef = this.modalService.open(ModalReportDownloadComponent, {
      windowClass: 'ta-modal-report-download',
      backdrop: 'static',
      keyboard: true,
      size: 'sm'
    });

    modalRef.componentInstance.reportName = this.getReportNameByType(type);

    modalRef.result.then(noop, reason => {
      // Modal is dismissed through 'Run Report' btn
      if (reason) {
        const options = reason as ReportDownloadDataFlowOptions;

        this.checkReportsDownloadInProgressAndDoDownload(
          type,
          singleItem,
          options.includeDataFlowChart,
          options.includeGlobalMap
        );
      }
    });
  }

  private checkReportsDownloadInProgressAndDoDownload(
    type: ReportDownloadType,
    singleItem,
    includeDataFlowChart: boolean,
    includeGlobalMap: boolean
  ): void {
    /**
     * Allow to initiate only one download process at the time
     */
    if (this.downloadReportIsInProcess) {
      // [i18n-tobeinternationalized]
      this.toastService.warn(`Report download is in progress`);
    } else {
      const items = singleItem ? [singleItem] : this.currentPageSelectedItems;
      const multiDocumentFileRequest: MultiDocumentFileRequest = {
        entityIds: items.map(item => item.id),
        reportType: type,
        includeDataFlowChart: includeDataFlowChart,
        includeGlobalMap: includeGlobalMap
      };

      this.doDownloadMultiReport(multiDocumentFileRequest);
    }
  }

  public doDownloadMultiReport(
    multiDocumentFileRequest: MultiDocumentFileRequest
  ): void {
    this.showDownloadReportProgressBar();
    this.downloadReportRetriesCount = 0;
    this.reportDownloadService
      .downloadMultiReport(multiDocumentFileRequest)
      .subscribe(
        res => {
          this.resetDownloadReportRetries();

          const blob = new Blob([res], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        },
        err => {
          if (err.status === 404) {
            return this.handleReportNotFoundWithRetries(
              multiDocumentFileRequest
            );
          }

          this.resetDownloadReportRetries();
          const reportName = this.getReportNameByType(
            multiDocumentFileRequest.reportType
          );

          const message = this.getErrorMessageDownloading(
            reportName,
            multiDocumentFileRequest.entityIds
          );
          this.toastService.error(message);
        }
      );
  }

  private handleReportNotFoundWithRetries(
    multiDocumentFileRequest: MultiDocumentFileRequest
  ): void {
    if (
      this.downloadReportRetriesCount <= this.DOWNLOAD_REPORT_RETRIES_COUNT_MAX
    ) {
      this.delayedDownloadMultiReport(multiDocumentFileRequest);
    } else {
      this.resetDownloadReportRetries();
      // [i18n-tobeinternationalized]
      this.toastService.error('Report cannot be found');
    }
  }

  private showDownloadReportProgressBar(): void {
    this.downloadReportIsInProcess = true;
    this.notificationService.emit({
      action: DownloadReportEvent.Start
    });
  }

  public delayedDownloadMultiReport(
    multiDocumentFileRequest: MultiDocumentFileRequest
  ): void {
    this.downloadReportRetriesCount++;

    setTimeout(() => {
      this.doDownloadMultiReport(multiDocumentFileRequest);
    }, this.DOWNLOAD_REPORT_RETRIES_DELAY_MS);
  }

  private resetDownloadReportRetries(): void {
    this.downloadReportIsInProcess = false;
    this.downloadReportRetriesCount = 0;
    this.notificationService.emit({
      action: DownloadReportEvent.End
    });
  }

  public downloadSelected() {
    this.exportService.exportSelected(this.currentPageSelectedItems).subscribe(
      res => {
        downloadReturnedFile(res);
      },
      err => {
        console.error(err);
        const errorMessage = this.getErrorMessageExport(
          this.currentPageSelectedItems
            ? this.currentPageSelectedItems.length
            : 0
        );
        this.toastService.error(errorMessage);
      }
    );
  }

  private getReportNameByType(type) {
    // [i18n-tobeinternationalized]
    return type === ReportDownloadType.BpSummary
      ? 'Business Process Summary'
      : 'Article 30';
  }

  private getErrorMessageDownloading(name, entityIds) {
    // [i18n-tobeinternationalized]
    return `Error downloading ${name} report${entityIds.length > 1 ? 's' : ''}`;
  }

  private getErrorMessageExport(exportsAttempted: number) {
    const isPlural = exportsAttempted > 1;

    // [i18n-tobeinternationalized]
    return isPlural
      ? 'There was an error exporting the requested records'
      : 'There was an error exporting the requested record';
  }

  //#endregion Download report management

  //#region Business process Status

  public updateRecordStatus(item: BaseRecord) {
    this.currentBusinessRecord.status = this.selectedRecordStatus;
    this.updateOverview(item);
  }

  //#endregion Business process Status

  //#region Assessment/Clone/Edit/Delete/Refresh tools

  public onViewItem(record) {
    this.router.navigate([`/business-process/${record.id}/view-bp`]);
  }

  public onAssessItem(record) {
    window.open(record.buildAssessmentUrl, '_blank');
  }

  public onCloneItem(record) {
    const modalRef = this.modalService.open(CloneRecordModalComponent, {
      windowClass: 'modal-white'
    });

    modalRef.componentInstance.record = record;

    modalRef.result.then(form => {
      this.businessProcessService
        .cloneBusinessProcessRecord(form, record)
        .subscribe(
          res => {
            this.renderSkeleton = true;
            this.renderData();
          },
          err => {
            console.error(err);
            this.toastService.error(
              'An error occurred. Unable to clone record: ',
              record.name
            );
          }
        );
    }, noop);
  }

  public onEditItem(record) {
    if (this.licenses.RHEA_NEW_UI_STEPS_12_LICENSE === true) {
      this.router.navigate([`/business-process/${record.id}/details`]);
    } else {
      this.router.navigate([`/business-process/${record.id}/background`]);
    }
  }

  public editRecord() {
    if (this.currentPageSelectedItems.length !== 1) {
      // [i18n-tobeinternationalized]
      return this.toastService.warn('Only one item can be edited at once.');
    }

    const [selected] = this.currentPageSelectedItems;
    this.tableService.clearAllSelected(this.gridId);

    if (this.licenses.RHEA_NEW_UI_STEPS_12_LICENSE === true) {
      return this.router.navigate([`/business-process/${selected.id}/details`]);
    }

    this.router.navigate([`/business-process/${selected.id}/background`]);
  }

  public deleteRecord(record) {
    this.deleteRecords([record]);
  }

  public deleteRecordSelected() {
    this.deleteRecords(this.currentPageSelectedItems);
  }

  public deleteRecords(records = []) {
    const modalRef = this.modalService.open(ModalConfirmationBasicComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'sm'
    });
    // [i18n-tobeinternationalized]
    modalRef.componentInstance.description = 'You cannot undo this action.';
    // [i18n-tobeinternationalized]
    modalRef.componentInstance.btnLabelConfirm = 'Delete';
    modalRef.componentInstance.type = 'delete';
    modalRef.componentInstance.icon = 'delete';

    const { items, message } = this.getDeleteMessageAndItems(records);
    modalRef.componentInstance.items = items;
    modalRef.componentInstance.title = message;

    modalRef.result.then(
      () => {
        this.datatableService.setCurrentGridId(this.gridId);
        modalRef.close('DELETED');

        this.baseRecordService.deleteRecordsByIdList(records).subscribe(
          () => {
            this.tableService.clearAllSelected(this.gridId);
            this.renderSkeleton = true;
            this.renderData();
          },
          err => {
            console.error(err);
            this.renderSkeleton = true;
            this.renderData();
          }
        );
      },
      () => {
        modalRef.close('CANCELED');
      }
    );
  }

  public refreshData() {
    this.renderSkeleton = true;
    this.renderData();
  }

  public getDeleteMessageAndItems(records) {
    let message;
    let items;

    const mapped = records
      .filter(item => exists(item.name))
      .map(item => item.name)
      .sort();

    if (records.length > 1) {
      // [i18n-tobeinternationalized]
      message = `Delete the following Business Processes?`;
      items = mapped;
    }

    if (records.length === 1) {
      // [i18n-tobeinternationalized]
      message = `Delete Business Process ${mapped[0]}?`;
      items = null;
    }

    return { items, message };
  }

  private checkAssessmentEnabled() {
    if (this._checkAssessmentEnabled$) {
      this._checkAssessmentEnabled$.unsubscribe();
    }

    this._checkAssessmentEnabled$ = this.recordListingService
      .getAssessmentEnabled()
      .subscribe(isEnabled => {
        this.assessmentEnabled = isEnabled;
      });
  }

  //#endregion Assessment/Clone/Edit/Delete/Refresh tools

  //#region Table pagination

  public onChangePage(event) {
    this.page = event;
    this.renderSkeleton = true;
    this.renderData();
  }

  public onChangeMaxRows(event) {
    if (this.pageSize !== event) {
      this.page = 1;
      this.pageSize = event;
      this.renderSkeleton = true;
      this.renderData();
    }
  }

  //#endregion Table pagination

  //#region Table Search/Tools

  public onSearch(event) {
    if (event === '' && this.search === '') {
      return;
    }

    this.search = event;
    this.page = 1;
    this.renderSkeleton = true;

    this.renderData();
  }

  private updateDeleteBtnDisabled() {
    this.deleteBtnDisabled = this.currentPageSelectedItems.length === 0;
  }

  private getSelectedCounterString() {
    // [i18n-tobeinternationalized]
    return `${this.currentPageSelectedItems.length} of ${this.totalElements} item(s) selected`;
  }

  //#endregion Table Search/Tools

  //#region Table Filters

  public applyFilters(filterData) {
    this.customFilters = filterData;
    this.page = 1;
    this.updateIsFilterDirty();
    this.renderSkeleton = true;
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

      // Once isFilterDirty is true it should stay true
      this.isFilterDirty = this.isFilterDirty || hasValue;

      // If filter is dirty there is no need to check all nested filters
      if (!this.isFilterDirty && hasNestedFilters) {
        this.checkForSelection(filters[key].nestedFilterValue);
      }
    });
  }

  public updateFilterValue(value) {
    // [i18n-tobeinternationalized]
    this.filterValue = value ? `Filters (${value})` : 'Filters';
  }

  //#endregion Table Filters

  //#region Tags

  public getTagsData() {
    this._getTagsData$ = forkJoin([
      this.tagsSelectorService.getAllTags(0, true),
      this.userService.getUsersResponse('', 0, 1000)
    ]).subscribe(
      ([tags, users]) => {
        this.userTags = this.mapUserTags(users.content);
        this.allTags = this.mapAllTags(tags);

        this.attachFlattenTags();
      },
      err => {
        console.error(err);
      }
    );
  }

  private mapAllTags(tags) {
    return tags.map(tag => {
      if (tag.tagGroupType === 'USER') {
        (tag.values || []).forEach(value => {
          value.parentTagValueId = tag.id;
        });
      }

      return tag;
    });
  }

  private mapUserTags(users) {
    return users
      .map(user => ({
        id: user.id,
        isUserTag: true,
        tag: `${user.name} - ${user.email}`
      }))
      .sort((a, b) => (a.tag.toLowerCase() < b.tag.toLowerCase() ? -1 : 1));
  }

  private attachFlattenTags() {
    this.gridData = this.gridData.map(gridItem => {
      gridItem.flattenedTags = [];
      gridItem.tags.forEach(tagItem => {
        tagItem.values.forEach(tag => {
          gridItem.flattenedTags.push({
            parentTagValueId: tagItem.id,
            tagGroupId: tagItem.id,
            name: tag.tag,
            id: tag.id,
            children: tag.children
          });
        });
      });

      return gridItem;
    });
  }

  public handleTagsSelectionChanges(event) {
    const { selectedTagGroups, bpItem, remove } = event;

    if (
      !this.currentBusinessRecord ||
      this.currentBusinessRecord.id !== bpItem.id
    ) {
      this.businessProcessControllerService
        .findOverviewById(bpItem.id)
        .pipe(
          mergeMap(payload => {
            this.currentBusinessRecord = payload;

            this.currentBusinessRecord.tags = this.updateTagsForBusinessProcess(
              selectedTagGroups,
              remove
            );

            return this.businessProcessControllerService.updateOverview(
              this.currentBusinessRecord
            );
          })
        )
        .subscribe(
          res => {
            this.renderSkeleton = true;
            this.renderData();
          },
          err => {
            console.error(err);
            this.renderSkeleton = false;
            this.handleError(err);
          }
        );
    } else if (this.currentBusinessRecord.id === bpItem.id) {
      this.currentBusinessRecord.tags = this.updateTagsForBusinessProcess(
        selectedTagGroups,
        remove
      );

      this.businessProcessControllerService
        .updateOverview(this.currentBusinessRecord)
        .subscribe(
          res => {
            this.renderSkeleton = true;
            this.renderData();
          },
          err => {
            console.error(err);
            this.renderSkeleton = false;
            this.handleError(err);
          }
        );
    }
  }

  private updateTagsForBusinessProcess(selectedTagGroups, remove) {
    this.currentBusinessRecord.tags = this.updateCurrentBPTags(
      this.currentBusinessRecord.tags,
      selectedTagGroups
    );

    if (remove && remove.length) {
      this.currentBusinessRecord.tags = this.removeTagGroups(
        this.currentBusinessRecord.tags,
        remove
      );
    }

    return this.currentBusinessRecord.tags;
  }

  private updateCurrentBPTags(tags, selectedTagGroups) {
    const newTags = [];

    selectedTagGroups.forEach(stg => {
      let found = false;
      tags.forEach(tagGroup => {
        if (tagGroup.id === stg.id) {
          found = true;
          tagGroup.values = _.cloneDeep(stg.values);
        }
      });

      if (!found) {
        newTags.push(stg);
        found = false;
      }
    });

    return [...tags, ...newTags];
  }

  private removeTagGroups(tags, remove) {
    tags.forEach((tagGroup, i) => {
      const some = remove.some(tg => tg.id === tagGroup.id);

      if (some) {
        tags = [...tags.slice(0, i), ...tags.slice(i + 1, tags.length)];
      }
    });

    return tags;
  }

  //#endregion Tags

  //#region Business process Overview

  public findOverviewById(businessProcessId: string) {
    if (this._getOverview$) {
      this._getOverview$.unsubscribe();
    }

    this._getOverview$ = this.businessProcessControllerService
      .findOverviewById(businessProcessId)
      .subscribe(
        payload => {
          this.currentBusinessRecord = payload;
        },
        err => {
          this.closePopovers();
          this.closeDropdowns();

          const { status } = err;
          if (status === 403) {
            // [i18n-tobeinternationalized]
            this.toastService.error(
              'You do not have the access permissions needed to edit this record',
              null,
              5000
            );
          }
        }
      );
  }

  private updateOverview(item: BaseRecord) {
    if (this._updateOverview$) {
      this._updateOverview$.unsubscribe();
    }

    this.isSaving = true;
    this.businessProcessControllerService
      .updateOverview(this.currentBusinessRecord)
      .subscribe(
        payload => {
          this.isSaving = false;

          if (item.name) {
            item.name = payload.name;
          }

          if (item.owner) {
            item.owner.fullName = payload.contact.fullName;
          }

          if (item.status) {
            item.status = payload.status;
          }

          if (item.revalidationDate) {
            item.revalidationDate = payload.revalidationDate;
          }

          this.closePopovers();
          this.closeDropdowns();
        },
        () => {
          this.isSaving = false;
          this.toastService.clear();

          // [i18n-tobeinternationalized]
          this.toastService.error('Error updating record.');
        }
      );
  }

  //#endregion Business process Overview

  //#region Dropdowns/Popovers management

  public async openDropdown(
    $event: MouseEvent,
    businessProcessId: string,
    taDropdown: TaDropdown,
    fieldName?: string,
    currentValue?: string
  ) {
    $event.stopPropagation();
    this.closeDropdowns();

    if (this._getOverview$) {
      this._getOverview$.unsubscribe();
    }

    if (fieldName === 'status') {
      this.findOverviewById(businessProcessId);
    }

    taDropdown.open();
  }

  private closeDropdowns() {
    if (this.multiDropdown) {
      this.multiDropdown.forEach(dropdown => {
        if (dropdown) {
          dropdown.close();
        }
      });
    }
  }

  private closePopovers() {
    if (this.popover) {
      this.popover.forEach(pop => {
        if (pop) {
          pop.close();
        }
      });
    }
  }

  //#endregion Popovers management

  //#region Error handling

  private handleError(err) {
    const { status } = err;
    if (status === 403) {
      this.handleForbiddenError();
    }

    this.renderSkeleton = true;
    this.renderData();
  }

  private handleForbiddenError() {
    // [i18n-tobeinternationalized]
    this.toastService.error(
      'You do not have the access permissions needed to edit this record',
      null,
      5000
    );
  }

  //#endregion Error handling

  ngOnDestroy() {}
}
