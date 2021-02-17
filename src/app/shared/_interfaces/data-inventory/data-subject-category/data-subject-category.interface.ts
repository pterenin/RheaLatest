export interface DataSubjectCategoryListResponseRawInterface {
  content: DataSubjectCategoryItemResponseRawInterface[];
  totalPages: number;
  totalElements: number;
  pageable: {
    pageSize: number;
    pageNumber: number;
  };
}

export interface DataSubjectCategoryItemResponseRawInterface {
  categoryId: string;
  categoryVersion: number;
  categoryName: string;
  isCustom: boolean;
  isHidden: boolean;
  numberOfDataSubjects: number;
  numberOfLinkedRecords: number;
}

export interface DataSubjectCategoryItemViewInterface
  extends DataSubjectCategoryItemResponseRawInterface {
  checked?: boolean;
  hidden?: boolean;
}
