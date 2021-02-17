import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { BaseRecordInterface } from 'src/app/shared/models/base-record-model';

export interface OwnerEntityInterface extends BaseDomainInterface {
  owner: OwnerInterface;
  owningCompanyEntity: any;
  department: string;
}

export interface OwnerInterface extends BaseDomainInterface {
  fullName: string;
  email: string;
}

export interface CompanyEntityInterface {
  content: EntityContentInterface[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: FunctionStringCallback;
  totalElements: number;
  totalPages: number;
}

export interface EntityContentInterface {
  id: string;
  name: string;
}

export interface BusinessProcessApprovalAssociation
  extends BaseRecordInterface {
  legalBasisId: string;
  processingPurposeId: string;
}

export interface BusinessProcessApproval extends BaseRecordInterface {
  status: string;

  associations: BusinessProcessApprovalAssociation[];
}
