export interface DataElementListResponseRawInterface {
  content: DataElementItemResponseRawInterface[];
  totalPages: number;
  totalElements: number;
  pageable: {
    pageSize: number;
    pageNumber: number;
  };
}

export interface DataElementItemResponseRawInterface {
  category: string;
  dataElement: string;
  categoryId: string;
  id: string;
  identifier: string;
  isCustom: boolean;
  isHidden: boolean;
  type: string;
  version: number;
  dataElementI18nKey: string;
  highRiskTypes: [];
  dataElementCategoryI18nKey: string;
  dataElementTypeI18nKey: string;
}
