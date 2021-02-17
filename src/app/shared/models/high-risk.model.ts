export interface HighRiskInterface {
  id: string;
  type: string;
  version: number;
}

export interface HighRiskFactorsCategoryInterface {
  id: string;
  name: string;
  answer: string;
  version: number;
  disabled?: boolean;
}

export interface GdprRiskCriteraInterface {
  gdprRiskCriteria: string;
  id: string;
  version: number;
}
