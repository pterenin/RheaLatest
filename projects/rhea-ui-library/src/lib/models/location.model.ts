export interface StateOrProvinceInterface {
  country: CountryInterface;
  english: string;
  id: string;
  name: string;
  shortValue: string;
  version: number;
  selected?: boolean;
  i18nKey?: string;
}

export interface GlobalRegionInterface {
  countriesSelected?: number;
  selected?: boolean;
  i18nKey: string;
  id: string;
  name: string;
  version: number;
  countries?: CountryInterface[];
  total?: number;
}

export interface CountryInterface {
  globalRegions: GlobalRegionInterface[];
  i18nKey: string;
  id: string;
  name: string;
  stateOrProvinces: StateOrProvinceInterface[];
  threeLetterCode: string;
  twoLetterCode: string;
  version: number;
  selected?: boolean;
  selectedStates?: string[];
  locationId?: string;
  locationIds?: string[];
}

export interface LocationInterface {
  country: CountryInterface;
  globalRegion: GlobalRegionInterface;
  id: string;
  stateOrProvince: StateOrProvinceInterface;
  version: number;
  selected?: boolean;
  threeLetterCode?: string;
}

export interface LocationsInterface {
  id: string;
  name: string;
  countries: CountryInterface[];
  total?: number;
}

export interface Country {
  id: string;
  name: string;
  twoLetterCode: string;
  threeLetterCode: string;
  selected: boolean;
}

export interface SelectedRegionCount {
  region: string;
  selectedCountryCount: number;
}
