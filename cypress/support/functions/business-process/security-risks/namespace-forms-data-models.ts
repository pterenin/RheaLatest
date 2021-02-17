import { CategoryItem } from '../../shared/models-data';

export interface SecurityRisks {
  data: Data;
  status: number;
  ok: boolean;
}

export interface Data {
  processName: string;
  title: string;
  securityControls: SecurityControls;
  retentionPeriod: RetentionPeriod;
  processingPurposes: CategoryItem[];
  dataElements: CategoryItem[];
}
export interface RetentionPeriod {
  period: string;
  periodUnit: string;
}

export interface SecurityControls {
  items: string[];
  other: string;
}
