import { DataSubjectVolumeInterface } from './step-1/step-1.model';
import { BaseCategoryInterface } from 'src/app/shared/components/categorical-view/category-model';
import { DataSubjectTypeInterface } from 'src/app/shared/models/subjects-recipients.model';
import { TagGroupInterface } from 'src/app/shared/models/tags.model';
import { LocationInterface } from 'src/app/shared/models/location.model';
import { url } from 'inspector';

const convertToURLPath = URLString =>
  encodeURIComponent(URLString.toLowerCase().replace(/ /g, '-'));

export enum CREATE_BP_NAV_TITLES {
  'Background',
  'Owner',
  'Subjects',
  'Systems',
  'Data Flow',
  'Security & Risk',
  'Systems Selection'
}

export enum CREATE_BP_NAV_URLS {
  'background',
  'owner',
  'subjects',
  'it-systems',
  'data-flow',
  'security-and-risk',
  'systems-selection'
}

export interface BpNavItems {
  label: string;
  url: string;
  title: string;
}

// [i18n-tobeinternationalized] (titles)
export const CREATE_BP_NAV_DATA = (
  hasRHEA_NEW_UI_STEPS_34_LICENSE: boolean
): BpNavItems[] => {
  const navData = [
    {
      label: CREATE_BP_NAV_TITLES[0], // [i18n-tobeinternationalized]
      url: CREATE_BP_NAV_URLS[0],
      title: 'Business Process Record Background'
    },
    {
      label: CREATE_BP_NAV_TITLES[1], // [i18n-tobeinternationalized]
      url: CREATE_BP_NAV_URLS[1],
      title: 'Business Process Owner'
    },
    {
      label: hasRHEA_NEW_UI_STEPS_34_LICENSE
        ? CREATE_BP_NAV_TITLES[6]
        : CREATE_BP_NAV_TITLES[2], // [i18n-tobeinternationalized]
      url: hasRHEA_NEW_UI_STEPS_34_LICENSE
        ? CREATE_BP_NAV_URLS[6]
        : CREATE_BP_NAV_URLS[2],
      title: `Who's involved in this business process`
    },
    {
      label: CREATE_BP_NAV_TITLES[3], // [i18n-tobeinternationalized]
      url: CREATE_BP_NAV_URLS[3],
      title: 'Which Systems are involved in this business process?'
    },
    {
      label: CREATE_BP_NAV_TITLES[4], // [i18n-tobeinternationalized]
      url: CREATE_BP_NAV_URLS[4],
      title:
        'Select who is sending to and who is receiving from each system that this business process involves.'
    },
    {
      label: CREATE_BP_NAV_TITLES[5], // [i18n-tobeinternationalized]
      url: CREATE_BP_NAV_URLS[5],
      title:
        'Complete the security & retention period to finish this business process'
    }
  ];

  const removeSystemsFromNavigation = () => {
    return [...navData.slice(0, 3), ...navData.slice(4, navData.length)];
  };

  return hasRHEA_NEW_UI_STEPS_34_LICENSE
    ? removeSystemsFromNavigation()
    : navData;
};

export interface OnPageRouteChange {
  success: boolean;
  url?: string;
}
export interface DataSubjectCategoryInterface {
  id: string;
  label: string;
  items: DataSubjectInterface[];
}

export interface DataSubjectInterface {
  id: string;
  label: string;
  isSelected: boolean;
}

export interface DataAccessTypeCategoryInterface {
  id: string;
  label: string;
  items: DataAccessTypeInterface[];
}

export interface DataAccessTypeInterface {
  id: string;
  label: string;
  isSelected: boolean;
}

export interface OptionItemsInterface {
  id: string;
  isDsOrDr: boolean;
  isItSystem: undefined | boolean;
  isSelected: boolean;
  label: string;
  locationIds: string[];
  locations: string[];
  nodeId: string;
  tag: string;
  selected?: boolean;
}
export interface OptionsInterface {
  id: string;
  items: OptionItemsInterface[];
  label: string;
}

export interface ItSystemsCategoryInterface {
  id: string;
  label: string;
  type?: string;
  entityId: string;
  location: string;
  locationIds: string[];
  dataElementIds: string[];
  processingPurposeIds: string[];
  locations: string[];
  nodeId: string;
  notes: string;
  recieveFromOptions: OptionsInterface[];
  sendToOptions: OptionsInterface[];
  tag: string;
}

export interface ItSystemInterface {
  id: string;
  label: string;
  tag: string;
  version: number;
  isSelected?: boolean;
  locations?: LocationInterface[];
  unReselectable?: boolean;
  nodeId?: string;
}

export interface ItSystemNameTypeInterface {
  id: string;
  name: string;
  type: string;
  version: number;
}

export interface ItSystemPropertiesInterface {
  id: string;
  name: string;
  description: string;
  identifier: string;
  notes: string;
  version: number;
  locations: {
    countryId: string;
    globalRegionId: string;
    id: string;
    stateOrProvinceId: string;
    version: number;
  }[];
  dataElements: [
    {
      dataElement: string;
      id: string;
    }
  ];
  processingPurpose: [
    {
      id: string;
      processingPurpose: string;
      isCustom: boolean;
    }
  ];
}

export interface ReviewerInterface {
  id: string;
  label: string;
}

export interface BusinessProcessInterface {
  id: string;
  description: string;
  identifier: string;
  name: string;
  version: number;
  dataSubjectVolumeId: string;
  dataSubjectVolume: DataSubjectVolumeInterface;
  owningCompany: object;
  dataRecipientTypes: Array<object>;
  dataSubjectTypes: BaseCategoryInterface<DataSubjectTypeInterface>[];
  itSystems: BaseCategoryInterface<ItSystemInterface>[];
  tags: Array<TagGroupInterface>;
}
