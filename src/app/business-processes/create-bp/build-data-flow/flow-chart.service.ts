import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getRoleInitialism } from 'src/app/shared/models/controller-process.model';
import { DataFlowService } from './buld-data-flow.service';
import { BaseCategoryInterface } from 'src/app/shared/components/categorical-view/category-model';
import { ProcessingPurposeInterface } from 'src/app/shared/models/processing-purposes.model';

declare const _: any;

interface DataElement {
  label: string;
  id: string;
  selected: boolean;
}

interface DataElementsCategories {
  id: string;
  label: String;
  items: DataElement[];
}

@Injectable({
  providedIn: 'root'
})
export class FlowChartService {
  public flowChartState;
  private mapState = { data: [] };

  private flowChartStateUpdated = new BehaviorSubject(this.flowChartState);
  private mapStateUpdated = new BehaviorSubject(this.mapState);
  public _flowChartDataObservable$ = this.flowChartStateUpdated.asObservable();
  public _mapStateObservable$ = this.mapStateUpdated.asObservable();
  public DATA_ELEMENT_CATEGORIES: DataElementsCategories[] = [];

  public PROCESSING_PURPOSES: BaseCategoryInterface<
    ProcessingPurposeInterface
  >[] = [];

  constructor(private dataFlowService: DataFlowService) {}

  public getDataElementNameFromId(dataElementId: string) {
    return _(this.DATA_ELEMENT_CATEGORIES)
      .map('items')
      .flatten()
      .filter(item => item.id === dataElementId)
      .value()[0].label;
  }

  public initFlowChartState(dataFlow) {
    const itSystemNodesWithDataTransfers = dataFlow.isNodes.filter(
      isNode =>
        isNode.dataSubjectTypeToItSystemDataTransfers.length ||
        isNode.itSystemToDataRecipientTypeDataTransfers.length ||
        isNode.itSystemToItSystemDataTransfers.length ||
        isNode.incomingItSystemToItSystemDataTransfers.length
    );

    this.flowChartState = this.getItSystemForState(
      itSystemNodesWithDataTransfers
    );

    const dsNodesWithTransfer = this.getDsNodesWithTransfers(
      dataFlow,
      itSystemNodesWithDataTransfers
    );

    const drNodesWithTransfer = this.getDrNodesWithTransfers(
      dataFlow,
      itSystemNodesWithDataTransfers
    );

    this.updateSystemToSystemTransfer(itSystemNodesWithDataTransfers);

    this.flowChartState = [
      ...this.flowChartState,
      ...dsNodesWithTransfer,
      ...drNodesWithTransfer
    ];
    const flowChartStateModified = this.modifyToUniqueIds();
    this.flowChartStateUpdated.next(flowChartStateModified);
    this.syncFlowChartAndMapState();
  }

  private modifyToUniqueIds() {
    const modifiedFlowState = _.cloneDeep(this.flowChartState);
    const idObj = {};
    modifiedFlowState.forEach(stateItem => {
      if (idObj[stateItem.id]) {
        stateItem.id = stateItem.id + _.uniqueId('_');
        stateItem.dataTransfers.receiving.forEach(receivingObj => {
          const correspondentSystem = modifiedFlowState.find(
            entityObj => receivingObj.id === entityObj.id
          );
          correspondentSystem.dataTransfers.sending.forEach(sendingObj => {
            if (sendingObj.edgeId === receivingObj.edgeId) {
              sendingObj.id = stateItem.id;
            }
          });
        });
        stateItem.dataTransfers.sending.forEach(sendingObj => {
          const correspondentSystem = modifiedFlowState.find(
            entityObj => sendingObj.id === entityObj.id
          );
          correspondentSystem.dataTransfers.receiving.forEach(receivingObj => {
            if (receivingObj.edgeId === sendingObj.edgeId) {
              receivingObj.id = stateItem.id;
            }
          });
        });
      } else {
        idObj[stateItem.id] = true;
      }
    });
    return modifiedFlowState;
  }

  private updateSystemToSystemTransfer(itSystemNodesWithDataTransfers) {
    itSystemNodesWithDataTransfers.forEach(isNode => {
      isNode.itSystemToItSystemDataTransfers.forEach(transfer => {
        const sourceSystem = this.flowChartState.find(
          system => system.id === transfer.sourceNodeId
        );
        const targetSystem = this.flowChartState.find(
          system => system.id === transfer.targetNodeId
        );
        if (!sourceSystem || !targetSystem) {
          return;
        }
        sourceSystem.dataTransfers.sending.push({
          ...transfer,
          id: transfer.targetNodeId
        });
        targetSystem.dataTransfers.receiving.push({
          ...transfer,
          id: transfer.sourceNodeId
        });
      });
    });
  }

  private getItSystemForState(itSystemNodesWithDataTransfers): any[] {
    const itSystemsForState = [];

    itSystemNodesWithDataTransfers.forEach(isNode => {
      const category = isNode.category.toLowerCase();
      const type =
        category === 'vendor' ||
        category === 'partner' ||
        category === 'business_associate' ||
        category === 'customer' ||
        category === 'service_provider'
          ? 'IT_SYSTEM_3RD_PARTY'
          : 'IT_SYSTEM_1ST_PARTY';

      itSystemsForState.push({
        type: type,
        name: isNode.name,
        location: isNode.locationId,
        locationIds: isNode.locationIds,
        entityId: isNode.entityId,
        legalEntityType: 'IT system type',
        role: getRoleInitialism(isNode.role),
        id: isNode.nodeId,
        baseDataElements: [],
        baseProcessingPurposes: [],
        category: isNode.category,
        dataTransfers: {
          sending: [],
          receiving: []
        }
      });
    });

    return itSystemsForState;
  }

