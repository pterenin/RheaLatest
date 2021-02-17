export module BusinessProcessData {
  export interface Owner {
    data: Data;
    status: number;
    ok: boolean;
  }
}

export interface Data {
  processName: string;
  entity: string;
  entityRole: string;
  fullName: string;
  email: string;
  department: string;
}
