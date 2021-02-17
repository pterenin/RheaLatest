import { TaTableRequest } from '@trustarc/ui-toolkit';

export interface RecordRequestInterface extends TaTableRequest {
  size?: number;
  sortDirection?: string;
  sortField?: string;
  filters?: FilterNonLeafNode;
  customFilters?: {
    filters?: any;
  };
}

export interface FilterNonLeafNode {
  operand?: 'OR' | 'AND';
  filters?: Array<FilterLeafNode | FilterNonLeafNode>;
}

export interface FilterLeafNode {
  fieldName: string;
  values: string[];
}
