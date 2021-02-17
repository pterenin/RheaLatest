import { CategoryItem } from '../../shared';

export interface FinalReview {
  data: Data;
  status: number;
  ok: boolean;
}

export interface Data {
  processName: string;
  title: string;
  processingPurposesLegalBasis: ProcessingPurposesLegalBasis[];
  status: string;
}
export interface ProcessingPurposesLegalBasis {
  processingPurpose: CategoryItem;
  legalBasis: CategoryItem;
}
