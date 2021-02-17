export interface ProcessingPurposeCategoryListResponseRawInterface {
  content: ProcessingPurposeCategoryItemResponseRawInterface[];
  totalPages: number;
  totalElements: number;
  pageable: {
    pageSize: number;
    pageNumber: number;
  };
}

export interface ProcessingPurposeCategoryItemResponseRawInterface {
  id: string;
  version: number;
  category: string;
  isCustom: boolean;
  isHidden: boolean;
  numberOfProcessingPurposes: number;
  numberOfLinkedRecords: number;
}

export interface ProcessingPurposeCategoryItemViewInterface
  extends ProcessingPurposeCategoryItemResponseRawInterface {
  checked?: boolean;
  hidden?: boolean;
}
