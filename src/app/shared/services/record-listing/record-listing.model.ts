import { BaseRecordInterface } from '../../models/base-record-model';

export type Status = 'Draft' | 'In Progress' | 'Published';

export type RecordType =
  | 'BusinessProcess'
  | 'Organization'
  | 'Vendor'
  | 'System';

export interface PersonInterface {
  firstName: string;
  lastName: string;
  email: string;
  fullName?: string;
}

export interface BpSearchResultInterface {
  id: string;
  identifier: string;
  name: string;
  description: string;
  highRisk: boolean;
  status: string;
  owner: PersonInterface;
  revalidationDate: Date | null | string;
  lastModified: number;
}

export interface GetSearchBpResponseInterface {
  content: BpSearchResultInterface[];
  size: number; // Requested number of business processes per page
  numberOfElements: number; // Actual number of elements returned
  first: boolean; // Whether returned page is the first
  last: boolean; // Whether returned page is the last
  number: number; // The actual page number returned
  sort: string; // How the records are sorted
  totalElements: number; // How many records total match requested search
  totalPages: number; // How many pages total are needed, given size
}

export interface BpRecordInterface extends BaseRecordInterface {
  id: string;
  identifier: string;
  recordType: 'BusinessProcess';
  version: number;
}
