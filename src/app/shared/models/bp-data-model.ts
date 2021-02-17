import { TaDatagridRequest } from '@trustarc/ui-toolkit';
import { FilterNonLeafNode } from './filter-model';
import { BaseRecordInterface } from './base-record-model';
import { DataInventoryType } from 'src/app/data-inventory/my-inventory/my-inventory.component';

export interface DataInventoryInterface extends BaseRecordInterface {
  id: string;
  identifier: string;
  name: string;
  owner: {
    fullName: string;
    email: string;
  };
  description: string;
  lastModified: number;
  linkedBPCount: number;
  entityType: DataInventoryType;
  linkedBPs: BusinessProcess[];
}

interface BusinessProcess {
  id: string;
  name: string;
}

export interface DataInventoryCollectionInterface {
  content: DataInventoryInterface[];
  first: boolean;
  last: boolean;
  totalElements: number;
  totalPages: number;
  sort: any;
  numberOfElements: number;
  size: number;
  number: number;
}

export interface TaDatagridRequestExtended extends TaDatagridRequest {
  size?: number;
  sortField?: string;
  sortDirection?: string;
  filters?: FilterNonLeafNode;
}

export interface LinkedBPs {
  businessProcesses: BusinessProcess[];
}
