export interface ItSystemControllerInterfaceInterface {
  id: string;
  version: number;
  name: string;
  description: string;
  identifier: string;
  notes: null;
  created: null;
  ownerId: null;
  ownerName: string;
  contact: null;
  contactType: null;
  externalId: null;
  externalDataSource: null;
  dataSubjectsWithLocations: DataSubjectsWithLocationInterface[];
  locations: LocationInterface[];
  dataElements: any[];
  processingPurpose: any[];
  riskLevel: string;
  entityType: string;
}

export interface DataSubjectsWithLocationInterface {
  dataSubjectTypeId: string;
  dataSubject: string;
  locations: LocationInterface[];
  category: CategoryInterface;
}

export interface CategoryInterface {
  categoryId: string;
  categoryVersion: number;
  categoryName: string;
  isCustom: null;
  isHidden: null;
  numberOfDataSubjects: null;
  numberOfLinkedRecords: null;
}

export interface LocationInterface {
  id: string;
  version: number;
  globalRegionId: string;
  countryId: string;
  countryName: string;
  countryRegionId: null;
  stateOrProvinceId: null | string;
  stateOrProvinceName: null | string;
  businessProcessUsage: any[];
}
