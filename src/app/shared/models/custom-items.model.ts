import {
  BpLinkedInterface,
  DataElementCategoryInterface,
  DataElementServerDetailsBusinessProcess
} from './data-elements.model';
import { BaseDomainInterface } from './base-domain-model';
import { DataSubjectServerDetailsBusinessProcess } from './data-subjects.model';

export interface CustomItemDetailsInterface {
  id: string;
  name: string;
  isCustom: boolean;
  version: number;
  businessProcesses?: BpLinkedInterface[];
}

export interface CustomItemServerDetails extends BaseDomainInterface {
  businessProcesses:
    | DataElementServerDetailsBusinessProcess[]
    | DataSubjectServerDetailsBusinessProcess[];
  category: DataElementCategoryInterface;
  custom: boolean;
  name: string;
  dataSubject?: string;
}

export type CustomItemLinkType = 'STEP_3_4' | 'STEP_6' | 'IT_SYSTEM';

export interface CustomItemLinkedInterface {
  id: string;
  name: string;
  type: CustomItemLinkType;
  version: number;
  selected?: boolean;
  businessProcessId: string;
  businessProcessName: string;
}
