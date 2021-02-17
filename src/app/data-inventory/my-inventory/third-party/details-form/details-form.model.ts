import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { IndustrySector } from 'src/app/shared/models/industry-sector.model';
import { TagGroupInterface } from '../../../../shared/models/tags.model';

export interface SelectBoxInterface {
  id: string;
  name: string;
}

export interface Location {
  country: CountrySelectBoxInterface;
  stateProvince: SelectBoxInterface;
}

export interface CountrySelectBoxInterface {
  id: string;
  name: string;
  stateOrProvinces: SelectBoxInterface[];
}

export interface ContactInterface {
  address?: string;
  city?: string;
  email?: string;
  fullName?: string;
  id?: string;
  location?: {
    countryId: string;
    globalRegionId: string;
    id: string;
    stateOrProvinceId: string;
    version: number;
  };
  phone?: string;
  version: number;
  zip?: string;
}

export interface BaseCCPAQuestionInterface {
  id: string;
  question: string;
  version: number;
}

export interface CCPAQuestionInterface extends BaseCCPAQuestionInterface {
  index: number;
  checked: false;
}

export interface CompanyEntity {
  id: string;
  type: string;
  name: string;
}
export interface ThirdPartyDetailsGetResponse {
  companyEntityResponses?: [];
  contact?: {
    address?: string;
    city?: string;
    email?: string;
    fullName?: string;
    id: string;
    location?: {
      countryId: string;
      stateOrProvinceId: string;
      globalRegionId: string;
      id: string;
      version: number;
    };
    phone?: string;
    version: number;
    zip?: string;
  };
  contractEndDate: Date;
  contractStartDate: Date;
  description?: string;
  id: string;
  identifier?: string;
  industrySectors?: IndustrySector[];
  locations?: {
    countryId: string;
    stateOrProvinceId: string;
    globalRegionId: string;
    id: string;
    version: number;
  }[];
  locationsForDropdown?: Array<any>;
  name: string;
  entityRole: string;
  type: string;
  ccpaQuestionIds?: string[];
  notes: string;
  version: number;
}

export interface ThirdPartyDetailsPutRequest extends BaseDomainInterface {
  contactId?: string;
  contractEndDate?: Date;
  contractStartDate?: Date;
  description?: string;
  id: string;
  identifier?: string;
  industrySector?: IndustrySector;
  industrySectorIds?: string[];
  locations?: {
    countryId: string;
    globalRegionId?: string;
    stateOrProvinceId?: string;
  }[];
  owningCompanyEntityIds?: string[];
  tags?: TagGroupInterface[];
  name?: string;
  entityRole?: string;
  type?: string;
  role?: string;
  ccpaQuestionIds?: string[];
  notes?: string;
  version: number;
}

export interface ThirdPartyDetailsFullPutRequest {
  details: {
    contactId?: string;
    contractEndDate?: Date;
    contractStartDate?: Date;
    description?: string;
    id: string;
    identifier?: string;
    industrySector?: IndustrySector;
    industrySectorIds?: string[];
    locations?: {
      countryId: string;
      globalRegionId?: string;
      stateOrProvinceId?: string;
    }[];
    owningCompanyEntityIds?: string[];
    name?: string;
    entityRole?: string;
    type?: string;
    role?: string;
    ccpaQuestionIds?: string[];
    notes?: string;
    version: number;
  };
  tags?: TagGroupInterface[];
}
