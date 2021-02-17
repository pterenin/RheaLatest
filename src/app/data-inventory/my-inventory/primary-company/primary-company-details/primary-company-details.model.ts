import { DataControllerProcessor } from 'src/app/shared/models/controller-process.model';
import { IndustrySector } from 'src/app/shared/models/industry-sector.model';
import { LocationInterface } from 'src/app/shared/models/location.model';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { ContactTypeInterface } from 'src/app/shared/components/contact/contact.model';

export interface ContactInterface {
  address?: string;
  city?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  stateOrProvince?: string;
  country?: string;
  role?: string;
  street?: string;
  zip?: string;
}

export interface ContactTypeInterface {
  id?: string;
  type?: string;
  version?: number;
  companyEntityUse?: boolean;
}

export interface DetailInterface {
  companyName?: string;
  entityType?: string;
  country?: string;
  stateOrProvince?: string;
  industrySectors?: string[];
  dataControllerOrProcessor?: string;
  contacts: ContactInterface[];
  entity: BaseDomainInterface;
  notes: string;
  companyProfileEditUrl: string;
}

export interface ContactResponseInterface {
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
    countryName?: string;
    stateOrProvinceName?: string;
  };
  phone?: string;
  version: number;
  role?: string;
  zip?: string;
}

export interface PrimaryCompanyResponseInterface {
  contactType: ContactTypeInterface;
  contactResponse: ContactResponseInterface;
  contactResponses: ContactResponseInterface[];
  dataControllerOrProcessor: DataControllerProcessor;
  businessStructureResponse: {
    id: string;
    version: number;
    businessStructure: string;
  };
  id: string;
  industrySectors: IndustrySector[];
  locations: LocationInterface[];
  name: string;
  notes: string;
  version: number;
  companyProfileEditUrl: string;
}
