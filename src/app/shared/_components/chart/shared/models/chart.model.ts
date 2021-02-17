export interface GenericChartFlowType {
  flowChartId: string;
  nodeId: string;
  edgeId: string;
  name: string;
  processingPurposeCount: number;
  dataElementCount: number;
}

export interface Location {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
}

export interface ItSystem extends GenericChartFlowType {
  legalEntityType: string;
  legalEntityName: string;
  location: Location;
}

export interface DataSubject extends GenericChartFlowType {
  category: string;
  locations: Location[];
}

export interface DataTransfer {
  edgeId: string;
  sourceFlowChartId: string;
  targetFlowchartId: string;
}

export interface DataFlowChartModelObject {
  itSystems: ItSystem[];
  dataSubjects: DataSubject[];
  dataRecipients: DataSubject[];
  dataTransfers: DataTransfer[];
}
