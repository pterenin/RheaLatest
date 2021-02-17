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
