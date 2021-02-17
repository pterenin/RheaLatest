import { PersonInterface } from 'src/app/shared/services/record-listing/record-listing.model';

export interface BaseRecordsFiltersRequestInterface {
  customFilters: any;
  filters: any;
  page: number;
  search: string;
  size: number;
  sortDirection: 'DESC' | 'ASC';
  sortField: string;
}

export interface BaseRecordsFiltersResponseInterface {
  content: BaseRecord[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    unpaged: boolean;
  };
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}

export interface BaseRecord {
  id: string;
  identifier: string;
  name: string;
  description: string;
  buildAssessmentUrl: string;
  entityType: string;
  highRisk: boolean;
  riskLevel?: any;
  status: string;
  owner: PersonInterface;
  lastModified: string;
  linkedBPCount: number;
  linkedBPs: string[];
  algorithmRiskIndicator: string;
  inherentRiskIndicator: boolean;
  residualRiskIndicator: boolean;
  currentRiskIndicator: boolean;
  incompleteRiskEvaluationFields: string[];
  entityTypeOtherName: string;
  legalEntityType: string;
  legalEntityName: string;
  mapped: boolean;
  dataTransferRisk: boolean;
  tags: any[];
  owners: any[];
  revalidationDate: Date | null | string;
  flattenedTags?: any[];
}

export interface ItSystemRecordsSearchFiltersRequestInterface {
  customFilters?: any;
  filters?: any;
  page?: number;
  search?: string;
  size?: number;
  sortDirection?: string;
  sortField?: string;
}

export interface ItSystemRecordsFilterInterface {
  addedRecords: AddedRecordInterface[];
  availableRecords: AvailableRecordInterface[];
}

interface AddedRecordInterface {
  entityId: string;
  name: string;
  legalEntity: LegalEntityInterface;
  dataSubjects: any[];
  dataElementIds: any[];
  processingPurposeIds: any[];
  locations: LocationElementInterface[];
}

interface LegalEntityInterface {
  id: string;
  version: number;
  name: string;
  description: null;
  identifier: string;
  notes: null;
  created: null;
  ownerId: null;
  ownerName: null;
  contact: null;
  contactType: null;
  externalId: null;
  externalDataSource: null;
  type: string;
  entityRole: string;
  industrySectors: IndustrySectorInterface[];
}

interface IndustrySectorInterface {
  id: string;
  sector: string;
  name: string;
}

interface LocationElementInterface {
  location: LocationLocationInterface;
  dataTransferCount: number;
}

interface LocationLocationInterface {
  id: string;
  version: number;
  globalRegionId: string;
  countryId: string;
  countryName: string;
  countryRegionId: null;
  stateOrProvinceId: null;
  stateOrProvinceName: null;
  businessProcessUsage: any[];
}

interface AvailableRecordInterface {
  id: string;
  identifier: string;
  name: string;
  description: null;
  buildAssessmentUrl: string;
  entityType: string;
  owner: OwnerInterface;
  lastModified: string;
  linkedBPCount: number;
  linkedBPs: LinkedBPInterface[];
  entityTypeOtherName: null;
  legalEntityType: string;
  legalEntityName: string;
}

interface LinkedBPInterface {
  id: string;
  name: string;
}

interface OwnerInterface {
  id: null;
  version: null;
  address: null;
  city: null;
  email: null;
  fullName: null;
  phone: null;
  zip: null;
  location: null;
}
