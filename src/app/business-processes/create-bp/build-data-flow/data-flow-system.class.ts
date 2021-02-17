import {
  LocationInterface,
  CountryInterface
} from 'src/app/shared/models/location.model';

import { exists } from 'src/app/shared/utils/basic-utils';

import { InitialItemClass } from './initial-item.class';

declare const _: any;

export class DataFlowSystemClass {
  label: string;
  id: string;
  tag: string;
  location: string;
  locations: any[];
  locationIds: string[];
  dataElementIds: string[];
  processingPurposeIds: string[];
  entityId: string;
  nodeId: string;
  dataSubjectTypeToItSystemDataTransfers: any;
  itSystemToDataRecipientTypeDataTransfers: any;
  itSystemToItSystemDataTransfers: any;
  incomingItSystemToItSystemDataTransfers: any;
  recieveFromOptions: any[];
  sendToOptions: any[];

  constructor(itSystem, dataFlow, drtNodes, dstNodes, dataFlowLocations) {
    this.label = itSystem.name;
    this.id = itSystem.nodeId;
    this.tag = itSystem.category;
    this.location = this.getCountryCode(itSystem.locationId, dataFlowLocations);
    this.locations =
      itSystem.locationIds.map(location =>
        this.getCountryCode(location, dataFlowLocations)
      ) || [];
    this.locationIds = itSystem.locationIds;
    this.dataElementIds = itSystem.dataElementIds;
    this.processingPurposeIds = itSystem.processingPurposeIds;
    this.entityId = itSystem.entityId;
    this.nodeId = itSystem.nodeId;
    this.dataSubjectTypeToItSystemDataTransfers =
      dataFlow.dataSubjectTypeToItSystemDataTransfers;
    this.itSystemToDataRecipientTypeDataTransfers =
      dataFlow.itSystemToDataRecipientTypeDataTransfers;
    this.itSystemToItSystemDataTransfers =
      dataFlow.itSystemToItSystemDataTransfers;
    this.incomingItSystemToItSystemDataTransfers =
      dataFlow.incomingItSystemToItSystemDataTransfers;
    this.recieveFromOptions = [
      {
        label: 'Data Subjects',
        id: _.uniqueId(),
        items: dstNodes.map(
          dst =>
            new InitialItemClass(dst.dataSubjectType, dst, dataFlowLocations)
        )
      },
      {
        label: 'Systems',
        id: _.uniqueId(),
        items: dataFlow.isNodes
          .filter(itsystemTemp => itsystemTemp.nodeId !== itSystem.nodeId)
          .map(
            itSystemTemp =>
              new InitialItemClass(
                itSystemTemp.name,
                itSystemTemp,
                dataFlowLocations
              )
          )
      }
    ];
    this.sendToOptions = [
      {
        label: 'Data Recipients',
        id: _.uniqueId(),
        items: drtNodes.map(
          drt =>
            new InitialItemClass(drt.dataRecipientType, drt, dataFlowLocations)
        )
      },
      {
        label: 'Systems',
        id: _.uniqueId(),
        items: dataFlow.isNodes
          .filter(itsystemTemp => itsystemTemp.nodeId !== itSystem.nodeId)
          .map(
            itSystemTemp =>
              new InitialItemClass(
                itSystemTemp.name,
                itSystemTemp,
                dataFlowLocations
              )
          )
      }
    ];
  }

  private getCountryCode(id: string, dataFlowLocations) {
    const locationFound = dataFlowLocations.find(
      (location: LocationInterface) => location.id === id
    );

    return exists(locationFound) ? locationFound.country.threeLetterCode : '';
  }
}
