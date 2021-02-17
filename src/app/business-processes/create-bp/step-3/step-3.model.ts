import { BaseCategoryInterface } from 'src/app/shared/components/categorical-view/category-model';
import { DataSubjectRecipientInterface } from 'src/app/shared/models/subjects-recipients.model';
import { Item } from 'src/app/shared/components/categorical-view/item-model';

export interface RequestConfig {
  accessor: 'dataSubjectType' | 'dataRecipientType';
  dataList: BaseCategoryInterface<DataSubjectRecipientInterface>[];
}

export interface DataFlowNode {
  businessProcessId: string;
  category: string;
  entityId: string;
  locationId: string;
  version: number;
}

export interface DataSubjectNode extends DataFlowNode {
  dataSubjectType: string;
}

export interface DataRecipientNode extends DataFlowNode {
  dataRecipientType: string;
}

export interface DataFlowResponse<T> {
  dataFlowNodes: T[];
  allEntities: any[];
}

export interface DataSubjectRecipentPayload {
  businessProcessId: string;
  entityId: string;
  locationIds: string[];
  version?: number;
  category: string;
  mapped?: boolean;
  dataSubjectType?: string;
  dataRecipientType?: string;
  dataElementIds?: string[];
  nodeId?: string;
}

export class ItemWithLocationId extends Item {
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

export interface DataItemInterface {
  id: string;
  label: string;
  selected?: boolean;
}

export interface DataElementsInterface {
  items: DataItemInterface[];
}

export interface DataNodeInterface {
  dataElementIds: string[];
  label: string;
  location: string;
  locationIds: string[];
  nodeId: string;
  subItem: string;
  tag: any;
  unReselectable: boolean;
}

export type dataType = 'Data Subject' | 'Data Recipient';
