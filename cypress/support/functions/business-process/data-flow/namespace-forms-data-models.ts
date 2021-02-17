import { CategoryItem } from '../../shared/models-data';

export interface DataFlow {
  data: Data;
  status: number;
  ok: boolean;
}
export interface Data {
  processName: string;
  title: string;
  subjects: CategoryItem[];
  recipients: CategoryItem[];
  systems: CategoryItem[];
  notes: string;
}
