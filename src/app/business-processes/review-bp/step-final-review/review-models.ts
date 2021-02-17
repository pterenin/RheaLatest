import { ReviewTableRowInterface } from './review-table/review-table.component';

export interface ReviewTableLegalBasisResponse {
  category: string;
  description: string;
  displayOrder: number;
  id: string;
  legalBasis: any;
  shortName: string;
  version: number;
}

export interface LegalBasisInterface {
  id: string;
  version: number;
  legalBasis: string;
  shortName: string;
  description: string;
  category: string;
  displayOrder: number;
}

export interface ReviewTableRowResponseInterface {
  id: string;
  version: number;
  name: string;
  identifier: string;
  status: string;
  dataRows: ReviewTableRowInterface[];
  legalBasisRows: LegalBasisInterface[];
}

export interface ReviewTableProcessingPurposeResponse {
  id: string;
  version: number;
  status: string;
  associations: Array<ProcessingPurposeLegalBasisAssociation>;
  processingPurposes: Array<ProcessingPurposeCategoryNameResponse>;
}

export interface ProcessingPurposeCategoryNameResponse {
  id: string;
  version: number;
  category: string;
  name: string;
  isCustom?: boolean;
  isCategoryCustom?: boolean;
}

export interface ProcessingPurposeLegalBasisAssociation {
  associations: [
    {
      legalBasisId: string;
      processingPurposeId: string;
    }
  ];
  id: string;
  status: string;
  version: number;
}
