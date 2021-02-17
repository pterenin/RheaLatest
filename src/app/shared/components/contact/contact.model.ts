export interface ContactInterface {
  address?: string;
  city?: string;
  email?: string;
  fullName?: string;
  id?: string;
  location?: {
    countryId: string;
    stateOrProvinceId: string;
    globalRegionId: string;
    id: string;
    version: number;
  };
  role?: any;
  phone?: string;
  version: number;
  zip?: string;
  country?: {
    name: string;
  };
  state?: string;
  cityStateZip?: string;
  cityState?: string;
}

export class Contact implements ContactInterface {
  address?: string;
  city?: string;
  email?: string;
  fullName?: string;
  id?: string;
  location?: {
    countryId: string;
    stateOrProvinceId: string;
    globalRegionId: string;
    id: string;
    version: number;
  };
  phone?: string;
  role?: string;
  version: number;
  zip?: string;
  cityStateZip?: string;
  constructor() {}
}

export interface ContactTypeInterface {
  companyEntityUse: boolean;
  id: string;
  type: string;
  version: number;
}

export interface ContactIdResponse {
  id: string;
}
