export interface LegalBasisInterface {
  category: 'STANDARD' | 'SPECIAL';
  description: string;
  displayOrder: number;
  id: string;
  legalBasis: string;
  shortName: string;
  version: number;
}
