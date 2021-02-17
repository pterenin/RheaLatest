import { ContactInterface } from 'src/app/shared/components/contact/contact.model';
import { GlobalRegionInterface } from 'src/app/shared/models/location.model';
import { RetentionPeriod } from 'src/app/shared/_interfaces';
import { TagGroupInterface } from '../../../../shared/models/tags.model';

export interface SelectBoxInterface {
  id: string;
  name: string;
}

export interface LocationForRequest {
  countryId?: string;
  stateOrProvinceId?: string;
}

export interface LocationFieldInterface {
  disable?: boolean;
  id: string;
  country?: {
    name: string;
    id: string;
    stateOrProvinces?: [
      {
        name: string;
        id: string;
      }
    ];
  };
  state?: {
    name: string;
    id: string;
  }[];
}

export interface ItSystemDetailsPutRequest {
  contactId?: string;
  contactIds?: string[];
  dataSubjectTypes?: [
    {
      dataSubjectTypeId: string;
      locations: [
        {
          countryId: string;
          stateOrProvinceId?: string;
        }
      ];
    }
  ];
  dataSubjectVolumeId?: string;
  description?: string;
  id?: string;
  legalEntityId?: string;
  locations?: [
    {
      countryId?: string;
      globalRegionId?: string;
      stateOrProvinceId?: string;
    }
  ];
  dataElementIds?: string[];
  processingPurposeIds?: string[];
  tags?: TagGroupInterface[];
  name?: string;
  notes?: string;
  version: number;
  dataRetention?: RetentionPeriod;
}

export interface ItSystemDetailsGetResponse {
  contact?: ContactInterface;
  contacts?: ContactInterface[];
  dataSubjectVolume?: {
    highRisk?: true;
    id?: string;
    lowerBound?: number;
    name?: string;
    upperBound?: number;
  };
  dataSubjectsWithLocations?: [
    {
      dataSubjectTypeId: string;
      locations: [];
      businessProcessUsage?: [
        {
          bpId: string;
          bpName: string;
        }
      ];
      disable?: boolean;
    }
  ];
  description?: string;
  id?: string;
  identifier?: string;
  legalEntity?: {
    description?: string;
    id?: string;
    identifier?: string;
    industrySector?: {
      id?: string;
      name?: string;
      sector?: string;
    };
    name?: string;
    notes?: string;
    role?: string;
    type?: string;
    version?: number;
  };
  locations?: [
    {
      businessProcessUsage?: [
        {
          bpId: string;
          bpName: string;
        }
      ];
      disable?: boolean;
      countryId?: string;
      globalRegionId?: string;
      id?: string;
      stateOrProvinceId?: string;
      version?: number;
    }
  ];
  /**
   * locationsForDropdown is filled out after fetching the values needed,
   * so it is not part of the initial response but quickly filled in before returning from the service.
   */
  locationsForDropdown?: Array<any>;
  individualTypes?: any;
  individualRecordsVolume?: any;
  name?: string;
  notes?: string;
  version?: number;
  legalEntities?: any;
  fullCountryList?: GlobalRegionInterface[];
  dataRetention?: RetentionPeriod;
}

export interface DataSubjectFieldInterface {
  id: string;
  dataSubjectTypeId?: {
    category?: string;
    dataSubjectType?: string;
    dataSubjectTypeCategoryI18nKey?: string;
    dataSubjectTypeI18nKey?: string;
    highRisks?: [];
    id?: string;
    version?: number;
  };
  locations?: any[];
  disable?: boolean;
}

export interface DataSubjectLocationsForRequest {
  dataSubjectTypeId?: string;
  locations?: [];
  disable?: boolean;
}
