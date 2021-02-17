import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe } from '../../../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import {
  BpLinkedInterface,
  DataElementDetailsInterface,
  DataElementLinkedInterface,
  DataElementLinkType,
  DataElementServerDetails
} from '../../../../models/data-elements.model';
import {
  DataSubjectLinkType,
  DataSubjectServerDetails
} from '../../../../models/data-subjects.model';
import {
  TableService,
  TaModal,
  TaTableRequest,
  ToastService
} from '@trustarc/ui-toolkit';
import { concat, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SettingsBreadcrumbService } from '../../../settings-breadcrumb/settings-breadcrumb.service';
import { DatatableService } from '../../../../services/record-listing/datatable.service';
// tslint:disable-next-line:max-line-length
import { DataElementDetailsService } from '../../../../../settings/data-elements/data-element-categories/data-element-category/data-element-details/data-element-details.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { SettingsBreadcrumbInterface } from '../../../../models/settings-breadcrumb.model';
import { formatCategoryLabel } from 'src/app/shared/utils/basic-utils';
// tslint:disable-next-line:max-line-length
import { ItSystemIdsGroupedByBusinessProcessInterface } from '../../../../../settings/data-elements/data-element-categories/data-element-category/data-element-details/data-element-details.model';
// tslint:disable-next-line:max-line-length
import { ConfirmUnlinkDataElementCategoriesComponent } from '../../../confirm-unlink-data-element-categories/confirm-unlink-data-element-categories.component';
// tslint:disable-next-line:max-line-length
import { ProcessingPurposeDetailsService } from '../../../../../settings/processing-purposes/processing-purpose-categories/processing-purpose-category/processing-purpose-details/processing-purpose-details.service';
// tslint:disable-next-line:max-line-length
import { DataSubjectDetailsService } from '../../../../../settings/data-subjects/data-subject-categories/data-subject-category/data-subject-details/data-subject-details.service';

import {
  CustomItemDetailsInterface,
  CustomItemLinkedInterface,
  CustomItemServerDetails
} from '../../../../models/custom-items.model';

declare const _: any;

@AutoUnsubscribe([
  '_eventRequestRef$',
  '_eventToggleRef$',
  '_getCustomItemsDetails$'
])
@Component({
  selector: 'ta-custom-item-details',
  templateUrl: './custom-item-details.component.html',
  styleUrls: ['./custom-item-details.component.scss']
})
export class CustomItemDetailsComponent implements OnInit, OnDestroy {
  private readonly PAGE_OFFSET_FOR_SERVER = -1;
  private readonly BUSINESS_PROCESS_LINK_TYPE_STEP_6: DataElementLinkType =
    'STEP_6';
  private readonly BUSINESS_PROCESS_LINK_TYPE_STEP_3_4: DataSubjectLinkType =
    'STEP_3_4';
  private readonly IT_SYSTEM_LINK_TYPE: DataElementLinkType = 'IT_SYSTEM';

  @Input() public dataType: 'PP' | 'DE' | 'DS';

  public customItemData: CustomItemDetailsInterface = null;

  public gridID = 'dataElementDetailsTable';
  public tableData: BpLinkedInterface[] = [];
  public request: TaTableRequest = {};
  public totalRows: number;
  public headerCBIndeterminate = false;
  public headerCBStage = false;
  public pageSelectedLinkedRecords = [];
  public customItemId: string;

  private _eventRequestRef$: Subscription = null;
  private _eventToggleRef$: Subscription = null;
  private _getCustomItemsDetails$: Subscription = null;

  private customItem: CustomItemServerDetails;
  private page;
  private maxRows;

