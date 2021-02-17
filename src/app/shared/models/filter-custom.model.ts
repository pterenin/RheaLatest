export interface CustomFilter {
  id: string;
  name: string;
  filterType: string;
}

export interface CustomFilterType {
  name: string;
  subType: string;
  parentType: string;
  category?: string;
  hidden?: boolean;
}

export interface CustomFilterTypeMapped {
  name: string;
  subType: string;
  parentType: string;
  selected: boolean;
  filterOptions: [];
}

export interface CustomFilterTypeBody {
  filters: {
    RISK?: {
      nestedFilterValue: null;
      value: any[];
    };
    TAG?: {
      nestedFilterValue: null;
      value: any[];
    };
    BP_TAG?: {
      nestedFilterValue: null;
      value: any[];
    };
    OWN_ORG?: {
      nestedFilterValue: null;
      value: any[];
    };
    OWN_ROLE?: {
      nestedFilterValue: null;
      value: any[];
    };
    OWN_NAME?: {
      nestedFilterValue: null;
      value: any[];
    };
    OWN_DEPT?: {
      nestedFilterValue: null;
      value: any[];
    };
    SYS_OWN?: {
      nestedFilterValue: null;
      value: any[];
    };
    OWN_EMAIL?: {
      nestedFilterValue: null;
      value: any[];
    };
    SYS_LOC?: {
      nestedFilterValue: null;
      value: any[];
    };
    SEC_CRL?: {
      nestedFilterValue: null;
      value: any[];
    };
    STATUS?: {
      nestedFilterValue: null;
      value: any[];
    };
  };
  name: string;
  version?: number;
  id: string;
}

export interface CustomFilterTypesResponse {
  filterOptions: {
    content: CustomFilterType[];
    pageable: string; // INSTANCE?
    last: boolean;
    totalPages: number;
    totalElements: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    numberOfElements: number;
    first: boolean;
    size: number;
    number: number;
    empty: boolean;
  };
}

export interface SaveFilterViewResponse {
  id: string;
  version: number;
}
