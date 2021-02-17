export interface DataFlowChartInterface {
  dataSubjects: DataFlowChartCommonDataInterface[];
  itSystems: DataFlowChartItSystemInterface[];
  dataRecipients: DataFlowChartCommonDataInterface[];
  dataTransfers: DataTransfer[];
}

export interface DataFlowChartCommonDataInterface {
  nodeId: string;
  entityId: string;
  name: string;
  edgeId: string;
  blockId: string;
  category: string;
  locations: Location[];
  processingPurposeCount?: number;
  dataElementCount: number;
}

export interface Location {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  region: string;
}

export interface DataFlowChartDataTransferInterface {
  edgeId: string;
  sourceBlockId: string;
  targetBlockId: string;
}

export interface DataFlowChartItSystemInterface {
  nodeId: string;
  entityId: string;
  name: string;
  blockId: string;
  legalEntityType: string;
  legalEntityName: string;
  location: Location;
  processingPurposeCount: number;
  dataElementCount: number;
}

export interface DataTransfer {
  edgeId: string;
  sourceBlockId: string;
  targetBlockId: string;
}
