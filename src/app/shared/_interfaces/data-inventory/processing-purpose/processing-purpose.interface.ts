export interface ProcessingPurposeListResponseRawInterface {
  content: ProcessingPurposeItemResponseRawInterface[];
  totalPages: number;
  totalElements: number;
  pageable: {
    pageSize: number;
    pageNumber: number;
  };
}

export interface ProcessingPurposeItemResponseRawInterface {
  id: string;
  version: number;
  identifier: string;
  processingPurpose: string;
  account: {
    id: string;
  };
  status: 'ACTIVE';
  category: string;
  gdprRiskCriteria: any[];
  highRiskFactorCategories: any[];
  isCustom: boolean;
  isCategoryCustom: boolean;
  processingPurposeI18nKey: string;
  processingPurposeCategoryI18nKey: string;
  categoryHidden: boolean;
  hidden: boolean;
}
