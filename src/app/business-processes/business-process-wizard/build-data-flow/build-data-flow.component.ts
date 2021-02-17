import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaModal, ToastService } from '@trustarc/ui-toolkit';
import { BUSINESS_PROCESS_NAVIGATION } from 'src/app/shared/_constant';
import { DataFlowTableType, DataFlowView } from 'src/app/app.constants';
import {
  DataFlowControllerService,
  FeatureFlagControllerService
} from 'src/app/shared/_services/rest-api';

import { FlowChartTypesEnum } from 'src/app/shared/_enums';

import { CreateBusinessProcessesService } from 'src/app/business-processes/create-bp/create-business-processes.service';
import {
  ItSystemNode,
  SendsDataTransfersInterface,
  ReceivesDataTransfersInterface,
  DataFlowViewInterface,
  ItSystemDetailsNode,
  DataSubjectNode,
  DataRecipientNode,
  DataTransferNode,
  NodeDetailsData,
  DataTransferUpdateData,
  TransferEntity,
  DataItemLocationInterface,
  DataTransferFromChart
} from 'src/app/shared/_interfaces/rest-api';

import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { Subscription, timer } from 'rxjs';
import { UtilsClass } from 'src/app/shared/_classes';
import { DataFlowService } from 'src/app/shared/_services/data-flow/data-flow.service';
import { DATA_FLOW_CONSTANTS } from 'src/app/shared/_constant';

import { DataFlowChartInterface } from 'projects/rhea-ui-library/src/lib/interfaces';
import { DataItemInterface } from 'src/app/shared/components/location-modal-content/location-modal-content.model';

declare const _: any;

