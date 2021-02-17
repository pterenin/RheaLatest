import { CreatorInterface } from './contact.model';
import { HighRiskInterface } from './high-risk.model';
import { BaseDomainInterface } from './base-domain-model';

export type DataElementCategory = string;
export type DataElementStatus = string;
export type DataElementType = string;

export interface DataElementInterface {
  category: DataElementCategory;
  categoryId: string;
  created: string;
  createdBy: CreatorInterface;
  custom: true;
  dataElement: string;
  id: string;
  lastModified: string;
  lastModifiedBy: CreatorInterface;
  nonCustom: false;
  rheaHighRiskType: HighRiskInterface[];
  status: DataElementStatus;
  type: DataElementType;
  version: number;
  isCustom: false;
  isSelected?: boolean;
}

export interface DataElementOtherInterface {
  category: DataElementCategory;
  dataElement: string;
  id: string;
  type: DataElementType;
  version: number;
}

export interface DataElementCategoryInterface {
  category: string;
  id: string;
  isCustom: boolean;
  isHidden: boolean;
  numberOfDataElements?: number;
  numberOfLinkedRecords: number;
  version: number;
}

export interface DataElementLevelInterface {
  dataElementTypes: string[];
}

export type DataElementLinkType = 'STEP_3_4' | 'STEP_6' | 'IT_SYSTEM';

export interface DataElementLinkedInterface {
  id: string;
  name: string;
  type: DataElementLinkType;
  version: number;
  selected?: boolean;
  businessProcessId: string;
  businessProcessName: string;
}

export interface BpLinkedInterface {
  id: string;
  name: string;
  version: number;
  linkedRecords: DataElementLinkedInterface[];
}

export interface DataElementDetailsInterface {
  id: string;
  name: string;
  isCustom: boolean;
  version: number;
  businessProcesses?: BpLinkedInterface[];
}

export interface CustomDataElementInterface {
  category: string;
  dataElement: string;
  dataElementCategoryI18nKey: string;
  dataElementI18nKey: string;
  dataElementTypeI18nKey: string;
  highRiskTypes: HighRiskInterface[];
  id: string;
  isCustom: boolean;
  isHidden: boolean;
  type: string;
  version: number;
}

export class CustomDataElement {
  category: string;
  categoryId: string;
  dataElement: string;
  dataElementId: string;
  type: DataElementType;
  version: number;
}

/**
 * Data element server details: From server
 */
export interface DataElementServerDetails extends BaseDomainInterface {
  businessProcesses: DataElementServerDetailsBusinessProcess[];
  category: DataElementCategoryInterface;
  custom: boolean;
  name: string;
}

/**
 * Data element server details business process: From server
 */
export interface DataElementServerDetailsBusinessProcess {
  id: string;
  linkedRecords: DataElementServerDetailsLinkedRecord[];
  name: string;
  version: number;
}

/**
 * Data element server details linked record: From server
 */
export interface DataElementServerDetailsLinkedRecord {
  id: string;
  name: string;
  type: DataElementLinkType;
  version: number;
}
