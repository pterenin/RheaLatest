export interface CategoryItemWithLocations {
  searchPrefix: string;
  category: string;
  locations: SelectLocation[];
}

export interface CategoryItem {
  searchPrefix: string;
  category: string;
}

export interface SelectLocation {
  region: string;
  countries: string[];
}
