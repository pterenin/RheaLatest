import { BaseDomainInterface } from './base-domain-model';

export interface BaseRecordInterface extends BaseDomainInterface {
  entityType: string;
  dataTransferRisk: boolean;
}

export interface DeletionItemInterface extends BaseRecordInterface {
  name: string;
}

export interface BaseRecordDeletionResponse {
  hasErrors: boolean;
  errors: BaseRecordDeletionErrorMessage[];
  dbConflicts: BaseRecordDeletionErrorMessage[];
}

export interface BaseRecordDeletionErrorMessage {
  record: {
    id: string;
    version: number;
    recordType: string;
    name: string;
  };
  status: string;
  message: string;
  conflictingRecords: {
    id: string;
    version: number;
    recordType: string;
    name: string;
    identifier: string;
  }[];
}
