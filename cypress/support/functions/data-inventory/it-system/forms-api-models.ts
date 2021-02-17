export interface ITSystemDetailAPI {
  legalEntities: CyAPI;
  legalEntitiesTypeBusinessAssociate: CyAPI;
  legalEntitiesTypeServiceProvider: CyAPI;
  legalEntitiesTypeCustomer: CyAPI;
  legalEntitiesTypeVendor: CyAPI;
  legalEntitiesTypePartner: CyAPI;
  legalEntitiesTypeCompanyAffiliate: CyAPI;
  legalEntitiesTypePrimaryEntity: CyAPI;
  dataSubjectVolumes: CyAPI;
  locationsCountries: CyAPI;
  baseRecordsFiltersPOST: CyAPI;
}

export interface CyAPI {
  method: string;
  url: string;
  alias: string;
}

export enum Method {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE'
}
