export interface DataSubjectListResponseRawInterface
  extends Array<DataSubjectItemResponseRawInterface> {}

export interface DataSubjectItemResponseRawInterface {
  id: string;
  version: number;
  dataSubject: string;
  category: any;
  categoryId: string;
  categoryVersion: number;
  categoryName: string;
  isCustom: boolean;
  isHidden: boolean;
  numberOfDataSubjects: number;
  numberOfLinkedRecords: number;
  dataSubjectI18nKey: string;
  status: string;
  highRisk: boolean;
  dataSubjectCategoryI18nKey: string;
}
