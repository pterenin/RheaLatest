import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';

export interface OwnerEntityInterface extends BaseDomainInterface {
  owner: OwnerInterface;
  owningCompanyEntity: any;
  department: string;
  role: String;
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
