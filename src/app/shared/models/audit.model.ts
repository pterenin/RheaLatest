export interface AuditInterface {
  author: string;
  commitDate: number;
  change: string;
  auditIndex: string;
}

export interface AuditCollectionInterface {
  changes: AuditInterface[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
  numberOfElements: number;
}
