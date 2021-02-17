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
  TableService,
  TaDatagridTool,
  TaDropdown,
  TaModal,
  TaModalConfig,
  TaPopover,
  TaTableRequest,
  ToastService
} from '@trustarc/ui-toolkit';

import { noop, Observable, of, Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { RecordListingService } from '../../services/record-listing/record-listing.service';
import {
  BpSearchResultInterface,
  RecordType
} from '../../services/record-listing/record-listing.model';
import { DatagridHeaderService } from '../../services/record-listing/datagrid-header.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { DatagridPaginationService } from '../../services/record-datagrid-pagination/datagrid-pagination.service';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { FilterNonLeafNode } from '../../models/filter-model';
import { Router } from '@angular/router';
import { ExportService } from 'src/app/shared/services/export/export.service';
import { BaseRecordService } from '../../services/base-record/base-record.service';
import {
  defaultTo,
  downloadReturnedFile,
  toCaptalizedCase
} from '../../utils/basic-utils';
import { UtilsClass } from 'src/app/shared/_classes';
import { CloneRecordModalComponent } from './clone-record-modal/clone-record-modal.component';
import { DatatableService } from '../../services/record-listing/datatable.service';
import { HeaderService } from '../header/header.service';
import { ReportDownloadService } from '../../services/report-download/report-download.service';
import { CustomFiltersService } from 'src/app/shared/services/custom-filters/custom-filters.service';
import {
  DownloadReportEvent,
  RISK_PROFILE_URL,
  STATUS_BUSINESS_PROCESS_LIST_PAGE
} from 'src/app/app.constants';
// tslint:disable-next-line: max-line-length
import { ModalConfirmationBasicComponent } from 'src/app/business-processes/business-process-wizard/shared/components/modals/modal-confirmation-basic/modal-confirmation-basic.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  BusinessProcessControllerService,
  FeatureFlagControllerService
} from '../../_services/rest-api';
import {
  BusinessProcessOverviewInterface,
  ColumnConfigInterface,
  FeatureFlagAllInterface
} from '../../_interfaces';
import { TagsSelectorService } from 'src/app/shared/components/tags-selector/tags-selector.service';
import { PageConfigControllerService } from '../../_services/rest-api/page-config-controller/page-config-controller.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { RISK_TYPE } from '../traffic-risk-indicator/traffic-risk-indicator.model';
import { InlineOwnerEditorComponent } from '../inline-owner-editor/inline-owner-editor.component';
import { TagGroupInterface } from '../../models/tags.model';
import { MainListTypesEnum } from '../../_enums';
// tslint:disable-next-line:max-line-length
import { ModalRevalidationDateEditComponent } from 'src/app/business-processes/business-process-wizard/shared/components/modals/modal-revalidation-date-edit/modal-revalidation-date-edit.component';
import { NotificationService } from '../../services/notification/notification.service';
import { ReportDownloadType } from '../../services/report-download/report-download.constant';
import { ModalReportDownloadComponent } from '../modals/modal-report-download/modal-report-download.component';
import {
  MultiDocumentFileRequest,
  ReportDownloadDataFlowOptions
} from '../../services/report-download/report-download.model';

interface RecordRequestInterface extends TaTableRequest {
  customFilters?: any;
}

declare const _: any;

