import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ToastService } from '@trustarc/ui-toolkit';
import { exists } from 'src/app/shared/utils/basic-utils';

import { getRouteParamObservable } from 'src/app/shared/utils/route-utils';

import { GlobalRegionInterface } from 'src/app/shared/models/location.model';

import { ItSystemsCategoryInterface } from '../create-business-processes.model';
import { FlowChartService } from './flow-chart.service';
import { LocationService } from 'src/app/shared/services/location/location.service';
import { CreateBusinessProcessesService } from '../create-business-processes.service';
import { StepContainerService } from '../step-container/step-container.service';
import { DataElementsService } from 'src/app/shared/services/data-elements/data-elements.service';
import { DataSubjectsRecipientsService } from 'src/app/shared/services/data-subjects-recipients/data-subjects-recipients.service';
import { DataFlowService } from './buld-data-flow.service';
import { ProcessingPurposesService } from 'src/app/shared/services/processing-purposes/processing-purposes.service';
import { ThirdPartyType } from 'src/app/app.constants';
import { DataFlowPopoverComponent } from './data-flow-popover/data-flow-popover.component';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { InitialItemClass } from './initial-item.class';
import { BUSINESS_PROCESS_NAVIGATION } from 'src/app/shared/_constant';
import { BusinessProcessService } from 'src/app/shared/services/business-process/business-process.service';
import { FeatureFlagAllInterface } from 'src/app/shared/_interfaces/rest-api';
import { DataInterface } from 'src/app/shared/components/categorical-management/categorical-management.component';
import { BaseCategoryInterface } from 'src/app/shared/components/categorical-view/base-category.model';
import { ProcessingPurposeInterface } from 'src/app/shared/models/processing-purposes.model';
import { FeatureFlagControllerService } from '../../../shared/_services/rest-api';

declare const _: any;

@AutoUnsubscribe(['_paramMap$', '_processingPurposes$', '_dataElements$'])
@Component({
  selector: 'ta-build-data-flow',
  templateUrl: './build-data-flow.component.html',
  styleUrls: ['./build-data-flow.component.scss']
})
export class BuildDataFlowComponent implements OnInit, OnDestroy {
  public readonly businessProcessNavigation = BUSINESS_PROCESS_NAVIGATION;
  public hasRHEA_NEW_UI_STEPS_34_LICENSE = false;
  public hasRHEA_NEW_UI_STEPS_12_LICENSE = false;
  public itSystems: ItSystemsCategoryInterface[] = [];
  public selectedItSystem: ItSystemsCategoryInterface;
  public currentItSystemIndex = 0;
  public isFinishLoadITs = false;
  public isFetching = false;
  public dataFlow: any;
  public locations = [];
  public fullCountryList: GlobalRegionInterface[];
  public locationDatas: GlobalRegionInterface[];
  public recieveFromOptions: any;
  public receivingSelectedOptions: any[] = [];
  public sendingSelectedOptions: any[] = [];
  public dataElementCategories: any[] = [];
  public processingPurposes: any[] = [];

  public dataRecipients: any[] = [];
  private bpId: string;
  private _paramMap$: Subscription;
  private _processingPurposes$: Subscription;
  private _dataElements$: Subscription;
  public dropdownsOpen = { receiving: false, sending: false };
  public isDeleting = false;
  public popoverData = null;
  public licenses: FeatureFlagAllInterface = {};
  public record = {};

  @ViewChild('popover') popover: DataFlowPopoverComponent;

