import { Item } from 'src/app/shared/components/categorical-view/item-model';
import { ItSystemDataFlow } from './step-4.service';

export interface ItSystemNode {
  businessProcessId: string;
  category: string;
  dataElementIds: string[];
  processingPurposeIds: string[];
  role: string;
  version: number;
  locationId: string;
  description: string;
  entityId: string;
}

export class ItSystemWithLocationId extends Item {
  locationId: string;

  constructor(
    label: string,
    id: string,
    selected: boolean,
    subItem: string,
    tag,
    location,
    locationId,
    senderId,
    receiverId
  ) {
    super(
      label,
      id,
      selected,
      subItem,
      tag,
      location,
      senderId,
      receiverId,
      null
    );
    this.locationId = locationId;
  }
}

export interface DataFlowItSystemResponse<T> {
  dataFlowNodes: T[];
  allEntities: any[];
}

export class ItSystemDataFlowSaveRequest {
  businessProcessId: string;
  category: string;
  dataElementIds: string[];
  description: string;
  entityId: string;
  dataSubjectTypeToItSystemDataTransfers: ItSystemDataFlow[];
  itSystemToDataRecipientTypeDataTransfers: ItSystemDataFlow[];
  itSystemToItSystemDataTransfers: ItSystemDataFlow[];
  locationId: string;
  locationIds?: string[];
  name: string;
  notes: string;
  processingPurposeIds: string[];
  role: string;
  nodeId?: string;

  constructor(
    dataElementIds: string[],
    locationId: string,
    processingPurposeIds: string[],
    entityId: string,
    name: string,
    businessProcessId: string,
    category: string,
    description: string,
    dataSubjectTypeToItSystemDataTransfers: ItSystemDataFlow[],
    itSystemToDataRecipientTypeDataTransfers: ItSystemDataFlow[],
    itSystemToItSystemDataTransfers: ItSystemDataFlow[],
    notes: string,
    role: string,
    nodeId?: string
  ) {
    this.dataElementIds = dataElementIds;
    this.locationId = locationId;
    this.processingPurposeIds = processingPurposeIds;
    this.entityId = entityId;
    this.name = name;
    this.businessProcessId = businessProcessId;
    this.notes = notes;
    this.description = description;
    this.dataSubjectTypeToItSystemDataTransfers = dataSubjectTypeToItSystemDataTransfers;
    this.itSystemToDataRecipientTypeDataTransfers = itSystemToDataRecipientTypeDataTransfers;
    this.itSystemToItSystemDataTransfers = itSystemToItSystemDataTransfers;
    this.role = role;
    this.category = category;
    this.nodeId = nodeId;
  }
}
