import {
  GdprRiskCriteraInterface,
  HighRiskFactorsCategoryInterface,
  HighRiskInterface
} from './high-risk.model';
import { BaseDomainInterface } from './base-domain-model';
import { SearchResponseInterface } from './search.model';

type ProcessingPurposeCategory = string;
type ProcessingPurposeStatus = string;

export interface ProcessingPurposeInterface extends BaseDomainInterface {
  category: ProcessingPurposeCategory;
  processingPurpose: string;
  gdprRiskCriteria: GdprRiskCriteraInterface[];
  highRiskType: HighRiskInterface[];
  status: ProcessingPurposeStatus;
  isCustom: boolean;
  categoryHidden?: boolean;
  hidden?: boolean;
}

export interface ProcessingPurposeCategoryInterface
  extends BaseDomainInterface {
  category: string;
  id: string;
  isCustom: boolean;
  isHidden: boolean;
  numberOfProcessingPurposes?: number;
  numberOfLinkedRecords: number;
  version: number;
  label?: string;
}

export interface ProcessingPurposeRequestInterface {
  id?: string;
  category: string;
  highRiskFactorCategoryIds: string[];
  processingPurpose: string;
  version?: number;
}

export interface ProcessingPurposeUpsertResponseInterface {
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

export interface ProcessingPurposeCategoryListResponseInterface {
  processingPurposes: SearchResponseInterface<
    ProcessingPurposeSettingsInterface
  >;
  categoryDetails: ProcessingPurposeCategoryListDetailsInterface;
}

export interface ProcessingPurposeSettingsInterface
  extends BaseDomainInterface {
  risk: string;
  isCustom: boolean;
  isHidden: boolean;
  name: string;
  highRiskFactorCategories: HighRiskFactorsCategoryInterface[];
  numberOfLinkedRecords: number;
}

export interface ProcessingPurposeCategoryListDetailsInterface {
  categoryName: string;
  id: string;
  version: number;
  isCustom: boolean;
  isHidden: boolean;
}
