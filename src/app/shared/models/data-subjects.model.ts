import { GdprRiskCriteraInterface, HighRiskInterface } from './high-risk.model';
import { BaseDomainInterface } from './base-domain-model';
import { SearchResponseInterface } from './search.model';

type DataSubjectCategory = string;
type DataSubjectStatus = string;

export interface DataSubjectInterface extends BaseDomainInterface {
  category: DataSubjectCategory;
  processingPurpose: string;
  gdprRiskCriteria: GdprRiskCriteraInterface[];
  highRiskType: HighRiskInterface[];
  status: DataSubjectStatus;
  isCustom: boolean;
  categoryHidden?: boolean;
  hidden?: boolean;
}

export interface DataSubjectCategoryInterface extends BaseDomainInterface {
  id: string;
  categoryId?: string;
  category: string;
  categoryName?: string;
  isCustom: boolean;
  isHidden: boolean;
  numberOfDataSubjects?: number;
  numberOfLinkedRecords: number;
  version: number;
  highRisk?: boolean;
  label?: string;
}

export interface DataSubjectRequestInterface {
  categoryId?: string;
  dataSubject: string;
  highRisk: boolean;
  version?: number;
}

export interface DataSubjectUpsertResponseInterface {
  id: string;
  version: number;
  processingPurpose: string;
  account: {
    id: string;
  };
  status: string;
  category: string;
  highRiskType: any[]; // TODO: add type
  gdprRiskCriteria: any[]; // TODO: add type
  highRiskFactorCategories: HighRiskInterface[];
  processingPurposeI18nKey: string;
  custom: boolean;
  hidden: boolean;
  categoryCustom: boolean;
  categoryHidden: boolean;
  processingPurposeCategoryI18nKey: string;
}

export interface DataSubjectCategoryListResponseInterface {
  processingPurposes: SearchResponseInterface<DataSubjectSettingsInterface>;
  categoryDetails: DataSubjectCategoryListDetailsInterface;
}

export interface DataSubjectSettingsInterface extends BaseDomainInterface {
  risk: string;
  isCustom: boolean;
  isHidden: boolean;
  name: string;
  highRisk: boolean;
  numberOfLinkedRecords: number;
}

export interface DataSubjectCategoryListDetailsInterface {
  categoryName: string;
  id: string;
  version: number;
  isCustom: boolean;
  isHidden: boolean;
}

export type DataSubjectLinkType = 'STEP_3_4' | 'STEP_6' | 'IT_SYSTEM';

/**
 * Data subject server details: From server
 */
export interface DataSubjectServerDetails extends BaseDomainInterface {
  businessProcesses: DataSubjectServerDetailsBusinessProcess[];
  category: DataSubjectCategoryInterface;
  custom: boolean;
  name: string;
  dataSubject?: string;
}

/**
 * Data subject server details business process: From server
 */
export interface DataSubjectServerDetailsBusinessProcess {
  id: string;
  linkedRecords: DataSubjectServerDetailsLinkedRecord[];
  name: string;
  version: number;
}

/**
 * Data subject server details linked record: From server
 */
export interface DataSubjectServerDetailsLinkedRecord {
  id: string;
  name: string;
  type: DataSubjectLinkType;
  version: number;
}
