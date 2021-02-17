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

/**
 * enumeration to enable or disable any license feature for plutus
 * related custom method: cy.updateByApiFeatureStatus(AccountId, ApplicationFeaturesEnum, Status(boolean))
 */
export enum ApplicationFeaturesEnum {
  CUSTOMIZATION_DATA_SUBJECTS_LICENSE = 'CUSTOMIZATION_DATA_SUBJECTS_LICENSE',
  CUSTOMIZATION_DEPARTMENT_LICENSE = 'CUSTOMIZATION_DEPARTMENT_LICENSE',
  RISK_PROFILE_LICENSE = 'RISK_PROFILE_LICENSE',
  RISK_PROFILE_THIRD_PARTY_LICENSE = 'RISK_PROFILE_THIRD_PARTY_LICENSE',
  CUSTOMIZATION_DATA_ELEMENT_LICENSE = 'CUSTOMIZATION_DATA_ELEMENT_LICENSE',
  RHEA_NEW_UI_STEPS_34_LICENSE = 'RHEA_NEW_UI_STEPS_34_LICENSE',
  CUSTOMIZATION_PROCESSING_PURPOSES_LICENSE = 'CUSTOMIZATION_PROCESSING_PURPOSES_LICENSE',
  RHEA_NEW_UI_ALL_STEPS_LICENSE = 'RHEA_NEW_UI_ALL_STEPS_LICENSE',
  REPORTING_TRAINING_LICENSE = 'REPORTING_TRAINING_LICENSE',
  RISK_SERVICE_V2 = 'RISK_SERVICE_V2'
}

export interface ApplicationFeatures {
  CUSTOMIZATION_DATA_SUBJECTS_LICENSE: boolean;
  CUSTOMIZATION_DEPARTMENT_LICENSE: boolean;
  RISK_PROFILE_LICENSE: boolean;
  RISK_PROFILE_THIRD_PARTY_LICENSE: boolean;
  CUSTOMIZATION_DATA_ELEMENT_LICENSE: boolean;
  RHEA_NEW_UI_STEPS_34_LICENSE: boolean;
  CUSTOMIZATION_PROCESSING_PURPOSES_LICENSE: boolean;
  RHEA_NEW_UI_ALL_STEPS_LICENSE: boolean;
  REPORTING_TRAINING_LICENSE: boolean;
  RISK_SERVICE_V2: boolean;
}

/**
 * Maps the api OAuth response from AAA
 */
export interface ApiAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  accountId: string;
  firstName: string;
  lastName: string;
  userId: string;
  userIdHashed: string;
  email: string;
  jti: string;
}

export interface Contact {
  address: string | null;
  city: string | null;
  email: string | null;
  fullName: string | null;
  id?: string;
  location: Location;
  phone: string | null;
  version: number;
  zip: string | null;
}

export interface Location {
  countryId: string | null;
  countryRegionId: string | null;
  globalRegionId: string | null;
  stateOrProvinceId: string | null;
}
