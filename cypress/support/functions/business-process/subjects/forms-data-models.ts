import { CategoryItemWithLocations } from '../../shared/models-data';

export module BusinessProcessData {
  export interface Subjects {
    data: Data;
    status: number;
    ok: boolean;
  }
}

export interface Data {
  processName: string;
  title: string;
  subjects: CategoryItemWithLocations[];
  recipients: CategoryItemWithLocations[];
}
