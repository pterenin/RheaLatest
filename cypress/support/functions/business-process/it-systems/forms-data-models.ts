export module BusinessProcessData {
  export interface ItSystems {
    data: Data;
    status: number;
    ok: boolean;
  }
}

export interface Data {
  processName: string;
  title: string;
  systems: System[];
}

export interface System {
  searchPrefix: string;
  category: string;
}
