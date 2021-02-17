export interface BaseCategoryInterface<T> {
  id: string;
  label: string;
  items: T[];
}

export interface CurrentlyEditingEdgeInformation {
  id: string;
  direction: 'sending' | 'receiving';
}

export interface EdgeData {
  businessProcessId: string;
  dataElementIds?: string[];
  processingPurposeIds?: string[];
  saleOfData?: boolean;
  sourceNodeId: string;
  targetNodeId: string;
}

export type NodeEntityType = 'System' | 'Data Subject' | 'Data Recipient';