  private getDrNodesWithTransfers(
    dataFlow,
    itSystemNodesWithDataTransfers
  ): any[] {
    const drNodesWithTransfer = [];
    itSystemNodesWithDataTransfers.forEach(isNode => {
      isNode.itSystemToDataRecipientTypeDataTransfers.forEach(transfer => {
        const drNodeWithTransfer = dataFlow.drtNodes.find(
          dsNode => dsNode.nodeId === transfer.targetNodeId
        );
        if (drNodeWithTransfer) {
          drNodesWithTransfer.push({
            type: 'DATA_RECIPIENT',
            name: drNodeWithTransfer.dataRecipientType,
            location: drNodeWithTransfer.locationId,
            locationIds: transfer.locationIds,
            entityId: drNodeWithTransfer.entityId,
            legalEntityType: 'Data Recipient Type',
            category: drNodeWithTransfer.category,
            id: drNodeWithTransfer.nodeId,
            dataTransfers: {
              sending: [],
              receiving: [{ ...transfer, id: isNode.nodeId }]
            }
          });
          const system = this.flowChartState.find(
            _system => _system.id === isNode.nodeId
          );
          system.dataTransfers.sending.push({
            ...transfer,
            id: drNodeWithTransfer.nodeId
          });
        }
      });
    });
    return drNodesWithTransfer;
  }

  private getDsNodesWithTransfers(
    dataFlow,
    itSystemNodesWithDataTransfers
  ): any[] {
    const dsNodesWithTransfer = [];
    itSystemNodesWithDataTransfers.forEach(isNode => {
      isNode.dataSubjectTypeToItSystemDataTransfers.forEach(transfer => {
        const dsNodeWithTransfer = dataFlow.dstNodes.find(
          dsNode => dsNode.nodeId === transfer.sourceNodeId
        );
        if (dsNodeWithTransfer) {
          dsNodesWithTransfer.push({
            type: 'DATA_SUBJECT',
            name: dsNodeWithTransfer.dataSubjectType,
            location: dsNodeWithTransfer.locationId,
            locationIds: transfer.locationIds,
            entityId: dsNodeWithTransfer.entityId,
            legalEntityType: 'Data Subject Type',
            category: dsNodeWithTransfer.category,
            id: dsNodeWithTransfer.nodeId,
            dataTransfers: {
              sending: [{ ...transfer, id: isNode.nodeId }],
              receiving: []
            }
          });
          const system = this.flowChartState.find(
            _system => _system.id === isNode.nodeId
          );
          system.dataTransfers.receiving.push({
            ...transfer,
            id: dsNodeWithTransfer.nodeId
          });
        }
      });
    });
    return dsNodesWithTransfer;
  }

  private buildMapObject(item, locationIds, sendingToItemData?) {
    const from = {
      from: {
        name: item.name,
        location: this.dataFlowService.getTwoLetterCodeFromThreeLetterCode(
          this.dataFlowService.getCountryCode(locationIds.from)
        ),
        type: item.type
      }
    };

    const to = sendingToItemData
      ? {
          to: {
            name: sendingToItemData.name,
            location: this.dataFlowService.getTwoLetterCodeFromThreeLetterCode(
              this.dataFlowService.getCountryCode(locationIds.to)
            ),
            type: sendingToItemData.type
          }
        }
      : {};
    return { ...from, ...to };
  }

  private syncFlowChartAndMapState() {
    const mapStateWithTo = [];
    const mapStateWithoutTo = [];
    this.flowChartState.forEach(item => {
      if (item.id === undefined) {
        return;
      }
      // draw single receive point

      if (item.dataTransfers.sending.length === 0) {
        item.locationIds.map(locId => {
          mapStateWithoutTo.push(
            this.buildMapObject(item, { from: locId, to: null })
          );
        });
        return;
      }

      item.dataTransfers.sending.forEach(sendingToItem => {
        const sendingToItemData = this.flowChartState.find(
          _item => _item.id === sendingToItem.id
        );

        const drawSubject =
          item.type === 'DATA_SUBJECT' && item.locationIds.length > 0;
        const drawReceive = sendingToItemData.locationIds.length > 0;
        const drawConnectedSystem =
          item.type === 'IT_SYSTEM_3RD_PARTY' &&
          item.locationIds.length === 1 &&
          sendingToItemData.locationIds.length === 1;

        if (drawSubject) {
          item.locationIds.map(locId => {
            const locationIds = {
              from: locId,
              to: sendingToItemData.locationIds[0]
            };
            mapStateWithTo.push(
              this.buildMapObject(item, locationIds, sendingToItemData)
            );
          });
        } else if (drawReceive) {
          sendingToItemData.locationIds.map(locId => {
            const locationIds = { from: item.locationIds[0], to: locId };
            mapStateWithTo.push(
              this.buildMapObject(item, locationIds, sendingToItemData)
            );
          });
        } else if (drawConnectedSystem) {
          const locationIds = {
            from: item.location,
            to: sendingToItemData.location
          };
          mapStateWithTo.push(
            this.buildMapObject(item, locationIds, sendingToItemData)
          );
        }
      });
    });
    // order is important. Without 'to' should go last.
    // this way those points will render on top.
    this.mapState = { data: [...mapStateWithTo, ...mapStateWithoutTo] };
    this.mapStateUpdated.next(this.mapState);
  }

  public emitMapDtateUpdate(mapState) {
    this.mapStateUpdated.next(mapState);
  }

  public getFlowChartState() {
    return this.flowChartState;
  }
}
