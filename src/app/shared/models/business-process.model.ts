type BusinessProcessStatus = 'Draft' | 'In Progress' | 'Published';

export interface BusinessProcessInterface {
  comment: string;
  dataRecipientTypes: [];
  dataSubjectTypes: [];
  dataSubjectVolume: {};
  description: string;
  id: string;
  identifier: string;
  itSystems: [];
  name: string;
  notes: string;
  owningCompany: string;
  status: BusinessProcessStatus;
  version: number;
}