@AutoUnsubscribe([
  '_dataFlowItSystemsNodes$',
  '_bpId$',
  '_loadFeatureFlags$',
  '_dataFlowDetails$',
  '_dataTransferUpdatedData$'
])
@Component({
  selector: 'ta-build-data-flow',
  templateUrl: './build-data-flow.component.html',
  styleUrls: ['./build-data-flow.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BuildDataFlowNewUiComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('detailsModal') public detailsModal: ElementRef;

  public readonly businessProcessNavigation = BUSINESS_PROCESS_NAVIGATION;
  public readonly dataFlowView = DataFlowView;
  public selectedItem: ItSystemNode | DataFlowViewInterface;
  public nextItem: ItSystemNode | DataFlowViewInterface;
  public businessProcessId: string;
  public isStandardView: boolean;
  public isEmptyView: boolean;
  public isSaving: boolean;
  public itSystemNodes: ItSystemNode[];
  public isAnySystemMapped: boolean;
  public searchTerm = '';
  public views: DataFlowViewInterface[] = [];
  public isFilterDirty: boolean;
  public isTransferTableDirty: boolean;
  public filtersFormValue = {
    filterSort: { id: 'nameAsc' },
    filterDataElements: [],
    filterDataSubjects: [],
    filterHostingLocations: [],
    filterProcessingPurposes: [],
    filterOwner: []
  };

  public selectedSystemSendingTransfers: SendsDataTransfersInterface;
  public selectedSystemReceivingTransfers: ReceivesDataTransfersInterface;
  public isLoading: boolean;
  public isInitialFetchDone: boolean;
  public selectedTabId: string;
  public nextTabId: string;
  public dataTransferData: NodeDetailsData;
  public foundForUpdate: TransferEntity;
  public dataForUpdate: DataTransferUpdateData;
  public selectedSystemSendingTransfersInitialState: SendsDataTransfersInterface;
  public selectedSystemReceivingTransfersInitialState: ReceivesDataTransfersInterface;
  public isSearchVisible: boolean;

  private _dataFlowItSystemsNodes$: Subscription;
  private _dataFlowTransfersSending$: Subscription;
  private _dataFlowTransfersReceiving$: Subscription;
  private _loadFeatureFlags$: Subscription;
  private _bpId$: Subscription;
  private _dataTransferUpdatedData$: Subscription;
  private thereIsNewDataForSelectedSystem: boolean;

  /**
   * CONFIRM MODALS PROPERTIES
   */
  @ViewChild('modalConfirmation') modalConfirmation: ElementRef;
  @ViewChild('modalConfirmationChanges') modalConfirmationChanges: ElementRef;
  public confirmModalTitle: string;
  public confirmModalDescription: string;
  public confirmModalType: string;
  public confirmModalIcon: string;
  public confirmModalLabelCancel: string;
  public confirmModalLabelDiscard: string;
  public confirmModalLabelConfirm: string;
  public confirmModalFunction: any;

  public detailsNode: DataRecipientNode | ItSystemDetailsNode | DataSubjectNode;
  public _dataFlowDetails$: Subscription;

  public dataFlowChart: DataFlowChartInterface;
  public updatedDataFlowChart: boolean;

  constructor(
    private router: Router,
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private featureFlagControllerService: FeatureFlagControllerService,
    private dataFlowControllerService: DataFlowControllerService,
    private activatedRoute: ActivatedRoute,
    private taModal: TaModal,
    private dataFlowService: DataFlowService,
    private toastService: ToastService
  ) {
    this.isStandardView = true;
    this.isSaving = false;
    this.updatedDataFlowChart = false;
    this._bpId$ = this.activatedRoute.parent.params.subscribe(params => {
      this.businessProcessId = params.id;
    });

    // [i18n-tobeinternationalized]
    this.views = [
      {
        id: 'flowchart',
        type: 'FLOWCHART',
        label: 'Flowchart View',
        icon: 'Icon', // Temporary
        disabled: false,
        show: true
      },
      {
        id: 'mapview',
        type: 'MAP',
        label: 'Map View',
        icon: 'Icon', // Temporary
        disabled: false,
        show: !UtilsClass.isIE()
      }
    ];
    this.selectedItem = this.views[0];
    this.thereIsNewDataForSelectedSystem = false;
    this.isSearchVisible = false;
  }

  ngOnInit() {
    this.initView();
    this.initData();
    this.subscribeToDataTransfersModalChanges();
    this.getDataFlowMap(true);
  }

  ngAfterViewInit() {
    // this.verifyLicense();
  }

  public verifyLicense() {
    UtilsClass.unSubscribe(this._loadFeatureFlags$);
    this.featureFlagControllerService.getAllFeatureFlags().subscribe(
      allLicenses => {
        if (allLicenses.RHEA_NEW_UI_STEPS_5_LICENSE === false) {
          this.navigate('data-flow');
        }
      },
      err => console.error(err)
    );
  }

  public toggleStandardView() {
    this.isStandardView = !this.isStandardView;
  }

  public onStepClick(event) {
    if (this.isTransferTableDirty) {
      this.openDestroyConfirmModal('navigate', event);
    } else {
      this.navigate(event);
    }
  }

  public navigate(url: string) {
    if (url === 'cancel' || url === 'home') {
      this.router.navigateByUrl('/business-process');
    } else {
      const currentUrl = _.last(this.router.url.split('/'));
      this.router
        .navigate([this.router.url.replace(currentUrl, url)])
        .then(() => {
          this.createBusinessProcessesService.setSelectedStep(url);
        });
    }
  }

  public initView() {
    const view = this.createBusinessProcessesService.getDataFlowView();
    if (view) {
      this.selectedItem = this.views.find(v => v.type === view);
      this.createBusinessProcessesService.resetDataFlowView();
    }
  }

  public onViewUpdated(view) {
    const item = this.views.find(v => v.type === view);

    if (this.isTransferTableDirty) {
      this.nextItem = item;
      this.openConfirmModal();
    } else {
      this.selectedItem = item;
    }
  }

  public initData() {
    this.foundForUpdate = null;
    this.dataForUpdate = null;
    this.getItSystemNodesByBusinessProcessId(this.businessProcessId);
  }

  public getItSystemNodesByBusinessProcessId(bpId) {
    UtilsClass.unSubscribe(this._dataFlowItSystemsNodes$);

    const payload = this.buildRequestPayload();
    this._dataFlowItSystemsNodes$ = this.dataFlowControllerService
      .findItSystemNodes(bpId, payload)
      .subscribe(
        itSystemNodes => {
          this.isEmptyView =
            itSystemNodes.length === 0 &&
            !this.isFilterDirty &&
            !this.searchTerm;
          this.itSystemNodes = _.sortBy(itSystemNodes, 'name');
          this.isAnySystemMapped = this.itSystemNodes.some(
            system => system.mapped
          );
          this.isInitialFetchDone = true;
        },
        err => {
          console.error(err);
        }
      );
  }

  private buildRequestPayload() {
    return {
      sortId: this.filtersFormValue.filterSort.id || 'nameAsc',
      searchText: this.searchTerm,
      dataElementIds: this.getFiltersIdsByProperty(
        this.filtersFormValue,
        'filterDataElements'
      ),
      dataSubjectIds: this.getFiltersIdsByProperty(
        this.filtersFormValue,
        'filterDataSubjects'
      ),
      locationIds: this.getFiltersIdsByProperty(
        this.filtersFormValue,
        'filterHostingLocations'
      ),
      ownerTypeIds: this.getFiltersIdsByProperty(
        this.filtersFormValue,
        'filterOwner'
      ),
      processingPurposeIds: this.getFiltersIdsByProperty(
        this.filtersFormValue,
        'filterProcessingPurposes'
      )
    };
  }

  private getFiltersIdsByProperty(
    data,
    prop,
    fieldFilter = 'checked',
    fieldId = 'id'
  ) {
    return data[prop]
      .filter(item => item[fieldFilter] === true)
      .map(item => item[fieldId]);
  }

  private async changeSelectedItem() {
    if (!this.nextItem) {
      return;
    }
    this.selectedItem = this.nextItem;
    if (this.selectedItem.nodeId) {
      this.getTransfersData();
    }
    if (this.updatedDataFlowChart) {
      await this.getDataFlowMap();
    }
  }

  public handleShowDetailsNonGraph(nodeInfo: NodeDetailsData) {
    this.dataTransferData = nodeInfo;
    this.openDetailsNodeModal();
  }

  public handleShowDetails(nodeInfo: DataTransferFromChart): void {
    UtilsClass.unSubscribe(this._dataFlowDetails$);
    switch (nodeInfo.type) {
      case FlowChartTypesEnum.ItSystem:
        this.loadDataFlowItSystemDetails(nodeInfo);
        break;
      case FlowChartTypesEnum.DataSubject:
        this.loadDataFlowDataSubjectDetails(nodeInfo);
        break;
      case FlowChartTypesEnum.DataRecipient:
        this.loadDataFlowDataRecipientDetails(nodeInfo);
        break;
      case FlowChartTypesEnum.DataTransfer:
        this.loadDataTransferDetails(nodeInfo.bpId, nodeInfo.edgeBlockId);
        break;
      default:
        break;
    }
  }

  public handleCloseModal(): void {
    this.dataTransferData = null;
    this.taModal.dismissAll();
  }

  public toggleSearchVisible() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  private openDetailsNodeModal(): void {
    this.taModal.open(this.detailsModal, {
      windowClass: 'ta-modal-details-data-flow',
      backdrop: 'static',
      keyboard: true,
      size: 'md'
    });
  }

  private loadDataFlowItSystemDetails(node: DataTransferFromChart): void {
    this.dataFlowService.seDetailsNodeModalLoading(true);
    this.openDetailsNodeModal();
    this._dataFlowDetails$ = this.dataFlowControllerService
      .getItSystemNodeDetails(node.bpId, node.edgeBlockId)
      .subscribe(
        details => {
          this.dataFlowService.setDetailsNode({
            node: details,
            title: 'System Details',
            type: FlowChartTypesEnum.ItSystem,
            systemId: node.systemId
          });
          this.dataFlowService.seDetailsNodeModalLoading(false);
        },
        err => {
          console.error(err);
        }
      );
  }

  private loadDataFlowDataSubjectDetails(node: DataTransferFromChart): void {
    this.openDetailsNodeModal();
    this.dataFlowService.seDetailsNodeModalLoading(true);
    this._dataFlowDetails$ = this.dataFlowControllerService
      .getDataSubjectNodeDetails(node.bpId, node.edgeBlockId)
      .subscribe(
        details => {
          this.dataFlowService.setDetailsNode({
            node: details,
            title: 'Data Subject Details',
            type: FlowChartTypesEnum.DataSubject,
            systemId: node.systemId
          });
          this.dataFlowService.seDetailsNodeModalLoading(false);
        },
        err => {
          console.error(err);
        }
      );
  }

  private loadDataFlowDataRecipientDetails(node: DataTransferFromChart): void {
    this.openDetailsNodeModal();
    this.dataFlowService.seDetailsNodeModalLoading(true);
    this._dataFlowDetails$ = this.dataFlowControllerService
      .getDataRecipientNodeDetails(node.bpId, node.edgeBlockId)
      .subscribe(
        details => {
          this.dataFlowService.setDetailsNode({
            node: details,
            title: 'Data Recipient Details',
            type: FlowChartTypesEnum.DataSubject,
            systemId: node.systemId
          });
          this.dataFlowService.seDetailsNodeModalLoading(false);
        },
        err => {
          console.error(err);
        }
      );
  }

  private loadDataTransferDetails(bpId: string, edgeBlockId: string): void {
    this.openDetailsNodeModal();
    this.dataFlowService.seDetailsNodeModalLoading(true);
    this._dataFlowDetails$ = this.dataFlowControllerService
      .getDataTransferDetails(bpId, edgeBlockId)
      .subscribe(
        details => {
          const isSystemToSystem =
            !_.isNull(details.sourceItSystem) &&
            !_.isNull(details.targetItSystem);

          this.dataFlowService.setDetailsNode({
            node: {
              name: this.getDataTransferName(details),
              locations: details.dataTransfer.locations
                ? details.dataTransfer.locations
                : [],
              dataElements: details.dataTransfer.dataElements,
              processingPurposes: details.dataTransfer.processingPurposes
            },
            title: 'View Connection Details',
            type: FlowChartTypesEnum.DataTransfer,
            isSystemToSystem
          });
          this.dataFlowService.seDetailsNodeModalLoading(false);
        },
        err => {
          console.error(err);
        }
      );
  }

  public handleSelection(event) {
    this.nextItem = event;
    if (this.isTransferTableDirty) {
      this.openConfirmModal();
    } else {
      this.selectedTabId = 'sends';
      this.changeSelectedItem();
    }
  }

  public async getDataFlowMap(init?: boolean): Promise<void> {
    this.dataFlowChart = null;

    try {
      if (!init || this.updatedDataFlowChart) {
        await timer(300).toPromise(); // Wait for BE to process dataflow
      }

      this.dataFlowChart = await this.dataFlowControllerService
        .getDataFlowMap(this.businessProcessId)
        .toPromise();

      this.updatedDataFlowChart = false;
    } catch (error) {
      this.errorHandler();
    }
  }

  public changeTab() {
    this.selectedTabId = this.nextTabId;
    this.getTransfersData();
    this.thereIsNewDataForSelectedSystem = false;
  }

  public handleTabChange(event) {
    this.nextTabId = event.nextId;
    if (this.isTransferTableDirty) {
      event.preventDefault();
      this.openConfirmModal();
    } else {
      this.changeTab();
    }
  }

  public openDestroyConfirmModal(method: string, target: string | MouseEvent) {
    const confirmModalFunction = {
      method,
      target
    };
    this.openConfirmModal(confirmModalFunction);
  }

  public openConfirmModal(confirmModalFunction = null) {
    this.confirmModalFunction = confirmModalFunction;
    // [i18n-tobeinternationalized]
    this.confirmModalTitle = 'Do you want to save changes?';
    this.confirmModalDescription = ``;
    this.confirmModalType = 'question';
    this.confirmModalIcon = 'help';
    // [i18n-tobeinternationalized]
    this.confirmModalLabelCancel = 'No';
    // [i18n-tobeinternationalized]
    this.confirmModalLabelConfirm = 'Yes';
    this.openModal(this.modalConfirmation);
  }

  public openModal(modal) {
    this.toastService.clear();

    this.taModal.open(modal, {
      windowClass: 'ta-modal-confirmation',
      backdrop: 'static',
      keyboard: true,
      size: 'sm'
    });
  }

  public handleEditDataTransfer(dataTransferId: string): void {
    const dataTransfer = this.itSystemNodes.find(
      itSystem => itSystem.entityId === dataTransferId
    );
    this.handleSelection(dataTransfer);
    this.handleCloseModal();
  }

  private getTransfersData() {
    if (this.selectedTabId === 'receives') {
      this.getTransfersReceivesFromSystem();
    } else {
      this.getTransfersSendingToSystem();
    }
    this.isTransferTableDirty = false;
  }

  private getTransfersReceivesFromSystem() {
    UtilsClass.unSubscribe(this._dataFlowTransfersReceiving$);

    this.isLoading = true;

    this._dataFlowTransfersReceiving$ = this.dataFlowControllerService
      .getTransfersReceivingFromSystem(
        this.businessProcessId,
        this.selectedItem.nodeId
      )
      .subscribe(
        transfers => {
          this.isLoading = false;
          this.selectedSystemReceivingTransfers = this.addUniqueIds(transfers);
          this.setInitialStateForDataTransfers('receiving');
        },
        err => {
          this.isLoading = false;
          console.error(err);
        }
      );
  }

  private addUniqueIds(transfers) {
    Object.keys(transfers).forEach(key => {
      transfers[key].forEach(transferRecord => {
        transferRecord.uniqueId = _.uniqueId(`${key}_`);
      });
    });
    return transfers;
  }

  private getTransfersSendingToSystem() {
    UtilsClass.unSubscribe(this._dataFlowTransfersSending$);

    this.isLoading = true;

    this._dataFlowTransfersSending$ = this.dataFlowControllerService
      .getTransfersSendingToSystem(
        this.businessProcessId,
        this.selectedItem.nodeId
      )
      .subscribe(
        transfers => {
          this.isLoading = false;
          this.selectedSystemSendingTransfers = this.addUniqueIds(transfers);
          this.setInitialStateForDataTransfers('sending');
        },
        err => {
          this.isLoading = false;
          console.error(err);
        }
      );
  }

  public saveDataTransfer(isModalConfirmation = false) {
    if (this.thereIsNewDataForSelectedSystem && !isModalConfirmation) {
      this.openChangesConfirmation();
    } else {
      if (this.selectedTabId === 'receives') {
        this.saveTransfersReceivingToSystem();
      } else {
        this.saveTransfersSendingToSystem();
      }
    }
    if (isModalConfirmation) {
      this.thereIsNewDataForSelectedSystem = false;
      this.closeAllModals(true);
    }
  }

  public async closeAllModals(fromDetails = false) {
    if (this.taModal.hasOpenModals) {
      this.isSaving = false;
      this.taModal.dismissAll();
    }
    if (this.confirmModalFunction) {
      this.navigate(this.confirmModalFunction.target);
    }
    if (this.nextTabId && this.selectedTabId !== this.nextTabId) {
      this.changeTab();
    }
    if (this.nextItem && this.selectedItem !== this.nextItem) {
      this.isTransferTableDirty = false;
      this.selectedTabId = 'sends';
      this.changeSelectedItem();
    }

    if (!fromDetails) {
      this.isTransferTableDirty = false;
      this.setInitialStateForDataTransfers('sending');
      this.setInitialStateForDataTransfers('receiving');
    }
  }

  public cancelChanges() {
    this.getTransfersData();
  }

  private saveTransfersSendingToSystem() {
    this.isSaving = true;
    this.dataFlowControllerService
      .saveTransfersSendingToSystem(
        this.businessProcessId,
        this.selectedItem.nodeId,
        this.selectedSystemSendingTransfers
      )
      .subscribe(async (response: SendsDataTransfersInterface) => {
        this.selectedSystemSendingTransfers = this.addUniqueIds(response);
        this.setInitialStateForDataTransfers('sending');
        this.isSaving = false;
        this.updatedDataFlowChart = true;

        if (this.nextItem.type === this.dataFlowView.FLOWCHART) {
          await this.getDataFlowMap();
        }

        this.successHandler();
      }, this.errorHandler.bind(this));
  }

  private saveTransfersReceivingToSystem() {
    this.isSaving = true;
    this.dataFlowControllerService
      .saveTransfersReceivingToSystem(
        this.businessProcessId,
        this.selectedItem.nodeId,
        this.selectedSystemReceivingTransfers
      )
      .subscribe(async (response: ReceivesDataTransfersInterface) => {
        this.selectedSystemReceivingTransfers = this.addUniqueIds(response);
        this.setInitialStateForDataTransfers('receiving');
        this.isSaving = false;
        this.updatedDataFlowChart = true;

        if (this.nextItem.type === this.dataFlowView.FLOWCHART) {
          await this.getDataFlowMap();
        }

        this.successHandler();
      }, this.errorHandler.bind(this));
  }

  private successHandler() {
    this.toastService.clear();
    this.toastService.success(
      // [i18n-tobeinternationalized]
      'Data Transfers have been successfully updated.',
      null,
      5000
    );
    this.isTransferTableDirty = false;
    this.closeAllModals();
    if (this.nextItem && this.selectedItem !== this.nextItem) {
      this.selectedTabId = 'sends';
    }
    this.getItSystemNodesByBusinessProcessId(this.businessProcessId);
  }

  private errorHandler(errorMessage?) {
    const message = errorMessage
      ? errorMessage
      : // [i18n-tobeinternationalized]
        'Error updating record.';

    this.toastService.clear();
    this.toastService.error(message, null, 5000);
    this.isSaving = false;
    this.isLoading = false;
  }

  public markTableAsDirty() {
    const isReceivingDifferent = _.isEqual(
      this.selectedSystemReceivingTransfers,
      this.selectedSystemReceivingTransfersInitialState
    );

    const isSendingDifferent = _.isEqual(
      this.selectedSystemSendingTransfers,
      this.selectedSystemSendingTransfersInitialState
    );

    if (!isReceivingDifferent || !isSendingDifferent) {
      this.isTransferTableDirty = true;
    } else {
      this.isTransferTableDirty = false;
    }
  }

  public handleSearchUpdated(event) {
    this.searchTerm = event;
    this.getItSystemNodesByBusinessProcessId(this.businessProcessId);
  }

  public handleFiltersApplied(event) {
    this.filtersFormValue = event;

    const sortingKey = 'filterSort';
    const filterKeys = [
      'filterOwner',
      'filterDataSubjects',
      'filterDataElements',
      'filterProcessingPurposes',
      'filterHostingLocations'
    ];

    this.isFilterDirty = this.determineIsFilterDirty(
      sortingKey,
      filterKeys,
      'checked'
    );

    this.getItSystemNodesByBusinessProcessId(this.businessProcessId);
  }

  public updateDataTransfer(): void {
    Object.keys(this.dataForUpdate.data).forEach(key => {
      if (this.foundForUpdate.hasOwnProperty(key)) {
        this.foundForUpdate[key] = this.dataForUpdate.data[key];
      }
    });

    this.dataForUpdate = null;
    this.dataForUpdate = null;
    this.closeAllModals(true);
  }

  private determineIsFilterDirty(
    sortingKey: string,
    filterKeys: string[],
    filterField: string,
    ignoreSorting = true
  ) {
    // Check sorting if needed
    if (!ignoreSorting) {
      const sortingArray = ['nameAsc', 'nameDesc'];
      if (sortingArray.includes(this.filtersFormValue[sortingKey].id)) {
        return true;
      }
    }

    // Check filters
    return (
      filterKeys.findIndex(key => {
        return this.filtersFormValue[key].some(
          item => item[filterField] === true
        );
      }) !== -1
    );
  }

  private getDataTransferName(dataTransfer: DataTransferNode): string {
    if (dataTransfer.sourceDataSubject) {
      return `Data Subject ${dataTransfer.sourceDataSubject.name} sends to System ${dataTransfer.targetItSystem.name}`;
    }

    if (dataTransfer.sourceItSystem && dataTransfer.targetItSystem) {
      return `System ${dataTransfer.sourceItSystem.name}
      (${dataTransfer.sourceItSystem.location.code3})
      sends to System ${dataTransfer.targetItSystem.name}
      (${dataTransfer.targetItSystem.location.code3})`;
    }

    if (dataTransfer.sourceItSystem && dataTransfer.targetDataRecipient) {
      return `System ${dataTransfer.sourceItSystem.name} sends to Data Recipient ${dataTransfer.targetDataRecipient.name}`;
    }
  }

  private subscribeToDataTransfersModalChanges(): void {
    this._dataTransferUpdatedData$ = this.dataFlowService._dataTransferUpdateData$.subscribe(
      data => {
        this.searchAndUpdateNode(data);
      }
    );
  }

  private searchAndUpdateNode(data: DataTransferUpdateData): void {
    let found = null;
    const systemEntities = this.collectAllEntitiesInSystem();
    if (this.taModal.hasOpenModals) {
      this.isSaving = false;
      this.taModal.dismissAll();
    }
    if (data.direction === 'receiving') {
      const propInData =
        data.type === DataFlowTableType.DATA_RECIPIENT
          ? 'dataRecipientTransfers'
          : 'itSystemTransfers';
      found = this.selectedSystemReceivingTransfers[propInData].find(
        item => item.uniqueId === data.id
      );
    }

    if (data.direction === 'sending') {
      const propInData =
        data.type === DataFlowTableType.DATA_SUBJECT
          ? 'dataSubjectTransfers'
          : 'itSystemTransfers';
      found = this.selectedSystemSendingTransfers[propInData].find(
        item => item.uniqueId === data.id
      );
    }

    if (found) {
      Object.keys(data.data).forEach(key => {
        if (key !== DATA_FLOW_CONSTANTS.locationsKey) {
          this.thereIsNewDataForSelectedSystem =
            this.thereIsNewDataForSelectedSystem === true
              ? true
              : this.thereIsNewData(systemEntities[key], data.data[key]);
        }
      });

      this.foundForUpdate = found;
      this.dataForUpdate = data;

      this.updateDataTransfer();

      this.isTransferTableDirty = true;
    }
    this.dataTransferData = null;
  }

  private thereIsNewData(sourceData, newData): boolean {
    let thereIsNew = false;
    newData.forEach(newElement => {
      const foundInExistingData = sourceData.find(
        sourceElement => sourceElement.id === newElement.id
      );
      if (!foundInExistingData) {
        thereIsNew = true;
      }
    });

    return thereIsNew;
  }

  private openChangesConfirmation(): void {
    // [i18n-tobeinternationalized]
    this.confirmModalTitle = `You've selected additional data that is not on the system record.`;
    // [i18n-tobeinternationalized]
    this.confirmModalDescription = `Do you want to update your system record to include this data?`;
    // [i18n-tobeinternationalized]
    this.confirmModalType = 'question';
    // [i18n-tobeinternationalized]
    this.confirmModalIcon = 'help';
    // [i18n-tobeinternationalized]
    this.confirmModalLabelCancel = 'cancel';
    // [i18n-tobeinternationalized]
    this.confirmModalLabelConfirm = 'Update record';
    this.openModal(this.modalConfirmationChanges);
  }

  private collectAllEntitiesInSystem(): {
    dataElements: DataItemInterface[];
    locations: DataItemLocationInterface[];
    processingPurposes: DataItemInterface[];
  } {
    const allEntities = {
      dataElements: [],
      processingPurposes: [],
      locations: []
    };

    Object.keys(allEntities).forEach(key => {
      this.selectedSystemSendingTransfers.dataSubjectTransfers.forEach(
        dataSubjectItem => {
          if (dataSubjectItem.hasOwnProperty(key)) {
            allEntities[key] = [...allEntities[key], ...dataSubjectItem[key]];
          }
        }
      );
      this.selectedSystemSendingTransfers.itSystemTransfers.forEach(
        itSystemItem => {
          if (itSystemItem.hasOwnProperty(key)) {
            allEntities[key] = [...allEntities[key], ...itSystemItem[key]];
          }
        }
      );
      if (this.selectedSystemReceivingTransfers) {
        this.selectedSystemReceivingTransfers.dataRecipientTransfers.forEach(
          dataRecipientItem => {
            if (dataRecipientItem.hasOwnProperty(key)) {
              allEntities[key] = [
                ...allEntities[key],
                ...dataRecipientItem[key]
              ];
            }
          }
        );
        this.selectedSystemReceivingTransfers.itSystemTransfers.forEach(
          itSystemItem => {
            if (itSystemItem.hasOwnProperty(key)) {
              allEntities[key] = [...allEntities[key], ...itSystemItem[key]];
            }
          }
        );
      }
    });

    return allEntities;
  }

  private setInitialStateForDataTransfers(type: string): void {
    if (type === 'receiving') {
      this.selectedSystemReceivingTransfersInitialState = _.cloneDeep(
        this.selectedSystemReceivingTransfers
      );
    } else {
      this.selectedSystemSendingTransfersInitialState = _.cloneDeep(
        this.selectedSystemSendingTransfers
      );
    }
  }

  ngOnDestroy() {}
}
