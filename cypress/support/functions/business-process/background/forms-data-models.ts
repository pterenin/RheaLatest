export module BusinessProcessData {
  export interface Background {
    data: Data;
    status: number;
    ok: boolean;
  }
}

export interface Data {
  peopleRanges: string;
  description: string;
  processName: string;
  notes: string;
}
