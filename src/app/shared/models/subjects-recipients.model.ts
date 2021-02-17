import { HighRiskInterface } from './high-risk.model';

type DataRecipientCategory = string;
type DataSubjectCategory = string;
type DataSubjectStatus = string;

export interface CategoryInterface {
  id: string;
  version: number;
  created: any;
  lastModified: any;
  createdBy: string;
  lastModifiedBy: string;
  category: string;
  categoryName: string;
}

export interface DataSubjectRecipientInterface {
  id: string;
  version: number;
  // Data Subject and Data Recipient returning  Object and string respectively.
  category: string | CategoryInterface;
}

export interface DataRecipientTypeInterface
  extends DataSubjectRecipientInterface {
  dataRecipientType: string;
}

export interface DataSubjectTypeInterface
  extends DataSubjectRecipientInterface {
  dataSubjectType: string;
  isSelected: boolean;
  rheaHighRiskType: HighRiskInterface[];
  status: DataSubjectStatus;
}

export interface DataSubjectVolumeInterface {
  highRisk: boolean;
  i18nKey: string;
  id: string;
  lowerBound: number;
  name: string;
  upperBound: number;
  version: number;
}

export interface DataSubjectRecipientRequest {
  dataRecipientTypes: DataRecipientTypeInterface;
  dataSubjectTypes: DataSubjectTypeInterface;
}