  constructor(
    private businessProcessService: BusinessProcessService,
    private featureFlagControllerService: FeatureFlagControllerService,
    private toastService: ToastService,
    private stepContainerService: StepContainerService,
    private locationService: LocationService,
    private flowChartService: FlowChartService,
    private dataFlowService: DataFlowService,
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private dataElementsService: DataElementsService,
    private processingPurposeService: ProcessingPurposesService,
    private dataSubjectsRecipientsService: DataSubjectsRecipientsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  private getFeatureFlag() {
    this.featureFlagControllerService.getAllFeatureFlags().subscribe(
      (response: FeatureFlagAllInterface) => {
        const {
          RHEA_NEW_UI_STEPS_34_LICENSE,
          RHEA_NEW_UI_STEPS_12_LICENSE
        } = response;

        this.hasRHEA_NEW_UI_STEPS_34_LICENSE = RHEA_NEW_UI_STEPS_34_LICENSE;
        this.hasRHEA_NEW_UI_STEPS_12_LICENSE = RHEA_NEW_UI_STEPS_12_LICENSE;
      },
      err => {
        console.error('Unable to request from feature flag API.', err);
      }
    );
  }

  private getBusinessProcessRecord() {
    this.isFetching = true;
    return this.route.parent.params.pipe(
      flatMap((params: any) => {
        return this.businessProcessService.getBackground(params.id);
      })
    );
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

  public openDropdown(direction: 'sending' | 'receiving') {
    this.dropdownsOpen[direction] = true;
  }

  public closeAllDropdowns() {
    this.dropdownsOpen.receiving = false;
    this.dropdownsOpen.sending = false;
  }

  private initLocations() {
    this.locationService.getFullCountryList().subscribe(
      (data: GlobalRegionInterface[]) => {
        this.fullCountryList = data;
        this.locationDatas = this.locationService.mapCountryListForBadge(
          data,
          true
        );
        this.locations = this.locationService.mapLocationsFromRegions(data);
        this.dataFlowService.setLocationsAndSyncMapState(this.locations);
        this.getDataElementsGroups();
      },
      err => {
        console.error(err);
      }
    );
  }

  private getDataElementsGroups(page = 0) {
    this._dataElements$ = this.dataElementsService
      .getAllDataElementsPaged(page)
      .subscribe((response: { last: boolean; content: DataInterface[] }) => {
        this.dataElementCategories.push(...response.content);
        if (response.last) {
          this.getProcessingPurposesGroups();
        } else {
          this.getDataElementsGroups(page + 1);
        }
      });
  }

  private getProcessingPurposesGroups(page = 0) {
    this._processingPurposes$ = this.processingPurposeService
      .getAllProcessingPurposesPaged(page)
      .subscribe(
        (response: {
          last: boolean;
          content: BaseCategoryInterface<ProcessingPurposeInterface>[];
        }) => {
          this.processingPurposes.push(...response.content);
          if (response.last) {
            this.getDataFlowData();
          } else {
            this.getProcessingPurposesGroups(page + 1);
          }
        }
      );
  }

  private getDataFlowData() {
    this._paramMap$ = getRouteParamObservable(this.route.parent.paramMap, 'id')
      .pipe(
        tap(bpId => {
          this.bpId = bpId;
        }),
        flatMap(bpId =>
          forkJoin([
            this.dataFlowService.getDataFlow(bpId),
            this.dataSubjectsRecipientsService.getDataRecipientsRaw()
          ])
        )
      )
      .subscribe(
        ([dataFlow, dataRecipients]) => {
          this.dataFlow = dataFlow;
          this.isDeleting = false;
          this.flowChartService.DATA_ELEMENT_CATEGORIES = this.dataElementCategories;
          this.flowChartService.PROCESSING_PURPOSES = this.processingPurposes;
          this.dataFlow.dataRecipients = dataRecipients;
          this.initSystems();
          this.flowChartService.initFlowChartState(this.dataFlow);
          this.getSelectedItems();
          this.isFetching = false;
        },
        error => {
          this.isFetching = false;
          this.createBusinessProcessesService.show404ErrorAndRedirect(error);
        }
      );
  }

  private findSelectedItems(allOptions, dataTransfers) {
    const selectedItems = [];

    dataTransfers.forEach(dataTransferItem => {
      allOptions.forEach(group => {
        group.items.forEach(item => {
          if (
            dataTransferItem.id === item.id ||
            dataTransferItem.id === item.nodeId
          ) {
            selectedItems.push({
              ...item,
              edgeId: dataTransferItem.edgeId,
              sourceNodeId: dataTransferItem.sourceNodeId,
              targetNodeId: dataTransferItem.targetNodeId,
              selectedLocationIds: dataTransferItem.locationIds
            });
          }
        });
      });
    });
    return selectedItems;
  }

  private getSelectedItems() {
    if (!this.selectedItSystem) {
      return;
    }
    const state = _.keyBy(this.flowChartService.getFlowChartState(), 'id');
    if (!state[this.selectedItSystem.id]) {
      return;
    }
    const receivingDataTransfers =
      state[this.selectedItSystem.id].dataTransfers['receiving'];
    const sendingDataTransfer =
      state[this.selectedItSystem.id].dataTransfers['sending'];

    // Checking for selected receiving
    this.receivingSelectedOptions = this.findSelectedItems(
      this.selectedItSystem.recieveFromOptions,
      receivingDataTransfers
    );
    const sendingItems = _.cloneDeep(this.selectedItSystem.sendToOptions);

    if (this.hasRHEA_NEW_UI_STEPS_34_LICENSE) {
      sendingItems[0].items = this.dataFlow.drtNodes.map(
        drt =>
          new InitialItemClass(
            drt.dataRecipientType,
            drt,
            this.dataFlowService.locations
          )
      );
    }
    this.sendingSelectedOptions = this.findSelectedItems(
      sendingItems,
      sendingDataTransfer
    );
  }

  private initSystems() {
    this.itSystems = this.dataFlowService.mapItSystemsForBp(
      this.dataFlow,
      this.hasRHEA_NEW_UI_STEPS_34_LICENSE
    );
    this.setCurrentItSystem(true);
    this.isFinishLoadITs = true;
  }

  ngOnInit(): void {
    this.getFeatureFlag();
    this.initLocations();

    this.featureFlagControllerService
      .getAllFeatureFlags()
      .pipe(
        flatMap((licenses: FeatureFlagAllInterface) => {
          this.licenses = licenses;
          return this.getBusinessProcessRecord();
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

  ngOnDestroy(): void {
    this.dataElementCategories = [];
    this.processingPurposes = [];
  }

  public isAlreadySelected(
    id: string,
    direction: 'sending' | 'receiving'
  ): boolean {
    const selectedOptions =
      direction === 'sending'
        ? this.sendingSelectedOptions
        : this.receivingSelectedOptions;

    return selectedOptions.some(option => option.id === id);
  }

  public itemSelected(item, direction: 'sending' | 'receiving') {
    const alreadySelected = this.isAlreadySelected(item.id, direction);
    if (item.isItSystem && alreadySelected) {
      // prevents from selecting itSystem twice
      return;
    }
    if (direction === 'receiving') {
      this.receivingSelectedOptions.push(item);
    } else {
      this.sendingSelectedOptions.push(item);
    }
    item = this.getItemData(item, direction);
    this.dataFlowService
      .createEdge(this.bpId, this.selectedItSystem, item, direction)
      .subscribe(
        response => {
          item.edgeId = response.edgeId;
          this.addEdgeDataToSelectedItems(
            item.id,
            response.edgeId,
            response.locationIds,
            direction
          );
          this.openPopover(item, direction, response);
        },
        error => {
          // [i18n-tobeinternationalized]
          this.toastService.error(`Error updating data.`, error);
        }
      );
  }

  private addEdgeDataToSelectedItems(
    itemId: string,
    edgeId: string,
    locationIds: string[],
    direction: 'sending' | 'receiving'
  ) {
    let itemWithoutEdge;
    if (direction === 'receiving') {
      itemWithoutEdge = this.receivingSelectedOptions.find(
        selectedItem => selectedItem.id === itemId
      );
    } else {
      itemWithoutEdge = this.sendingSelectedOptions.find(
        selectedItem => selectedItem.id === itemId
      );
    }
    if (itemWithoutEdge) {
      itemWithoutEdge.edgeId = edgeId;
      itemWithoutEdge.locationIds = locationIds;
    }
  }

  public getItemData(item, direction: 'sending' | 'receiving') {
    if (item.isItSystem || direction !== 'sending') {
      return item;
    }
    if (!this.hasRHEA_NEW_UI_STEPS_34_LICENSE) {
      return {
        ...item,
        dataElementIds: this.selectedItSystem.dataElementIds,
        processingPurposeIds: this.selectedItSystem.processingPurposeIds
      };
    }
    // if this is a recipient get locations, data elements, a PPs from active itSystem
    return {
      ...item,
      locationIds: this.selectedItSystem.locationIds,
      dataElementIds: this.selectedItSystem.dataElementIds,
      processingPurposeIds: this.selectedItSystem.processingPurposeIds
    };
  }

  public savePopoverData(newData) {
    this.isFetching = true;
    this.dataFlowService
      .updateEdge(
        this.bpId,
        this.popoverData.item,
        newData,
        this.popoverData.edge
      )
      .subscribe(
        () => {
          this.popover.close();
          this.getDataFlowData();
        },
        error => {
          // [i18n-tobeinternationalized]
          this.toastService.error(`Error updating data.`, error);
          this.isFetching = false;
        }
      );
  }

  private setPopoverData(item, direction: 'sending' | 'receiving') {
    const itSystemId =
      item.isItSystem && direction === 'receiving'
        ? item.id
        : this.selectedItSystem.id;

    this.dataFlowService.getEdge(this.bpId, itSystemId, item.edgeId).subscribe(
      response => {
        this.popoverData = { item: item, edge: response };
      },
      error => {
        // [i18n-tobeinternationalized]
        this.toastService.error(`Error updating data.`, error);
      }
    );
  }

  public openPopover(
    item,
    direction: 'sending' | 'receiving',
    edgeObject = null
  ) {
    if (edgeObject) {
      this.popoverData = { item: item, edge: edgeObject };
      return this.popover.open();
    } else {
      this.popoverData = null;
      this.setPopoverData(item, direction);
    }
    this.popover.open();
  }

  private removeItemFromUI(item, direction: 'sending' | 'receiving') {
    if (direction === 'receiving') {
      this.receivingSelectedOptions = this.receivingSelectedOptions.filter(
        option => option.edgeId !== item.edgeId
      );
    } else {
      this.sendingSelectedOptions = this.sendingSelectedOptions.filter(
        option => option.edgeId !== item.edgeId
      );
    }
  }

  public itemRemoved(item, direction: 'sending' | 'receiving') {
    this.popover.close();
    if (this.isDeleting) {
      return;
    }
    this.isDeleting = true;
    this.closeAllDropdowns();
    this.removeItemFromUI(item, direction);

    this.dataFlowService.deleteEdge(this.bpId, item.edgeId).subscribe(
      success => {
        this.getDataFlowData();
      },
      error => {
        this.isDeleting = false;
        // [i18n-tobeinternationalized]
        this.toastService.error(`Error updating data.`, error);
      }
    );
  }

  public clearAllDataItems(direction: 'sending' | 'receiving') {
    this.popover.close();
    this.closeAllDropdowns();
    let itemsToDelete = [];
    if (direction === 'sending') {
      itemsToDelete = this.sendingSelectedOptions;
      this.sendingSelectedOptions = [];
    } else {
      itemsToDelete = this.receivingSelectedOptions;
      this.receivingSelectedOptions = [];
    }

    const edgeIds = itemsToDelete.map(item => item.edgeId);

    this.dataFlowService.deleteAllEdges(this.bpId, edgeIds).subscribe(
      () => {
        this.getDataFlowData();
      },
      error => {
        // [i18n-tobeinternationalized]
        this.toastService.error(`Error updating data.`, error);
      }
    );
  }

  public setCurrentItSystem(skipGettingSelectedItem = false) {
    this.selectedItSystem = this.itSystems[this.currentItSystemIndex];
    if (
      this.selectedItSystem &&
      this.selectedItSystem.locations &&
      this.selectedItSystem.locations.length > 0
    ) {
      this.selectedItSystem.location = this.selectedItSystem.locations[0];
    }

    this.receivingSelectedOptions = [];
    this.sendingSelectedOptions = [];
    if (skipGettingSelectedItem) {
      return;
    }
    this.getSelectedItems();
  }

  public onSearch() {}

  public onNextClick() {
    if (this.popover) {
      this.popover.close();
    }

    if (!this.isFinishLoadITs) {
      return;
    }
    if (!exists(this.itSystems[this.currentItSystemIndex])) {
      this.goNextPage();
    } else {
      // if this is not the last IT System than go to next IT System
      // if this is the last IT System go to next page
      if (this.currentItSystemIndex < this.itSystems.length - 1) {
        this.currentItSystemIndex++;
        this.setCurrentItSystem();
      } else {
        this.goNextPage();
      }
    }
  }

  public onBackClick() {
    if (this.popover) {
      this.popover.close();
    }
    // if this is not the first IT System than go to previous IT System
    // if this is the first IT System go to previous page
    if (this.currentItSystemIndex > 0) {
      this.currentItSystemIndex--;
      this.setCurrentItSystem();
    } else {
      this.goPreviousPage();
    }
  }

  private goPreviousPage() {
    this.stepContainerService.emitChange(-1);
  }

  private goNextPage() {
    if (!this.hasRHEA_NEW_UI_STEPS_12_LICENSE) {
      this.stepContainerService.emitChange(1);
    } else {
      this.navigate('security-and-risks');
    }
  }

  public getProgressBarValue() {
    let progressBarValue = 0;
    if (this.itSystems.length) {
      progressBarValue =
        ((this.currentItSystemIndex + 1) / this.itSystems.length) * 100;
    }
    return progressBarValue;
  }

  getLabelDetailsByTag(tag) {
    switch (tag) {
      case ThirdPartyType.PRIMARY_ENTITY:
        return 'green';
      case ThirdPartyType.COMPANY_AFFILIATE:
        return 'green';
      default:
        return 'orange';
    }
  }
}