@AutoUnsubscribe([
  '_pageConfig$',
  '_deleteRecord$',
  '_getSearchBpRef$',
  '_getUsersSubscription$',
  '_getInitialGridData$',
  '_getInitialTagsData$',
  '_recordsDeleted$',
  '_recordsUpdated$',
  '_eventRequestRef$',
  '_datagridHeaderService$',
  '_datagridPaginationService$',
  '_searchRequestRef$',
  '_checkAssessmentEnabled$',
  '_featureFlags$',
  '_updateRefresh'
])
@Component({
  selector: 'ta-record-datagrid',
  templateUrl: './record-datagrid.component.html',
  styleUrls: ['./record-datagrid.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecordDatagridComponent
  implements OnInit, OnDestroy, AfterContentChecked {
  constructor(
    private featureFlagControllerService: FeatureFlagControllerService,
    private pageConfigControllerService: PageConfigControllerService,
    private tagsSelectorService: TagsSelectorService,
    private baseRecordService: BaseRecordService,
    private datatableService: DatatableService,
    private tableService: TableService,
    private datagridHeaderService: DatagridHeaderService,
    private recordDatagridPaginationService: DatagridPaginationService,
    private recordListingService: RecordListingService,
    private router: Router,
    private modalConfig: TaModalConfig,
    private modalService: TaModal,
    private authService: AuthService,
    private toastService: ToastService,
    private headerService: HeaderService,
    private exportService: ExportService,
    private customFiltersService: CustomFiltersService,
    private reportDownloadService: ReportDownloadService,
    private formBuilder: FormBuilder,
    private businessProcessControllerService: BusinessProcessControllerService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.modalConfig.backdrop = 'static';
    this.modalConfig.keyboard = true;

    this.request.page = 1;
    this.request.columnSort = 'lastModified';
    this.request.sortType = 'desc';
    this.emptyCTAClick = new EventEmitter();

    this.disableInlineSaveButton = true;
    this.isSaving = false;

    this.inlineNameForm = this.formBuilder.group({
      name: ['']
    });
    this.inlineDateForm = this.formBuilder.group({
      date: [null]
    });

    this.columnsConfigForm = this.formBuilder.group({
      columns: this.formBuilder.array([])
    });

    this.visibilityByLicense = {
      showDataTransfer: false,
      showRiskProfile: false
    };
    this.oldRiskIndicatorEnabled = false;
    this.isInternalAdmin = false;
    this.isRiskEnabled = false;
    this.currentColumnLength = this.datatableService.getTableCurrentColumn;
  }

  @ViewChildren(TaPopover) popover: QueryList<TaPopover>;
  @ViewChildren(TaDropdown) multiDropdown: QueryList<TaDropdown>;
  @ViewChildren(InlineOwnerEditorComponent) inlineOwnersEdits: QueryList<
    InlineOwnerEditorComponent
  >;

  @Input() public recordType: RecordType;
  @Input() public gridId: string;
  @Input() public emptyCTAText: string;
  @Output() public emptyCTAClick: EventEmitter<any>;

  public readonly ReportDownloadType = ReportDownloadType;

  public isFetching = false;
  public isFetchingRecords = false;
  public isFetchingTags = false;

  public riskStatus = null;
  public hasInitFetched = false;
  public gridData = [];
  public serverData = [];
  public userTags: any[];
  public totalElements: number;
  public oldTotalElements: number;

  public page = 1;
  public maxRows = 25;
  private search = '';

  public customFilters = null;
  public currentPageSelectedItems: any[] = [];

  public isFilterDirty = false;
  public filterValue = '';
  public defaultFilters = [
    'Status',
    'Tag',
    `Owner's Name`,
    'Data Subject',
    'Data Element'
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

  public tools: TaDatagridTool[];

  private request: RecordRequestInterface = {};
  private tableRequest: TaTableRequest = {};
  private _pageConfig$: Subscription;
  private _getSearchBpRef$: Subscription;
  private _getUsersSubscription$: Subscription;
  private _getInitialGridData$: Subscription;
  private _getInitialTagsData$: Subscription;
  private _recordsDeleted$: Subscription;
  private _recordsUpdated$: Subscription;
  private _eventRequestRef$: Subscription;
  private _eventSelectedRef$: Subscription = null;
  private _datagridPaginationService$: Subscription;
  private _deleteRecord$: Subscription;
  private _searchRequestRef$: Subscription;
  private _checkAssessmentEnabled$: Subscription;
  private _featureFlags$: Subscription;
  private _updateRefresh$: Subscription;

  public selectedReValidationDate: Date;
  public assessmentEnabled = false;
  public deleteBtnDisabled = true;
  public allTags = [];
  public licenses: FeatureFlagAllInterface = {};
  public disableInlineSaveButton: boolean;
  public inlineNameForm: FormGroup;
  public inlineDateForm: FormGroup;
  public currentBusinessRecord: BusinessProcessOverviewInterface;
  public _getOverview$: Subscription;
  public readonly BP_STATUS_LIST = STATUS_BUSINESS_PROCESS_LIST_PAGE;
  public selectedRecordStatus: string;
  public isSaving: boolean;
  public visibilityByLicense: {
    showDataTransfer: boolean;
    showRiskProfile: boolean;
  };
  public oldRiskIndicatorEnabled: boolean;
  public isInternalAdmin: boolean;
  public isRiskEnabled = false;

  private clioAppDetails: any;
  private comingFromInit: boolean;
  private isSearching: boolean;

  private readonly DOWNLOAD_REPORT_RETRIES_DELAY_MS = 3000;
  private downloadReportRetriesInProcess = false;
  private downloadReportRetriesCount = 0;

  public columnsConfigForm: FormGroup;
  public columnsChecked: ColumnConfigInterface[];

  public get columns(): FormArray {
    return this.columnsConfigForm.get('columns') as FormArray;
  }

  public currentColumnLength: number;

  @Input() public cloneRecordService = () => (
    form: any,
    record: any
  ): Observable<any> => of(null);

  ngOnDestroy() {}

  public ngOnInit() {
    this.comingFromInit = false;
    this.getAllFeatureFlags();
    this.filterResultsOnSearch();
    this.initCachedFilter();
    this.checkAssessmentEnabled();
    this.initData();

    this._getUsersSubscription$ = this.userService
      .getUsersResponse('', 0, 1000)
      .subscribe(users => {
        this.userTags = this.updateUserOptionsListWithResponse(users.content);
      });

    this.datatableService.initGridSources(this.gridId);
    // subscribe service sort, search
    if (this._eventRequestRef$) {
      this._eventRequestRef$.unsubscribe();
    }

    this._eventRequestRef$ = this.tableService
      .listenRequestEvents(this.gridId)
      .subscribe(request => {
        if (!_.isEqual(request, this.tableRequest)) {
          this.tableRequest = request;
          this.renderData();
        }

        this.tableRequest = request;
      });

    // subscribe event selected items of current page
    this._eventSelectedRef$ = this.tableService
      .listenPageSelectedItemsEvents(this.gridId)
      .subscribe((items: any[]) => {
        this.currentPageSelectedItems = items;
        this.updateDeleteBtnDisabled();
      });

    this.datatableService.riskEnabled$.subscribe(status => {
      this.isRiskEnabled = !status ? false : status;
      this.datatableService.riskService$.subscribe(riskStatus => {
        this.riskStatus = riskStatus;
        this.isOldRiskIndicatorEnabled();
        this.getRiskEnabled();
      });
    });

    this.clioAppDetails = this.headerService.getClientApp('clio-client');
    this.subscribeUpdates();

    this.initColumnConfiguration();
  }

  public ngAfterContentChecked(): void {
    if (this.totalElements !== this.oldTotalElements) {
      this.recordDatagridPaginationService.updateCollectionSize(
        this.totalElements
      );
      this.oldTotalElements = this.totalElements;
    }
    this.isInternalAdmin = this.authService.isInternalAdmin();
  }

  public initData() {
    if (this._getInitialGridData$) {
      this._getInitialGridData$.unsubscribe();
    }
    if (this._getInitialTagsData$) {
      this._getInitialTagsData$.unsubscribe();
    }

    this.isFetching = true;
    this.isFetchingTags = true;
    this.isFetchingRecords = true;

    const request = this.buildRequest();

    this._getInitialGridData$ = this.recordListingService
      .getSearchBp(request)
      .subscribe(
        gridData => {
          this.isFetchingRecords = false;
          this.isFetching = this.isFetchingRecords && this.isFetchingTags;
          // Handle grid data
          this.serverData = gridData;
          this.handleGridData(gridData);
        },
        err => {
          this.isFetchingRecords = false;
          this.isFetching = this.isFetchingRecords && this.isFetchingTags;
          console.error(err);
        }
      );

    this._getInitialTagsData$ = this.tagsSelectorService
      .getAllTags(0, true)
      .subscribe(
        allTagsData => {
          this.isFetchingTags = false;
          this.isFetching = this.isFetchingRecords && this.isFetchingTags;
          // Handle all tags data
          this.handleAllTagsData(allTagsData);
        },
        err => {
          this.isFetchingTags = false;
          this.isFetching = this.isFetchingRecords && this.isFetchingTags;
          console.error(err);
        }
      );
  }

  private handleAllTagsData(data: TagGroupInterface[]) {
    this.allTags = data;
    this.allTags.forEach(tagGroup => {
      if (tagGroup.tagGroupType === 'USER') {
        tagGroup.values.forEach(tag => {
          tag.parentTagValueId = tagGroup.id;
        });
      }
    });

    this.handleGridData(_.cloneDeep(this.serverData));
  }

  private handleGridData(data) {
    this.gridData = data.content;
    this.flattenTags(this.gridData);
    this.totalElements = data.totalElements;
    this.hasInitFetched = true;

    // This layer of logic is for presentation layer
    if (!this.comingFromInit) {
      setTimeout(() => {
        this.isFetchingRecords = false;
        this.isFetching = false;
        this.setColumnForSkeletonLoader();
        this.comingFromInit = true;
      }, 1000);
    } else {
      this.isFetchingRecords = false;
      this.isFetching = false;
    }
  }

  private updateUserOptionsListWithResponse(users) {
    const userTags = users
      .map(user => ({
        id: user.id,
        isUserTag: true,
        tag: user.name + ' - ' + user.email
      }))
      .sort((a, b) => (a.tag.toLowerCase() < b.tag.toLowerCase() ? -1 : 1));

    return userTags;
  }

  private getAllFeatureFlags() {
    this.isFetching = true;
    this._featureFlags$ = this.featureFlagControllerService
      .getAllFeatureFlags()
      .subscribe(
        (response: any) => {
          this.licenses = response;
          this.determineVisibilityByLicense();
          if (
            this.licenses.RISK_PROFILE_LICENSE === true &&
            this.licenses.RISK_PROFILE_THIRD_PARTY_LICENSE === true &&
            this.licenses.RISK_SERVICE_V2 === true
          ) {
            this.defaultFilters.push('Risk Indicator');
          }

          this.isFetching = false;
        },
        err => {
          this.isFetching = false;
          console.error('Error getting feature flags', err);
        }
      );
  }

  public initColumnConfiguration() {
    const cachedConfig = this.datatableService.getTableConfigByType(
      'columns-bp'
    );
    if (cachedConfig) {
      return this.initColumnConfigForm(cachedConfig.columns);
    }

    if (this._pageConfig$) {
      this._pageConfig$.unsubscribe();
    }
    this._pageConfig$ = this.pageConfigControllerService
      .getColumnConfig(MainListTypesEnum.BusinessProcessList)
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
    this.datatableService.setTableConfigByType('columns-bp', rawValue);

    // Get checked columns
    this.columnsChecked = this.columns
      .getRawValue()
      .filter(item => item.selected === true);

    // Subscribe to changes
    this.columnsConfigForm.valueChanges.subscribe(() => {
      // Clone the current data
      const cloneData = _.cloneDeep(this.gridData);

      // This will empty the current data in the table for immutable purpose
      this.gridData = [];

      // Get updated checked columns
      this.columnsChecked = this.columns
        .getRawValue()
        .filter(item => item.selected === true);

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

  public saveConfigAsDefault() {
    this.pageConfigControllerService
      .updateColumnConfig(MainListTypesEnum.BusinessProcessList, {
        columnConfig: this.columnsChecked
      })
      .subscribe(noop, err => console.error(err));
  }

  public determineColumnVisibilityByAlias(alias: string) {
    const found = (this.columnsChecked || []).find(
      item => item.columnAlias === alias
    );
    return found ? found.selected : false;
  }

  private filterResultsOnSearch() {
    _.delay(() => {
      const searchInput =
        document.querySelector('.ta-table-toolbar-search input') || false;

      if (searchInput) {
        document
          .querySelector('.ta-table-toolbar-search input')
          .addEventListener('keyup', (searchEvent: any) => {
            this.request.columnSort = 'name';
            this.request.sortType = 'asc';
            this.isSearching = true;
            const boundSearch = this.onSearch.bind(this);
            const fn = _.debounce(
              () => boundSearch(searchEvent.target.value),
              35
            );
            fn();
          });
      } else {
        this.filterResultsOnSearch();
      }
    }, 100);
  }

  private updateDeleteBtnDisabled() {
    if (this.currentPageSelectedItems.length === 0) {
      this.deleteBtnDisabled = true;
    } else {
      this.deleteBtnDisabled = false;
    }
  }

  private checkAssessmentEnabled() {
    if (this._checkAssessmentEnabled$) {
      this._checkAssessmentEnabled$.unsubscribe();
    }

    this._checkAssessmentEnabled$ = this.recordListingService
      .getAssessmentEnabled()
      .subscribe(res => {
        if (res) {
          this.assessmentEnabled = true;
        }
      });
  }

  public getRecordType(record) {
    if (
      this.recordType === 'BusinessProcess' ||
      record.recordType === 'BusinessProcess'
    ) {
      return 'Business Process';
    }

    return this.recordType || record.recordType;
  }

  public formatRecordType(recordType) {
    return defaultTo('', recordType.replace(/([A-Z])/g, ' $1').toLowerCase());
  }

  public getOwnerName(record) {
    return defaultTo('--', record.owner.fullName);
  }

  public getRiskEnabled() {
    if (this.riskStatus && this.riskStatus.riskService) {
      this.isRiskEnabled = this.riskStatus.riskProfile;
    }
  }

  public determineVisibilityByLicense() {
    const { RISK_PROFILE_LICENSE, PRIVACY_SHIELD } = this.licenses;
    this.visibilityByLicense = {
      showDataTransfer: PRIVACY_SHIELD === true,
      showRiskProfile: RISK_PROFILE_LICENSE === true
    };
  }

  public isOldRiskIndicatorEnabled() {
    const oldRisk =
      this.isRiskEnabled && (!this.riskStatus || !this.riskStatus.riskService);

    this.oldRiskIndicatorEnabled =
      oldRisk === null || oldRisk === false ? false : true;
  }

  public getRisk(record) {
    return defaultTo('--', record.riskLevel);
  }

  public isRiskIncomplete(record) {
    if (this.riskStatus && this.riskStatus.riskService) {
      return record.algorithmRiskIndicator === 'INCOMPLETE_FIELDS';
    } else {
      return record.riskLevel === 'INCOMPLETE_FIELDS';
    }
  }

  public getRecordStatus(record) {
    return toCaptalizedCase(record.status);
  }

  public getTypeTheme(status) {
    switch (status) {
      case 'DRAFT':
        return 'inverted';
      case 'REVISE':
        return 'inverted-orange';
      case 'IN REVIEW':
        return 'inverted-violet';
      case 'IN_REVIEW':
        return 'inverted-violet';
      case 'PUBLISH':
        return 'inverted-green';
      case 'PUBLISHED':
        return 'inverted-green';
      default:
        return 'inverted-blue';
    }
  }

  public onEditItem(record) {
    if (this.licenses.RHEA_NEW_UI_STEPS_12_LICENSE === true) {
      this.router.navigate([`/business-process/${record.id}/details`]);
    } else {
      this.router.navigate([`/business-process/${record.id}/background`]);
    }
  }

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

    modalRef.result.then(form => {
      this.cloneRecordService()(form, record).subscribe(
        success => {
          this.comingFromInit = false;
          _.delay(() => this.renderData(), 1000);
        },
        err => {
          this.toastService.error(
            'An error occurred. Unable to clone record: ',
            record.name
          );
        }
      );
    }, noop);
    modalRef.componentInstance.record = record;
  }

  public onRiskItem(record) {
    const { algorithmRiskIndicator } = record;

    if (algorithmRiskIndicator !== RISK_TYPE.INCOMPLETE_FIELDS) {
      if (this.clioAppDetails) {
        const url =
          this.riskStatus && this.riskStatus.riskService
            ? RISK_PROFILE_URL.VERSION_2
            : RISK_PROFILE_URL.VERSION_1;
        window.open(this.clioAppDetails.url + url + record.id, '_blank');
      } else {
        // [i18n-tobeinternationalized]
        this.toastService.error('Error accessing risk assessment.');
      }
    }
  }

  public onChangeMax(event) {
    this.maxRows = event;
    this.renderData();
  }

  public onChangePage(event) {
    this.page = event;
    this.renderData();
  }

  public onSearch(event) {
    if (event === '' && this.search === '') {
      return;
    }

    this.search = event;
    this.page = 1;
    this.renderData();
  }

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

  public editRecord() {
    if (this.currentPageSelectedItems.length !== 1) {
      this.toastService.warn('Only one item can be edited at once.'); // [i18n-tobeinternationalized]
    } else {
      const selectedId = this.currentPageSelectedItems[0].id;
      this.router.navigate([`/business-process/${selectedId}`]);
    }
  }

  public deleteRecord(record) {
    this.deleteRecords([record]);
  }

  public delete() {
    this.deleteRecords(this.currentPageSelectedItems);
  }

  public deleteRecords(records: any[]) {
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

    const recordCount = records && records.length ? records.length : 0;
    let displayMessage = ``;

    const itemsForModal = records.map(item => {
      // records each item must have property name or any property must be mapped
      // this returns only records which have property item
      if (!('name' in item)) {
        console.error('property name does not exist on object');
        return;
      }
      return item.name;
    });
    itemsForModal.sort();

    if (recordCount > 1) {
      // [i18n-tobeinternationalized]
      displayMessage = `Delete the following Business Processes?`;
      modalRef.componentInstance.items = itemsForModal;
    }

    if (recordCount === 1) {
      // [i18n-tobeinternationalized]
      displayMessage = `Delete Business Process Name ${itemsForModal[0]}?`;
      modalRef.componentInstance.items = null;
    }

    modalRef.componentInstance.title = displayMessage;
    modalRef.componentInstance.confirm.subscribe(confirm => {
      this.isFetching = true;
      this.datatableService.setCurrentGridId(this.gridId);
      modalRef.close('DELETED');
      this.baseRecordService.deleteRecordsByIdList(records).subscribe(
        (response: any) => {
          this.tableService.clearAllSelected(this.gridId);
          this.renderData();
        },
        error => {
          this.renderData();
        },
        () => {}
      );
    });
    modalRef.componentInstance.cancel.subscribe(cancel => {
      modalRef.close('CANCELED');
    });
  }

  public triggerRiskPopover(popover) {
    // close another popover
    this.removePopoverAndDropdown();
    popover.open();
  }

  public downloadMultiReport(type: ReportDownloadType, singleItem): void {
    const modalRef = this.modalService.open(ModalReportDownloadComponent, {
      windowClass: 'ta-modal-report-download',
      backdrop: 'static',
      keyboard: true,
      size: 'sm'
    });

    // [i18n-tobeinternationalized]
    modalRef.componentInstance.reportName =
      ReportDownloadType.BpSummary === type
        ? 'Business Process Summary'
        : 'Article 30';

    modalRef.result.then(
      () => {},
      reason => {
        // modal is dismissed through 'Run Report' btn
        if (reason) {
          const options = reason as ReportDownloadDataFlowOptions;
          /**
           * Allow to initiate only one download process at the time
           */
          if (this.downloadReportRetriesInProcess) {
            // [i18n-tobeinternationalized]
            this.toastService.warn(`Report download is in progress`);
          } else {
            const items = singleItem
              ? [singleItem]
              : this.currentPageSelectedItems;
            const multiDocumentFileRequest: MultiDocumentFileRequest = {
              entityIds: items.map(item => item.id),
              reportType: type,
              includeDataFlowChart: options.includeDataFlowChart,
              includeGlobalMap: options.includeGlobalMap
            };

            this.doDownloadMultiReport(multiDocumentFileRequest);
          }
        }
      }
    );
  }

  public doDownloadMultiReport(
    multiDocumentFileRequest: MultiDocumentFileRequest
  ): void {
    this.reportDownloadService
      .downloadMultiReport(multiDocumentFileRequest)
      .subscribe(
        res => {
          if (this.downloadReportRetriesInProcess) {
            this.resetDownloadReportRetries();
          }
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
          // [i18n-tobeinternationalized]
          const reportName =
            ReportDownloadType.BpSummary === multiDocumentFileRequest.reportType
              ? 'Business Process Summary'
              : 'Article 30';

          // [i18n-tobeinternationalized]
          this.toastService.error(
            `Error downloading ${reportName} report${
              multiDocumentFileRequest.entityIds.length > 1 ? 's' : ''
            }`
          );
        }
      );
  }

  private handleReportNotFoundWithRetries(
    multiDocumentFileRequest: MultiDocumentFileRequest
  ): void {
    // case1: retries not started
    if (!this.downloadReportRetriesInProcess) {
      this.downloadReportRetriesInProcess = true;
      this.notificationService.emit({
        action: DownloadReportEvent.Start
      });
      this.delayedDownloadMultiReport(multiDocumentFileRequest);

      // case2: retries started but <= 10
    } else if (this.downloadReportRetriesCount <= 10) {
      this.delayedDownloadMultiReport(multiDocumentFileRequest);

      // case3: retries exceeded the limit
    } else {
      this.resetDownloadReportRetries();
      // [i18n-tobeinternationalized]
      this.toastService.error('Report cannot be found');
    }
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
    this.downloadReportRetriesInProcess = false;
    this.downloadReportRetriesCount = 0;
    this.notificationService.emit({
      action: DownloadReportEvent.End
    });
  }

  public downloadSelected() {
    this.exportService.exportSelected(this.currentPageSelectedItems).subscribe(
      response => {
        downloadReturnedFile(response);
      },
      error => {
        const errorMessage = this.getExportErrorMessage(
          this.currentPageSelectedItems
            ? this.currentPageSelectedItems.length
            : 0
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
        this.checkForSelection(filters[key].nestedFilterValue);
      }
    });
  }

  public updateFilterValue(value) {
    // [i18n-tobeinternationalized]
    this.filterValue = value ? `Filters (${value})` : 'Filters';
  }

  public refreshData() {
    this.renderData();
  }

  public getSelectedCounterString() {
    // [i18n-tobeinternationalized]
    return `${this.currentPageSelectedItems.length} of ${this.totalElements} item(s) selected`;
  }

  private initCachedFilter() {
    this.customFiltersService.getCachedFilters().subscribe(cachedFilter => {
      if (cachedFilter && cachedFilter.BP_ALL && cachedFilter.BP_ALL.filters) {
        this.customFilters = cachedFilter.BP_ALL;
        this.updateIsFilterDirty();
      }
    });
  }

  public buildRequest() {
    this.request.page = this.page;
    this.request.maxRows = this.maxRows;
    this.request.search = this.search;

    this.request.customFilters =
      this.customFilters && this.customFilters.filters
        ? this.customFilters.filters
        : {};

    const request = _.cloneDeep(this.request);

    this.request.sortType = this.request.sortType || 'desc';
    request.size = this.request.maxRows;
    request.sortField = this.tableRequest.columnSort || 'lastModified';
    request.sortDirection = (
      this.tableRequest.sortType || 'desc'
    ).toUpperCase();
    request.filters = this.businessProcessFilters;

    return request;
  }

  private renderData() {
    if (this._getSearchBpRef$) {
      this._getSearchBpRef$.unsubscribe();
    }

    const request = this.buildRequest();

    this.isFetching = true;
    this.isFetchingRecords = true;
    this._getSearchBpRef$ = this.recordListingService
      .getSearchBp(request)
      .subscribe(
        res => {
          this.serverData = res;
          this.handleGridData(res);
        },
        err => {
          this.isFetching = false;
          this.isFetchingRecords = false;
          console.error(err);
        }
      );
  }

  private flattenTags(gridData) {
    gridData.forEach(gridItem => {
      gridItem.flattendTags = [];
      gridItem.tags.forEach(tagItem => {
        tagItem.values.forEach(tag => {
          gridItem.flattendTags.push({
            parentTagValueId: tagItem.id,
            tagGroupId: tagItem.id,
            name: tag.tag,
            id: tag.id,
            children: tag.children
          });
        });
      });
    });
  }

  public getClonedAllTags() {
    return _.cloneDeep(this.allTags);
  }

  private updateCurrentBPTags(cbptags, selectedTagGroups) {
    const newTags = [];
    selectedTagGroups.forEach(stg => {
      let found = false;
      cbptags.forEach(tagGroup => {
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
    return [...cbptags, ...newTags];
  }

  private removeTagGroups(cbptags: any[], remove: any[]) {
    cbptags.forEach((tagGroup, i, arr) => {
      const exists = remove.some(tg => tg.id === tagGroup.id);
      if (exists) {
        cbptags = [
          ...cbptags.slice(0, i),
          ...cbptags.slice(i + 1, cbptags.length)
        ];
      }
    });
    return cbptags;
  }

  public inlineTagSelectionChanges(event) {
    const { selectedTagGroups, bpItem, remove } = event;

    this.isFetching = true;
    if (
      !this.currentBusinessRecord ||
      this.currentBusinessRecord.id !== bpItem.id
    ) {
      this.businessProcessControllerService
        .findOverviewById(bpItem.id)
        .pipe(
          flatMap(payload => {
            this.currentBusinessRecord = payload;
            const cbptags = this.currentBusinessRecord.tags;
            this.currentBusinessRecord.tags = this.updateCurrentBPTags(
              cbptags,
              selectedTagGroups
            );
            if (remove && remove.length) {
              this.currentBusinessRecord.tags = this.removeTagGroups(
                cbptags,
                remove
              );
            }
            return of(payload);
          }),
          flatMap(() => {
            return this.businessProcessControllerService.updateOverview(
              this.currentBusinessRecord
            );
          })
        )
        .subscribe(
          res => {
            this.renderData();
          },
          err => {
            this.handleError(err);
          }
        );
    } else if (this.currentBusinessRecord.id === bpItem.id) {
      const cbptags = this.currentBusinessRecord.tags;
      this.currentBusinessRecord.tags = this.updateCurrentBPTags(
        cbptags,
        selectedTagGroups
      );
      if (remove && remove.length) {
        this.currentBusinessRecord.tags = this.removeTagGroups(cbptags, remove);
      }

      this.businessProcessControllerService
        .updateOverview(this.currentBusinessRecord)
        .subscribe(
          data => {
            this.renderData();
          },
          err => {
            this.handleError(err);
          }
        );
    }
  }

  public async openInlineEditingDropdown(
    $event: MouseEvent,
    businessProcessId: string,
    taDropdown: any,
    fieldName?: string,
    currentValue?: string
  ) {
    $event.stopPropagation();
    this.removePopoverAndDropdown();

    if (this._getOverview$) {
      this._getOverview$.unsubscribe();
    }

    if (fieldName === 'name' || fieldName === 'owner') {
      this.getBusinessProcessRecordName(businessProcessId, currentValue);
    }

    if (fieldName === 'status') {
      this.findOverviewById(businessProcessId);
    }

    if (fieldName === 'revalidationDate') {
      this.getBusinessProcessRecordRevalidationDate(
        businessProcessId,
        currentValue
      );
    }

    taDropdown.open();
  }

  private getBusinessProcessRecordName(
    businessProcessId: string,
    currentRecordName: string
  ) {
    const CURRENT_NAME = currentRecordName ? currentRecordName : '--';

    this.inlineNameForm.valueChanges.subscribe(currentValue => {
      if (CURRENT_NAME === currentValue.name || currentValue.name === '') {
        this.disableInlineSaveButton = true;
      } else {
        this.disableInlineSaveButton = false;
      }
    });

    this.inlineNameForm.patchValue({
      name: CURRENT_NAME
    });

    this.findOverviewById(businessProcessId);
  }

  public updateRecordName(item: BpSearchResultInterface) {
    this.currentBusinessRecord.name = this.inlineNameForm.get('name').value;
    this.updateOverview(item);
  }

  //#region Revalidation Date

  private getBusinessProcessRecordRevalidationDate(
    businessProcessId: string,
    revalidationDate: Date | null | string
  ) {
    const CURRENT_DATE = revalidationDate
      ? revalidationDate instanceof Date
        ? revalidationDate
        : new Date(revalidationDate)
      : new Date();

    this.inlineDateForm.valueChanges.subscribe(currentValue => {
      if (CURRENT_DATE === currentValue.name || currentValue.name === '') {
        this.disableInlineSaveButton = true;
      } else {
        this.disableInlineSaveButton = false;
      }
    });

    this.inlineDateForm.patchValue({
      date: CURRENT_DATE ? this.getTaPickerDate(CURRENT_DATE) : ''
    });

    this.findOverviewById(businessProcessId);
  }

  public updateRecordRevalidationDate(
    taDropdown: any,
    item: BpSearchResultInterface,
    clear: boolean = false
  ) {
    if (clear === false) {
      this.currentBusinessRecord.revalidationDate = this.selectedReValidationDate;
      item.revalidationDate = this.selectedReValidationDate;
    } else {
      this.selectedReValidationDate = null;
      this.currentBusinessRecord.revalidationDate = null;
      item.revalidationDate = null;
    }
    taDropdown.close();
    this.updateOverview(item);
  }

  public onRevalidationDateSelect(
    taDropdown: any,
    item: BpSearchResultInterface,
    dateEvent
  ) {
    this.selectedReValidationDate = new Date(
      dateEvent.year,
      dateEvent.month - 1,
      dateEvent.day
    );
    this.updateRecordRevalidationDate(taDropdown, item);
  }

  public selectRevalidationDate(
    taDropdown: any,
    item: BpSearchResultInterface,
    selectDate: 'today' | 'in 6 Months'
  ) {
    let dated: any = null;
    switch (selectDate) {
      case 'today':
        const today = new Date();
        dated = this.getTaPickerDate(today);
        break;
    }

    this.onRevalidationDateSelect(taDropdown, item, dated);
  }

  getTaPickerDate(dated: Date) {
    return {
      year: dated.getUTCFullYear(),
      month: dated.getUTCMonth() + 1,
      day: dated.getUTCDate()
    };
  }

  navigateToSelectedDate(selectedDate: string) {
    const date = new Date(selectedDate);
    return {
      month: date.getUTCMonth() + 1,
      year: date.getUTCFullYear()
    };
  }

  //#endregion

  public updateRecordOwner(item: BpSearchResultInterface) {
    this.currentBusinessRecord.contact.fullName = this.inlineNameForm.get(
      'name'
    ).value;

    this.updateOverview(item);
  }

  public updateRecordStatus(item: BpSearchResultInterface) {
    this.currentBusinessRecord.status = this.selectedRecordStatus;
    this.updateOverview(item);
  }

  private updateOverview(item: BpSearchResultInterface) {
    this.isSaving = true;
    this.businessProcessControllerService
      .updateOverview(this.currentBusinessRecord)
      .subscribe(
        payload => {
          if (item.name) {
            item.name = payload.name;
          }

          if (item.owner) {
            item.owner['fullName'] = payload.contact.fullName;
          }

          if (item.status) {
            item.status = payload.status;
          }

          if (item.revalidationDate) {
            item.revalidationDate = payload.revalidationDate;
          }

          this.removePopoverAndDropdown();
          this.isSaving = false;
        },
        () => {
          this.toastService.clear();
          this.toastService.error('Error updating record.'); // [i18n-tobeinternationalized]
          this.isSaving = false;
        }
      );
  }

  private findOverviewById(businessProcessId: string) {
    this._getOverview$ = this.businessProcessControllerService
      .findOverviewById(businessProcessId)
      .subscribe(
        payload => {
          this.currentBusinessRecord = payload;
        },
        err => {
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

  private removePopoverAndDropdown() {
    // This will remove any dropdown
    if (this.multiDropdown) {
      this.multiDropdown.forEach(dropdown => {
        if (dropdown) {
          dropdown.close();
        }
      });
    }

    // This will remove any popover
    this.closePopovers();
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

  private subscribeUpdates(): void {
    if (this._updateRefresh$) {
      UtilsClass.unSubscribe(this._updateRefresh$);
    }
    this._updateRefresh$ = this.recordListingService.recordsUpdatedObservable.subscribe(
      updated => {
        if (updated) {
          this.refreshData();
        }
      }
    );
  }

  //#region Owners Inline Edit

  public getOwnersIdName(record) {
    if (Array.isArray(record.owners) && record.owners.length > 0) {
      let owners = record.owners.map(owner => {
        // include records only have valid id and full name
        if (
          owner &&
          owner.id &&
          owner.fullName &&
          UtilsClass.isNullOrUndefinedOrEmpty(owner.id) === false &&
          !UtilsClass.isNullOrUndefinedOrEmpty(owner.name) === false
        ) {
          return {
            id: owner.id,
            name: owner.fullName
          };
        }
      });
      // valid items only
      owners = owners.filter(owner => {
        if (!(owner === null) || !(owner === undefined)) {
          return owner;
        }
      });
      return owners;
    } else {
      return [];
    }
  }

  public getOwnersFullName(record) {
    let owners = record.owners.map(owner => {
      // include records only have valid full name
      if (
        owner.fullName &&
        UtilsClass.isNullOrUndefinedOrEmpty(owner.fullName) === false
      ) {
        return owner.fullName;
      }
    });
    // valid items only
    owners = owners.filter(owner => {
      if (UtilsClass.isNullOrUndefinedOrEmpty(owner) === false) {
        return owner;
      }
    });
    return owners;
  }

  public ownersNamedUpdated(event) {
    this.renderData();
  }

  public ownerInlineEditModeChanged(event) {
    if (event === true) {
      this.inlineOwnersEdits.forEach(inlineEdit => {
        inlineEdit.editingDropdown.close();
      });
    }
  }
  //#endregion

  public setColumnForSkeletonLoader() {
    const column = Array.from(
      document.querySelectorAll('ta-table-column') || []
    ).length;

    this.currentColumnLength = column || 0;
    this.datatableService.setTableCurrentColumn = this.currentColumnLength;
  }

  private handleError(err) {
    const { status } = err;
    if (status === 403) {
      this.handleForbiddenError();
    }

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
}
