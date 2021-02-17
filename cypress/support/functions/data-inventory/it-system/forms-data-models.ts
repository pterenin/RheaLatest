export interface CreateRheaItSystems {
  data: Data;
  status: number;
  ok: boolean;
}

export interface Data {
  contact: Contact;
  created: string;
  dataSubjectTypeIds: string[];
  dataSubjects: DataSubject[];
  dataSubjectVolume: DataSubjectVolume;
  volumeOfDataSubjectRecords: string;
  description: string;
  id: string;
  identifier: string;
  legalEntity: LegalEntity;
  locations: DataLocation[];
  name: string;
  notes: string;
  ownerId: string;
  ownerName: OwnerName;
  version: number;
}

export interface Contact {
  address: string;
  city: string;
  email: string;
  fullName: string;
  id: string;
  location: ContactLocation;
  phone: string;
  version: number;
  zip: string;
}

export interface ContactLocation {
  countryId: string;
  globalRegionId: string;
  id: string;
  stateOrProvinceId: string;
  version: number;
}

export interface DataSubjectVolume {
  highRisk: boolean;
  id: string;
  lowerBound: number;
  name: string;
  upperBound: number;
}

export interface DataSubject {
  subjectName: string;
  locations: DataSubjectLocation[];
}

export interface DataSubjectLocation {
  region: string;
  countries: string[];
}

export interface LegalEntity {
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

export interface DataLocation {
  country: string;
  states: string[];
}

export interface OwnerName {
  search: string;
  category: string;
  ownerName: string;
}
