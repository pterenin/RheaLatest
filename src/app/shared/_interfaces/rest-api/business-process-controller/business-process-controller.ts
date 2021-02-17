import { LegalBasisInterface } from '../legal-bases-controller/legal-bases-controller';

export interface BusinessProcessOverviewInterface {
  id: string;
  version: number;
  identifier: string;
  name: string;
  description: string;
  lastModified: string;
  entityType: string;
  contact: ContactInterface;
  contacts: ContactInterface[];
  tags: any[];
  buildAssessmentUrl: null;
  status: string;
  algorithmRiskIndicator: null;
  inherentRiskIndicator: null;
  residualRiskIndicator: null;
  incompleteRiskEvaluationFields: any[];
  mapped: boolean;
  revalidationDate: Date | null;
}

interface ContactInterface {
  id: string;
  version: number;
  address: null;
  city: null;
  email: null;
  fullName: string;
  phone: null;
  zip: null;
  location: LocationInterface;
}

interface LocationInterface {
  id: string;
  version: number;
  countryCode: null;
  countryName: null;
  regionCode: null;
  regionName: null;
  stateOrProvinceCode: null;
  stateOrProvinceId: null;
  stateOrProvinceName: null;
}

export interface BusinessProcessApprovalInterface {
  id: string;
  version: number;
  name: string;
  identifier: string;
  status: string;
  associations: AssociationInterface[];
  processingPurposes: ProcessingPurposeInterface[];
}

export interface AssociationInterface {
  processingPurposeId: string;
  legalBasisId: string;
}

export interface ProcessingPurposeInterface {
  id: string;
  version: number;
  category: string;
  name: string;
  isCustom: boolean;
  isCategoryCustom: boolean;
}

export interface ProcessingPurposeWithLegalBasisInterface
  extends ProcessingPurposeInterface {
  legalBasis?: LegalBasisInterface;
  legalBasisName?: string;
}

export interface BusinessProcessApprovalUpdateInterface {
  associations: AssociationInterface[];
  id: string;
  status: string;
  version: number;
}

export interface BusinessProcessApprovalUpdateResponseInterface {
  id: string;
  version: number;
}

export interface BusinessProcessOwnerInterface {
  id?: string;
  companyId: string;
  companyName?: string;
  departmentId: string;
  departmentName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  location: BusinessProcessOwnerLocationInterface;
  created?: string;
  lastModified?: string;
  primaryOwner?: boolean;
  fullName: string;
  role: string;
  version: number;
}

export interface BusinessProcessOwnerLocationInterface {
  countryId: string;
  stateOrProvinceId: string;
  globalRegionId: string;
}

export interface BusinessProcessDetailsInterface {
  id: string;
  version: number;
  name: string;
  description: string;
  dataSubjectVolumeId: string | null;
}

export interface BusinessProcessDetails {
  id: string;
  version: number;
  name: string;
  description: string;
  dataSubjectVolume: DataSubjectVolume | null;
}

export interface DataSubjectVolume {
  id: string;
  name: string;
}

export interface NotesInterface {
  id: string;
  version: number;
  notes: string;
}

export interface StatusInterface {
  id?: string;
  status: string;
  version: number;
}

export interface BusinessProcessSecurityControlsInterface {
  id: string;
  securityControlIds: string[];
  securityControlOther: string;
  version: number;
}

export interface BusinessProcessSecurityAndRiskInterface {
  id: string;
  version: number;
  securityControlIds: string[];
  securityControlOther: string;
  dataRetention: RetentionPeriod;
  additionalDataElementIds: string[];
  additionalProcessingPurposeIds: string[];
}

export interface BusinessProcessSecurityAndRiskPutInterface {
  id: string;
  version: number;
  securityControlIds: string[];
  securityControlOther: string;
  dataRetention: RetentionPeriod;
  additionalDataElementIds: string[];
  additionalProcessingPurposeIds: string[];
}

export interface RetentionPeriod {
  description?: string;
  id?: string;
  summary?: string;
  type: 'Days' | 'Weeks' | 'Months' | 'Years' | 'Other';
  value?: string;
  version?: number;
}

export interface RetentionPeriodValues {
  retentionPeriodValue: 'Days' | 'Weeks' | 'Months' | 'Years' | 'Other';
  retentionPeriodUnits: '';
  retentionPeriodUnitsOther: string;
}
