export interface DataElementCategoryListResponseRawInterface {
  content: DataElementCategoryItemResponseRawInterface[];
  totalPages: number;
  totalElements: number;
  pageable: {
    pageSize: number;
    pageNumber: number;
  };
}

export interface DataElementCategoryItemResponseRawInterface {
  id: string;
  version: number;
  category: string;
  isCustom: boolean;
  isHidden: boolean;
  numberOfDataElements: number;
  numberOfLinkedRecords: number;
}

export interface DataElementCategoryItemViewInterface
  extends DataElementCategoryItemResponseRawInterface {
  checked?: boolean;
  hidden?: boolean;
}