  private _activatedRouteParams$: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private settingsBreadcrumbService: SettingsBreadcrumbService,
    private datatableService: DatatableService,
    private tableService: TableService,
    private toastService: ToastService,
    private authService: AuthService,
    private modalService: TaModal,
    private dataElementDetailsService: DataElementDetailsService,
    private dataSubjectDetailsService: DataSubjectDetailsService,
    private processingPurposeDetailsService: ProcessingPurposeDetailsService
  ) {}

  ngOnInit() {
    this.page = 1;
    this.maxRows = 25;

    this.subscribeToData();

    this.datatableService.initGridSources(this.gridID);
    // subscribe service sort, search
    if (this._eventRequestRef$) {
      this._eventRequestRef$.unsubscribe();
    }
    this._eventRequestRef$ = this.tableService
      .listenRequestEvents(this.gridID)
      .subscribe(newRequest => {
        if (
          this.request.columnSort !== newRequest.columnSort ||
          this.request.sortType !== newRequest.sortType
        ) {
          this.request.columnSort = newRequest.columnSort;
          this.request.sortType = newRequest.sortType;
          this.renderData();
        }
      });

    this._eventToggleRef$ = this.tableService
      .listenToggleParentRows(this.gridID)
      .subscribe(row => {
        this.hideAnotherRowDetails(row);
      });
  }

  ngOnDestroy() {
    this.datatableService.clearGridSources(this.gridID);
  }

  private subscribeToData() {
    if (this._activatedRouteParams$) {
      this._activatedRouteParams$.unsubscribe();
    }
    this._activatedRouteParams$ = this.activatedRoute.params.subscribe(
      params => {
        if (
          !params.dataElementId &&
          !params.processingPurposeId &&
          !params.dataSubjectId
        ) {
          // [i18n-tobeinternationalized]
          this.toastService.error('Error fetching custom item details');

          // [i18n-tobeinternationalized]
          console.error(`Custom Item Id: ${params} not found`);
        }

        if (this.dataType === 'PP') {
          this.customItemId = params.processingPurposeId;
        }
        if (this.dataType === 'DE') {
          this.customItemId = params.dataElementId;
        }
        if (this.dataType === 'DS') {
          this.customItemId = params.dataSubjectId;
        }
        this.renderData();
      }
    );
  }

  public renderData() {
    if (this._getCustomItemsDetails$) {
      this._getCustomItemsDetails$.unsubscribe();
    }
    let sort = '';
    if (this.request.columnSort) {
      const sortTypeExists =
        this.request.sortType && this.request.sortType.length > 0;

      sort = sortTypeExists
        ? `${this.request.columnSort},${this.request.sortType}`
        : this.request.columnSort;
    }
    if (this.dataType === 'PP') {
      this.getProcessingPurposeDetails({ sort });
    }
    if (this.dataType === 'DE') {
      this.getDataElementDetails({ sort });
    }
    if (this.dataType === 'DS') {
      this.getDataSubjectDetails({ sort });
    }
  }

  private getProcessingPurposeDetails(options) {
    this._getCustomItemsDetails$ = this.processingPurposeDetailsService
      .getProcessingPurposeDetails(
        this.customItemId,
        this.page + this.PAGE_OFFSET_FOR_SERVER,
        this.maxRows,
        options.sort
      )
      .subscribe(
        res => {
          this.customItemData = this.formatCustomItemDetails(res);
          const { businessProcesses } = this.customItemData;
          if (Array.isArray(businessProcesses)) {
            this.tableData = businessProcesses;
            this.totalRows = businessProcesses.length;
          }
          this.updateStageOfHeaderCheckbox();
          this.customItem = res;
        },
        err => {
          // [i18n-tobeinternationalized]
          this.toastService.error('Error fetching processing purpose details');
          // [i18n-tobeinternationalized]
          console.error(
            `Processing purpose id: ${this.customItemId} not found`
          );
        }
      );
  }

  private getDataElementDetails(options) {
    this._getCustomItemsDetails$ = this.dataElementDetailsService
      .getDataElementDetails(
        this.customItemId,
        this.page + this.PAGE_OFFSET_FOR_SERVER,
        this.maxRows,
        options.sort
      )
      .subscribe(
        res => {
          this.customItemData = this.formatCustomItemDetails(res);
          const { businessProcesses } = this.customItemData;
          if (Array.isArray(businessProcesses)) {
            this.tableData = businessProcesses;
            this.totalRows = businessProcesses.length;
          }
          this.updateStageOfHeaderCheckbox();
          this.customItem = res;
        },
        err => {
          // [i18n-tobeinternationalized]
          this.toastService.error('Error fetching data element details');
          // [i18n-tobeinternationalized]
          console.error(`Data element id: ${this.customItemId} not found`);
        }
      );
  }

  private getDataSubjectDetails(options) {
    this._getCustomItemsDetails$ = this.dataSubjectDetailsService
      .getDataSubjectDetails(
        this.customItemId,
        this.page + this.PAGE_OFFSET_FOR_SERVER,
        this.maxRows,
        options.sort
      )
      .subscribe(
        res => {
          this.customItemData = this.formatCustomItemDetails(res);
          const { businessProcesses } = this.customItemData;
          if (Array.isArray(businessProcesses)) {
            this.tableData = businessProcesses;
            this.totalRows = businessProcesses.length;
          }
          this.updateStageOfHeaderCheckbox();
          this.customItem = res;
        },
        err => {
          // [i18n-tobeinternationalized]
          this.toastService.error('Error fetching data subject details');
          // [i18n-tobeinternationalized]
          console.error(`Data subject id: ${this.customItemId} not found`);
        }
      );
  }

  public onChangeMax(event) {
    this.maxRows = event;
    this.renderData();
  }

  public onChangePage(event) {
    this.page = event;
    this.renderData();
  }

  private formatCustomItemDetails(
    details: DataElementServerDetails
  ): DataElementDetailsInterface {
    // Map the business process id to all links to be used when unlinking IT Systems.
    const businessProcesses: BpLinkedInterface[] = details.businessProcesses.map(
      bp => ({
        ...bp,
        linkedRecords: bp.linkedRecords.map(linkedRecord => ({
          ...linkedRecord,
          businessProcessId: bp.id,
          businessProcessName: bp.name
        }))
      })
    );

    return {
      id: details.id,
      name: details.name,
      isCustom: details.custom,
      version: details.version,
      businessProcesses: businessProcesses
    };
  }

  private hideAnotherRowDetails(currentRow) {
    const panels = document.querySelectorAll(
      '.ta-table-row-detail:not(.ta-table-cell-hidden)'
    );
    if (currentRow.stage === 'open') {
      panels.forEach((panel: HTMLElement) => {
        const cell = <HTMLElement>(
          panel.parentNode.querySelector('.ta-table-row .ta-table-cell')
        );
        cell.click();
      });
    }
  }

  public toggleHeaderCB(event) {
    if (this.headerCBIndeterminate) {
      this.headerCBIndeterminate = false;
      // wait a little bit to checkbox finished clicked event
      setTimeout(() => {
        this.headerCBStage = false;
      }, 10);
    } else {
      this.headerCBStage = !this.headerCBStage;
    }

    // toggle checked or unchecked for all rows by status of header checkbox
    this.pageSelectedLinkedRecords = [];
    this.tableData.map(business => {
      business.linkedRecords.map(linked => {
        linked.selected = this.headerCBStage;
        if (linked.selected) {
          this.pageSelectedLinkedRecords.push(linked);
        }
      });
    });
  }

  public onSelectedLinked(e, linked) {
    linked.selected = !linked.selected;
    this.updateStageOfHeaderCheckbox();
  }

  public updateStageOfHeaderCheckbox() {
    // check stage of selected items to set stage for "select all" checkbox
    // and push selected item to service
    this.pageSelectedLinkedRecords = [];
    let totalLinkedRecord = 0;
    this.tableData.map(bp => {
      const businessSelected = bp.linkedRecords.filter(
        linked => linked.selected
      );
      totalLinkedRecord += bp.linkedRecords.length;
      this.pageSelectedLinkedRecords = this.pageSelectedLinkedRecords.concat(
        businessSelected
      );
    });

    this.headerCBIndeterminate =
      this.pageSelectedLinkedRecords.length !== totalLinkedRecord &&
      this.pageSelectedLinkedRecords.length > 0;
    this.headerCBStage =
      this.pageSelectedLinkedRecords.length === totalLinkedRecord;
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

  public unlinkCustomItems(recordLinks: DataElementLinkedInterface[]) {
    const itSystems = recordLinks.filter(
      recordLink => recordLink.type === this.IT_SYSTEM_LINK_TYPE
    );

    const itSystemsGroupedByBusinessProcess: {
      [businessProcessId: string]: DataElementLinkedInterface[];
    } = _.groupBy(itSystems, itSystem => itSystem.businessProcessId);

    const itSystemIdsGroupedByBusinessProcess: ItSystemIdsGroupedByBusinessProcessInterface[] = _.reduce(
      itSystemsGroupedByBusinessProcess,
      (
        result: any[],
        linkedItSystems: DataElementLinkedInterface[],
        businessProcessId: string
      ) => {
        result.push({
          businessProcessId: businessProcessId,
          itSystemIds: linkedItSystems.map(linkedItSystem => linkedItSystem.id)
        });
        return result;
      },
      []
    );

    const elementToUnlinkDisplayValue = itSystemIdsGroupedByBusinessProcess.map(
      (elem: ItSystemIdsGroupedByBusinessProcessInterface) => {
        const bp = recordLinks.find(
          x => x.businessProcessId === elem.businessProcessId
        );

        const itNames = elem.itSystemIds.map(
          id => itSystems.find(x => x.id === id).name
        );

        const bpName = bp.name;

        const hasStep6 = recordLinks.find(
          x =>
            x.businessProcessId === elem.businessProcessId &&
            x.type === 'STEP_6'
        );

        return `${bpName} (${hasStep6 ? 'Step 6, ' : ''}${itNames.join(', ')})`;
      }
    );

    const modalRef = this.modalService.open(
      ConfirmUnlinkDataElementCategoriesComponent,
      {
        windowClass: 'unlink-modal',
        centered: true
      }
    );

    const confirmUnlinkComponent: ConfirmUnlinkDataElementCategoriesComponent =
      modalRef.componentInstance;

    confirmUnlinkComponent.unlink = () =>
      this.createUnlinkObservable(recordLinks);

    confirmUnlinkComponent.redButton = true;
    confirmUnlinkComponent.items = elementToUnlinkDisplayValue;
    confirmUnlinkComponent.contentStart = this.getUnlinkMessageStartByDataType(
      this.dataType
    );
    confirmUnlinkComponent.contentEnd = this.getUnlinkMessageEndByDataType(
      this.dataType
    );

    modalRef.result.then(
      result => {
        const message = this.getUnlinkSuccessMessageByDataType();
        this.toastService.success(message);
        this.renderData();
      },
      err => {
        if (err !== 'Cancel') {
          const message =
            err.message || this.getUnlinkErrorMessageByDataType(this.dataType);
          this.toastService.error(message);
        }
      }
    );
  }

  private getUnlinkMessageStartByDataType(type) {
    // "Switch-case" for consistency, if we need to change based on type later
    switch (type) {
      case 'PP':
        // [i18n-tobeinternationalized]
        return 'Are you sure you want to unlink ';
      case 'DE':
        // [i18n-tobeinternationalized]
        return 'Are you sure you want to unlink ';
      case 'DS':
        // [i18n-tobeinternationalized]
        return 'Are you sure you want to unlink ';
      default:
        console.error('Unsupported data type');
        return 'Are you sure you want to unlink ';
    }
  }

  private getUnlinkMessageEndByDataType(type) {
    switch (type) {
      case 'PP':
        // [i18n-tobeinternationalized]
        return ' processing purpose(s) from the selected business process records?';
      case 'DE':
        // [i18n-tobeinternationalized]
        return ' data element(s) from the selected business process records?';
      case 'DS':
        // [i18n-tobeinternationalized]
        return ' data subject(s) from the selected business process records?';
      default:
        console.error('Unsupported data type');
        return ' item(s) from the selected business process records?';
    }
  }

  private getUnlinkSuccessMessageByDataType() {
    return `We’re in the process of unlinking your records and will notify when we’re done!`;
  }

  private getUnlinkErrorMessageByDataType(type) {
    switch (type) {
      case 'PP':
        // [i18n-tobeinternationalized]
        return 'There was a problem while trying to unlink processing purpose';
      case 'DE':
        // [i18n-tobeinternationalized]
        return 'There was a problem while trying to unlink data element';
      case 'DS':
        // [i18n-tobeinternationalized]
        return 'There was a problem while trying to unlink data subject';
      default:
        console.error('Unsupported data type');
        return 'There was a problem while trying to unlink item';
    }
  }

  public createUnlinkObservable(
    recordLinks: CustomItemLinkedInterface[]
  ): Observable<void> {
    const bps = recordLinks.filter(
      recordLink =>
        recordLink.type === this.BUSINESS_PROCESS_LINK_TYPE_STEP_6 ||
        recordLink.type === this.BUSINESS_PROCESS_LINK_TYPE_STEP_3_4
    );
    const bpIds = bps.map(bp => bp.id);

    const itSystems = recordLinks.filter(
      recordLink => recordLink.type === this.IT_SYSTEM_LINK_TYPE
    );

    const itSystemsGroupedByBusinessProcess: {
      [businessProcessId: string]: CustomItemLinkedInterface[];
    } = _.groupBy(itSystems, itSystem => itSystem.businessProcessId);

    const itSystemIdsGroupedByBusinessProcess: ItSystemIdsGroupedByBusinessProcessInterface[] = _.reduce(
      itSystemsGroupedByBusinessProcess,
      (
        result: any[],
        linkedItSystems: CustomItemLinkedInterface[],
        businessProcessId: string
      ) => {
        result.push({
          businessProcessId: businessProcessId,
          itSystemIds: linkedItSystems.map(linkedItSystem => linkedItSystem.id)
        });
        return result;
      },
      []
    );

    if (this.dataType === 'PP') {
      return concat(
        this.processingPurposeDetailsService.unlinkDataElementFromBusinessProcesses(
          this.customItemId,
          bpIds
        ),
        this.processingPurposeDetailsService.unlinkDataElementFromItSystems(
          this.customItemId,
          itSystemIdsGroupedByBusinessProcess
        )
      );
    } else if (this.dataType === 'DE') {
      return concat(
        this.dataElementDetailsService.unlinkDataElementFromBusinessProcesses(
          this.customItemId,
          bpIds
        ),
        this.dataElementDetailsService.unlinkDataElementFromItSystems(
          this.customItemId,
          itSystemIdsGroupedByBusinessProcess
        )
      );
    } else if (this.dataType === 'DS') {
      return concat(
        this.dataSubjectDetailsService.unlinkDataSubjectFromBusinessProcesses(
          this.customItemId,
          bpIds
        ),
        this.dataSubjectDetailsService.unlinkDataSubjectFromItSystems(
          this.customItemId,
          itSystemIdsGroupedByBusinessProcess
        )
      );
    }
  }
}
