import { ContactTypeInterface } from 'src/app/shared/components/contact/contact.model';
import { TagGroupInterface } from 'src/app/shared/models/tags.model';
import { CompanyAddressInterface } from 'src/app/shared/_interfaces/rest-api/company-affiliate-controller/company-affiliate-controller';

declare const _: any;

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

export interface BusinessStructureOptions {
  [countryName: string]: Array<{
    id: string;
    businessStructure: string;
    name?: string;
  }>;
}

export interface ContactInterface {
  address?: string;
  city?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  id?: string;
  stateOrProvince?: string;
  stateOrProvinceId?: string;
  country?: {
    name: string;
  };
  countryId?: string;
  location?: {
    countryId: string;
    stateOrProvinceId: string;
    globalRegionId: string;
    id: string;
    version: number;
  };
  role?: any;
  version: number;
  zip?: string;
}
export interface CompanyAffiliateDetailsGetResponse {
  contact?: ContactInterface;
  contacts?: ContactInterface[];
  businessStructureOptions?: SelectBoxInterface[];
  businessStructure?: {
    id: string;
    businessStructure: string;
  };
  companyAddress?: CompanyAddressInterface;
  description?: string;
  entityRole?: string;
  id: string;
  identifier?: string;
  industrySectors?: { id: string; sector: string; name: string }[];
  legalEntity?: {
    algorithmRiskIndicator: any;
    attachments: any[];
    businessStructure: {
      id: string;
      version: number;
      businessStructure: string;
      countryCode: string;
      countryName: string;
    };
    contact: any;
    contactType: any;
    created: string;
    createdBy: { id: string; dimAccount: any };
    createdByUser: any;
    currentRiskIndicator: any;
    description: any;
    entityRole: string;
    entityType: string;
    externalDataSource: any;
    externalId: any;
    id: string;
    identifier: string;
    incompleteEvaluationFields: any[];
    industrySectors: any[];
    inherentRiskIndicator: any;
    internalId: string;
    lastModified: string;
    lastModifiedBy: { id: string; dimAccount: any };
    legalEntity: any;
    linkedBPCount: any;
    locationIds: any[];
    locations: any[];
    name: string;
    notes: string;
    owner: { id: string; dimAccount: any };
    recordType: string;
    residualRiskIndicator: any;
    rheaDataRetention: any;
    riskChange: any[];
    tags: any[];
    version: number;
    viewed: any[];
  };
  locations?: {
    countryId: string;
    countryName: string;
    stateOrProvinceId?: string;
    stateOrProvinceName?: string;
  }[];
  /**
   * locationsForDropdown is filled out after fetching the values needed,
   * so it is not part of the initial response but quickly filled in before returning from the service.
   */
  locationsForDropdown?: Array<any>;
  name: string;
  note: string;
  notes: string;
  version: number;
  industrySectorOptions?: any;
  contactType: ContactTypeInterface;
}

export interface CompanyAffiliateDetailsPutRequest {
  businessStructureId: string;
  companyAddress?: CompanyAddressInterface;
  contactId?: string;
  contactIds: string[];
  contactTypeId?: string;
  description?: string;
  entityRole: string;
  entityType?: string;
  id?: string;
  industrySectorIds: string[];
  legalEntityId: string;
  locations: [
    {
      countryId: string;
      countryRegionId?: string;
      globalRegionId?: string;
      stateOrProvinceId?: string;
    }
  ];
  name: string;
  note: string;
  notes?: string;
  version: number;
}

export interface CompanyAffiliateDetailsFullPutRequest {
  details: {
    id?: string;
    contactIds?: string[];
    entityRole?: string;
    businessStructureId?: string;
    companyAddress?: CompanyAddressInterface;
    industrySector?: string;
    industrySectorIds?: string[];
    legalEntityId?: string;
    locations?: [
      {
        countryId: string;
        stateOrProvinceId?: string;
      }
    ];
    contactType?: ContactType;
    contactTypeId?: string;
    name?: string;
    note?: string;
    version: number;
  };
  tags: TagGroupInterface[];
}

export interface LegalEntityInterface {
  contactType: string;
  created: string;
  description: string;
  entityRole: string;
  externalDataSource: string;
  externalId: string;
  id: string;
  identifier: string;
  industrySectors: any[];
  name: string;
  notes: string;
  ownerId: string;
  ownerName: string;
  recordType: string;
  type: string;
  version: number;
}

export enum ContactType {
  DPO = 'DPO',
  LEGAL_CONTACT = 'LEGAL_CONTACT'
}

export const ROLES = [
  { name: 'DPO', id: 'DPO' },
  { name: 'LEGAL CONTACT', id: 'LEGAL_CONTACT' }
];
