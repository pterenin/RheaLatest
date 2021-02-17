export interface CompanyAffiliateDetailsInterface {
  id: string;
  version: number;
  name: string;
  description: string;
  identifier: string;
  notes: string;
  created: string;
  ownerId: string;
  ownerName: string;
  contactType: { type: 'Contact' };
  externalId: string;
  externalDataSource: string;
  recordType: string;
  entityType: string;
  locations: LocationInterface[];
  industrySectors: any[];
  contact: ContactInterface;
  contacts: ContactInterface[];
  entityRole: string;
  note: string;
  legalEntity: string;
  businessStructure: string;
  companyAddress: CompanyAddressInterface;
}

export interface CreateNewCompanyAffiliateFullInterface {
  details: {
    businessStructureId: string;
    contactId: string;
    contactIds: string[];
    contactTypeId: string;
    description: string;
    entityRole: string;
    entityType: string;
    id: string;
    industrySectorIds: string[];
    legalEntityId: string;
    locations: LocationInterface[];
    name: string;
    note: string;
    notes: string;
    version: number;
  };
  tags: TagInterface[];
}

interface LocationInterface {
  countryId?: string;
  countryName?: string;
  countryRegionId?: string;
  globalRegionId?: string;
  stateOrProvinceId?: string;
  stateOrProvinceName?: string;
}

interface TagInterface {
  id: string;
  multipleValuesAllowed: boolean;
  tagGroupName: string;
  tagGroupType: string;
  values: TagValueInterface[];
}

interface TagValueInterface {
  id: string;
  tag: string;
  externalId: string;
  parentTagValueId: string;
  selectable: boolean;
  children: any[];
}

interface ContactInterface {
  id: string;
  version: number;
  address: string;
  city: string;
  email: string;
  fullName: string;
  phone: string;
  zip: string;
  role: string;
  location: LocationInterface;
}

export interface CompanyAddressInterface {
  id?: string;
  version?: number;
  address: string;
  city: string;
  email: string;
  fullName?: string;
  phone: string;
  zip: string;
  role?: string;
  location: LocationInterface;
}
