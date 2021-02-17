export type RouteType = 'BUSINESS_PROCESS' | 'MY_INVENTORY' | 'SETTINGS';
export const Events = {
  AAA_TOP_HEADER_LOADED: 'AAATopheaderLoaded'
};
export const ThirdPartyType = {
  PRIMARY_ENTITY: 'PRIMARY_ENTITY',
  COMPANY_AFFILIATE: 'COMPANY_AFFILIATE',
  THIRD_PARTY: 'THIRD_PARTY',
  VENDOR: 'VENDOR',
  PARTNER: 'PARTNER',
  CUSTOMER: 'CUSTOMER',
  SERVICE_PROVIDER: 'SERVICE_PROVIDER',
  BUSINESS_ASSOCIATE: 'BUSINESS_ASSOCIATE',
  OTHER: 'OTHER'
};

export const DataFlowView = {
  MAP: 'MAP',
  FLOWCHART: 'FLOWCHART'
};

export const DataFlowTableType = {
  DATA_SUBJECT: 'DATA_SUBJECT',
  DATA_RECIPIENT: 'DATA_RECIPIENT',
  SYSTEM: 'SYSTEM'
};

export const SETTINGS = {
  ShowRiskFields: false
};

export const SystemRecordsFilterType = {
  SORT: 'SORT',
  OWNER: 'OWNER',
  TAGS: 'TAGS',
  DS: 'DS', // Data Subjects
  DE: 'DE', // Data Elements
  PP: 'PP', // Processing Purposes
  HL: 'HL', // Hosting Locations
  SYS_OWN: 'SYS_OWN', // Owning Entity system record filter
  SYS_DS: 'SYS_DS', // Data Subjects system record filter
  SYS_DE: 'SYS_DE', // Data Elements system record filter
  SYS_PP: 'SYS_PP', // Processing Purposes system record filter
  SYS_LOC: 'SYS_LOC' // Hosting Locations system record filter
};

export const DataInventoryDataType = {
  DS: 'DS', // Data Subjects
  DE: 'DE', // Data Elements
  PP: 'PP', // Processing Purposes
  HL: 'HL' // Hosting Locations
};

export const RISK_PROFILE_URL = {
  VERSION_1: '/details/riskprofile?recordId=',
  VERSION_2: '/risk-profile?recordId='
};

export const REGION_IDS = {
  AFRICA: 'AFRICA',
  ASIA: 'ASIA',
  CARIBBEAN: 'CARIBBEAN',
  CENTRAL_AMERICA: 'CENTRAL_AMERICA',
  EUROPE: 'EUROPE',
  EU: 'EU',
  NORTH_AMERICA: 'NORTH_AMERICA',
  OCEANIA: 'OCEANIA',
  OTHER: 'OTHER',
  SOUTH_AMERICA: 'SOUTH_AMERICA'
};

export const STATUS_BUSINESS_PROCESS_LIST_PAGE = [
  'DRAFT',
  'IN_REVIEW',
  'REVISE',
  'PUBLISH'
];

export enum DownloadReportEvent {
  Start = 'DOWNLOAD_REPORT_START',
  End = 'DOWNLOAD_REPORT_END'
}
