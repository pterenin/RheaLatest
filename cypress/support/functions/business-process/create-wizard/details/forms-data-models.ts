export interface Details {
  data: Data;
  status: number;
  ok: boolean;
}

export interface Data {
  peopleRanges: string;
  description: string;
  processName: string;
  notes: string;
  owner: Owner;
}

export interface Owner {
  company: string;
  partyType: string;
  recordName: string;
  role: string;
  fullName: string;
  email: string;
  wrongEmail: string;
  department: string;
}
