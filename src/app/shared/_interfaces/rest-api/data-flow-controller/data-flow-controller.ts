export interface GetItSystemEntityInterface {
  dataElementIds: string[];
  dataSubjects: DataSubjectInterface[];
  dataElements: DataElementInterface[];
  processingPurposes: ProcessingPurposeInterface[];
  entityId: string;
  legalEntity: LegalEntityInterface;
  locations: LocationElementInterface[];
  name: string;
  processingPurposeIds: string[];
  locationIds?: string[];
}

interface DataSubjectInterface {
  businessProcessId: string;
  category: string;
  dataElementIds: string[];
  dataSubjectType: string;
  entityId: string;
  locationIds: string[];
  mapped: boolean;
  nodeId: string;
  version: number;
}

// TODO: update
interface DataElementInterface {
  businessProcessId: string;
  category: string;
  dataElementIds: string[];
  dataSubjectType: string;
  entityId: string;
  locationIds: string[];
  mapped: boolean;
  nodeId: string;
  version: number;
}

// TODO: update
interface ProcessingPurposeInterface {
  businessProcessId: string;
  category: string;
  dataElementIds: string[];
  dataSubjectType: string;
  entityId: string;
  locationIds: string[];
  mapped: boolean;
  nodeId: string;
  version: number;
}

interface LegalEntityInterface {
  contact: ContactInterface;
  contactType: ContactTypeInterface;
  created: string;
  description: string;
  entityRole: string;
  externalDataSource: string;
  externalId: string;
  id: string;
  identifier: string;
  industrySectors: IndustrySectorInterface[];
  name: string;
  notes: string;
  ownerId: string;
  ownerName: string;
  type: string;
  version: number;
}

interface ContactInterface {
  address: string;
  city: string;
  email: string;
  fullName: string;
  id: string;
  location: ContactLocationInterface;
  phone: string;
  version: number;
  zip: string;
}

interface ContactLocationInterface {
  businessProcessUsage: BusinessProcessUsageInterface[];
  countryId: string;
  countryName: string;
  countryRegionId: string;
  globalRegionId: string;
  id: string;
  stateOrProvinceId: string;
  stateOrProvinceName: string;
  version: number;
}

interface BusinessProcessUsageInterface {
  bpId: string;
  bpName: string;
}

interface ContactTypeInterface {
  companyEntityUse: boolean;
  id: string;
  type: string;
  version: number;
}

interface IndustrySectorInterface {
  id: string;
  name: string;
  sector: string;
}

interface LocationElementInterface {
  dataTransferCount: number;
  location: ContactLocationInterface;
}

export interface FindItSystemNodesRequestInterface {
  dataElementIds: string[];
  dataSubjectIds: string[];
  locationIds: string[];
  ownerTypeIds: string[];
  processingPurposeIds: string[];
  searchText: string;
  sortId: string;
}

export interface FindItSystemNodesRequestInterface {
  dataElementIds: string[];
  dataSubjectIds: string[];
  locationIds: string[];
  ownerTypeIds: string[];
  processingPurposeIds: string[];
  searchText: string;
  sortId: string;
}

export interface ItSystemNode {
  entityId: string;
  locationId: string;
  locationName: string;
  mapped: boolean;
  name: string;
  nodeId: string;
  owningEntityName: string;
  owningEntityType: 'BUSINESS_PROCESS';
  type?: string;
}

export interface ItSystemNodeFilters {
  sort: ItSystemNodeFilterItem[];
  ownerTypes: ItSystemNodeFilterItem[];
  dataSubjects: ItSystemNodeFilterItem[];
  dataElements: ItSystemNodeFilterItem[];
  locations: ItSystemNodeFilterItem[];
  processingPurposes: ItSystemNodeFilterItem[];
}

export interface ItSystemNodeFilterItem {
  id: string;
  label: string;
}

export interface DataTransferLocationInterface {
  id: string;
  label: string;
}

export interface TransferEntity {
  category: string;
  dataElements: [];
  edgeId: string;
  entityId: string;
  locations?: DataTransferLocationInterface[];
  mapped: boolean;
  name: string;
  nodeId: string;
  uniqueId?: string;
  legalEntityName?: string;
  legalEntityType?: string;
  location?: DataTransferLocationInterface;
  processingPurposes?: [];
  saleOfData: boolean;
}

export interface SendsDataTransfersInterface {
  dataSubjectTransfers: TransferEntity[];
  itSystemTransfers: TransferEntity[];
}

export interface ReceivesDataTransfersInterface {
  dataRecipientTransfers: TransferEntity[];
  itSystemTransfers: TransferEntity[];
}

export interface DataFlowViewInterface {
  id: string;
  type: string;
  label: string;
  icon: string;
  disabled: boolean;
  nodeId?: string;
  show?: boolean;
}

export interface DataRecipientDetails {
  id: string;
  name: string;
  category: string;
  selected?: boolean;
  code3?: string;
}

export interface ItSystemDetailsNode {
  blockId: string;
  nodeId: string;
  edgeId: string;
  uniqueId?: string;
  name: string;
  legalEntityType: string;
  legalEntityName: string;
  location: DataRecipientDetails;
  processingPurposes: DataRecipientDetails[];
  dataElements: DataRecipientDetails[];
}

export interface DataSubjectNode {
  blockId: string;
  nodeId: string;
  edgeId: string;
  uniqueId?: string;
  name: string;
  category: string;
  locations: DataRecipientDetails[];
  dataElements: DataRecipientDetails[];
}

export interface DataRecipientNode extends DataSubjectNode {
  processingPurposes: DataRecipientDetails[];
}

export interface DataFlowFiltersInterface {
  categories?: DataItemInterface[];
  dataElements?: DataItemInterface[];
  locations?: DataItemLocationInterface[];
  processingPurposes?: DataItemInterface[];
}

export interface DataTransferNode {
  nodeId?: string;
  edgeId?: string;
  uniqueId?: string;
  sourceItSystem: ItSystemDetailsNode;
  sourceDataSubject: DataSubjectNode;
  targetItSystem: ItSystemDetailsNode;
  targetDataRecipient: DataRecipientNode;
  dataTransfer: DataTransferInterface;
}

export interface DataTransferDetails {
  nodeId?: string;
  edgeId?: string;
  uniqueId?: string;
  name: string;
  locations: DataItemLocationInterface[];
  dataElements: DataRecipientDetails[];
  processingPurposes: DataRecipientDetails[];
}

export interface NodeDetailsData {
  node:
    | DataRecipientNode
    | ItSystemDetailsNode
    | DataSubjectNode
    | DataTransferNode
    | DataTransferDetails;
  title: string;
  type: string;
  editable?: boolean;
  direction?: string;
  isSystemToSystem?: boolean;
  systemId?: string;
}

export interface DataTransferUpdateData {
  id: string;
  data: {
    dataElements?: DataItemInterface[];
    locations?: DataItemLocationInterface[];
    processingPurposes?: DataItemInterface[];
  };
  direction: string;
  type: string;
}

interface DataTransferInterface {
  edgeId: string;
  sourceBlockId: string;
  targetBlockId: string;
  locations: DataItemLocationInterface[];
  dataElements: DataRecipientDetails[];
  processingPurposes: DataRecipientDetails[];
  saleOfData: boolean;
}

interface DataItemInterface {
  id: string;
  label: string;
}

export interface DataItemLocationInterface {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  region: string;
}
export interface DataTransferFromChart {
  bpId: string;
  edgeBlockId: string;
  type: string;
  systemId?: string;
}
