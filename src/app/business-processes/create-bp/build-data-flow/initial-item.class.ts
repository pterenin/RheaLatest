import { LocationInterface } from 'src/app/shared/models/location.model';

interface ItemInterface {
  id?: string;
  nodeId: string;
  locationId: string;
  category: string;
  locationIds: string[];
  isItSystem?: boolean;
  isDsOrDr?: boolean;
  dataElementIds?: string[];
  processingPurposeIds?: string[];
}

export class InitialItemClass {
  label: string;
  id: string;
  dataElementIds: string[];
  processingPurposeIds: string[];
  locationIds: string[];
  locations: any[];
  nodeId: string;
  tag: string;
  isSelected: boolean;
  isItSystem: boolean;
  isDsOrDr: boolean;

  constructor(label: string, item: ItemInterface, dataFlowLocations) {
    this.label = label;
    this.id = item.nodeId || item.id;
    this.dataElementIds = item.dataElementIds || [];
    this.processingPurposeIds = item.processingPurposeIds || [];
    this.locationIds = item.locationIds || [];
    this.locations = item.locationIds
      ? item.locationIds.map(location =>
          this.getCountryCode(location, dataFlowLocations)
        ) || []
      : [];
    this.nodeId = item.nodeId || item.id;
    this.tag = item.category;
    this.isSelected = false;
    this.isItSystem = item.isItSystem;
    this.isDsOrDr = item.isDsOrDr;
  }

  private getCountryCode(id: string, dataFlowLocations) {
    const locationFound = dataFlowLocations.find(
      (location: LocationInterface) => location.id === id
    );

    return locationFound ? locationFound.country.threeLetterCode : '';
  }
}
