export interface BaseDomainInterface {
  id: string;
  version: number;
}

export enum BaseDomainTypeEnum {
  BusinessProcess,
  CompanyEntity,
  ItSystem,
  ThirdParty
}
