import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { LocationService } from '../../services/location/location.service';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { Subscription } from 'rxjs';
import {
  CountryInterface,
  GlobalRegionInterface,
  StateOrProvinceInterface
} from '../../models/location.model';
import { exists } from '../../utils/basic-utils';

declare const _: any;

@AutoUnsubscribe(['_getLocations$'])
@Component({
  selector: 'ta-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LocationComponent implements OnInit, OnDestroy {
  // selectedLocations are only used for the initial mapping of selected locations in locationData.
  @Input() public isReadOnly = false;
  @Input() public selectedLocations: CountryInterface[] = [];
  @Input() public stateProvinceIsSelectable = false;
  @Input() public locations: GlobalRegionInterface[] = [];
  @Input() public useTabset: boolean;
  @Input() public setActiveTabId: string;
  @Input() public placeholder: string;
  @Input() public selectedIdsFromLocation: CountryInterface;

  @Output() public itemsSelected = new EventEmitter<any[]>(); // TODO: use regionAndCountrySelectionEmitter?
  @Output() public emitRegionAndCountrySelection = new EventEmitter<any[]>();
  @Output() public countSelectedLocations = new EventEmitter<number>();
  @Output() public selectedCountry = new EventEmitter<any[]>();
  @Output() public isSelectingStates = new EventEmitter<boolean>();
  @Output() public emitActiveTabId = new EventEmitter<string>();
  @Output() public selectedStatesFromLocation = new EventEmitter<any>();

  public locationData: any[] = [];
  public searchValue = '';
  public searchCountryAndStatesByName: any[];
  public _getLocations$: Subscription;

  public constructor(private locationService: LocationService) {
    this.mapInitialSelections = this.mapInitialSelections.bind(this);
    this.useTabset = false;
  }

  public ngOnInit() {
    this.locationData = _.cloneDeep(this.locations);

    if (!exists(this.locationData) || this.locationData.length <= 0) {
      this._getLocations$ = this.locationService
        .getFullCountryList(true)
        .subscribe(this.mapInitialSelections);
    } else {
      this.sortRegionByName();
    }
  }

  public isEurope(region) {
    return region.name === 'Europe';
  }

  public updateSelectedLocationsCount() {
    this.countSelectedLocations.emit(this.getSelectedLocationsCount());
  }

  private mapInitialSelections(regionList: GlobalRegionInterface[]) {
    this.locationData = regionList.map(region => {
      const countries = region.countries.map(country => {
        const foundLocation = this.selectedLocations.find(
          loc => country.id === loc.id
        );

        let selectedStates;
        if (foundLocation) {
          if (Array.isArray(foundLocation.selectedStates)) {
            selectedStates = foundLocation.selectedStates;
          } else {
            selectedStates = foundLocation.stateOrProvinces;
          }
        }

        const selected = this.isInitialSelection(country);

        return {
          ...country,
          selectedStates,
          selected
        };
      });

      return {
        ...region,
        countries
      };
    });

    this.initialStateProvinceSelected();
    this.sortRegionByName();
    this.countSelectedLocations.emit(this.getSelectedLocationsCount());
  }

  private sortRegionByName() {
    this.locationData.sort((regionA, regionB) =>
      regionA.name > regionB.name ? 1 : regionB.name > regionA.name ? -1 : 0
    );
  }

  private isInitialSelection(country: CountryInterface) {
    const selection = this.selectedLocations.find(c => c.id === country.id);
    return selection !== undefined;
  }

  public ngOnDestroy() {}

  public shouldDisplayRegion(region) {
    return (
      !this.isReadOnly ||
      region.countries.some(
        country => country.selected && country.selected === true
      )
    );
  }

  public checkAllCountriesInEu(event: Event, index: number) {
    if (event !== null) {
      event.preventDefault();
    }

    if (!this.locationData) {
      return;
    }

    const isCurrentlySelected = this.locationData
      .reduce((acc, region) => acc.concat(region.countries), [])
      .filter(country => this.isEuCountry(country))
      .some(country => country.selected);

    const selectionEmission = [];

    this.locationData.forEach(region => {
      region.countries.forEach(country => {
        if (this.isEuCountry(country)) {
          country.selected = !isCurrentlySelected;
          selectionEmission.push(country);
        }
      });
    });

    this.itemsSelected.emit(selectionEmission); // emits the country that was selected.
    this.emitRegionAndCountrySelection.emit(this.locationData);
    this.countSelectedLocations.emit(this.getSelectedLocationsCount());
  }

  private isEuCountry(country) {
    return country.globalRegions.some(r => r.name === 'EU');
  }

  public hasEuCountry() {
    if (!this.locationData) {
      return false;
    }
    const euCountryCount = this.locationData
      .reduce((acc, region) => acc.concat(region.countries), [])
      .filter(country => this.isEuCountry(country)).length;

    return euCountryCount > 0;
  }

  public checkAllCountriesForRegion(event: Event, index: number) {
    if (event !== null) {
      event.preventDefault();
    }

    if (exists(index)) {
      const selectedCount = this.getSelectedItemCount(index);

      this.locationData[index].countries.forEach(
        country => (country.selected = selectedCount === 0)
      );

      this.itemsSelected.emit(this.locationData[index].countries);
      this.countSelectedLocations.emit(this.getSelectedLocationsCount());
    }
  }

  public selectCountry(event: Event, country) {
    this.itemsSelected.emit([country]);
    this.countSelectedLocations.emit(this.getSelectedLocationsCount());
  }

  public isIndeterminate(index: number, onlyEU = false): boolean {
    return (
      this.getSelectedItemCount(index, onlyEU) > 0 && !this.isAllSelected(index)
    );
  }

  public isAllSelected(index: number): boolean {
    if (exists(index)) {
      const selectedCount = this.getSelectedItemCount(index);

      return selectedCount === this.locationData[index].countries.length;
    }
    return false;
  }

  public getSelectedItemCount(index: number, onlyEU = false): number {
    if (exists(index)) {
      return this.getItemCount(index, onlyEU, true);
    }
    return 0;
  }

  public getItemCount(
    index: number,
    onlyEU = false,
    onlySelected = false
  ): number {
    if (
      exists(index) &&
      this.locationData &&
      this.locationData[index].countries
    ) {
      return this.locationData[index].countries.reduce((acc, val) => {
        return (onlyEU ? this.isEuCountry(val) : true) &&
          (onlySelected ? val.selected : true)
          ? acc + 1
          : acc;
      }, 0);
    }
    return 0;
  }

  public getSelectedLocationsCount() {
    if (!this.locationData) {
      return 0;
    }
    const count = this.locationData.reduce((accum, region) => {
      if (region.countries) {
        return (
          accum + region.countries.filter(country => country.selected).length
        );
      }
    }, 0);
    return count;
  }

  public getSelectionCountIndicator(
    index: number,
    onlyEU = false,
    separator = '/'
  ): string {
    let selectedCountryCount = 0;
    let countryCount = 0;
    const region = this.locationData[index];

    if (this.isReadOnly && region.totalOriginalCountries) {
      selectedCountryCount = region.countries.length;
      countryCount = region.totalOriginalCountries;

      return `${selectedCountryCount}${separator}${countryCount}`;
    }

    selectedCountryCount = this.getSelectedItemCount(index, onlyEU);
    countryCount = this.getItemCount(index, onlyEU);

    return `${selectedCountryCount}${separator}${countryCount}`;
  }

  public selectStates(country) {
    this.selectedCountry.emit(country);
    this.isSelectingStates.emit(true);
  }

  public getCountSelectedStateProvinces(country) {
    return country.stateOrProvinces.length > 0
      ? `(${country.selectedStates ? country.selectedStates.length : 0}/${
          country.stateOrProvinces.length
        } States)`
      : '';
  }

  public onActiveTabId(tabId: string) {
    /**
     * This will set the current tab after the back button
     * from the select States
     */
    this.emitActiveTabId.emit(`region-${tabId}-panel`);
  }

  /**
   * Serves as removed that bind to selected countries
   */
  public removeSelectedCountries(selectedLocation: CountryInterface) {
    const lookupCountries = location => {
      location.countries.forEach(country => {
        if (country.id === selectedLocation.id) {
          country.selected = false;
          this.selectCountry(null, country);
        }
      });
    };

    const lookUpRegions = location => {
      return selectedLocation.globalRegions.forEach(region => {
        const regionId = Array.isArray(region) ? region[0].id : region.id;

        if (location.id === regionId) {
          lookupCountries(location);
        }
      });
    };

    this.locationData.forEach(location => {
      lookUpRegions(location);
    });
  }

  /**
   * Serve as the main function for search location
   * Search looks for county or state/provinces
   */
  public searchLocation(event: { searchValue: string }) {
    this.searchValue = event.searchValue;
    const query = event.searchValue ? event.searchValue.toLowerCase() : '';
    const result = [];

    const searchForCountry = (region: any[], country: CountryInterface) => {
      const byName =
        country.name && country.name.toLowerCase().search(query) > -1;

      const byThreeLetterCode =
        country.threeLetterCode &&
        country.threeLetterCode.toLowerCase().search(query) > -1;

      if (byName || byThreeLetterCode) {
        country['fromRegion'] = region;
        result.push(country);
      }
    };

    const searchForStates = (region: any[], country: CountryInterface) => {
      country.stateOrProvinces.forEach(state => {
        if (state.name && state.name.toLowerCase().search(query) > -1) {
          state['fromCountry'] = country;
          state['fromRegion'] = region;
          result.push(state);
        }
      });
    };

    if (query.length > 1) {
      this.locationData.forEach(region => {
        region.countries.forEach((country: CountryInterface) => {
          searchForCountry(region, country);

          if (this.stateProvinceIsSelectable) {
            searchForStates(region, country);
          }
        });
      });
    }

    this.searchCountryAndStatesByName = result;
  }

  /**
   * Serve as the country or state select
   * Emit value to parent
   */
  public onSelectedSearchResultByStates(
    countryParam: CountryInterface,
    stateParam: StateOrProvinceInterface
  ) {
    const isSelectedState = (country: CountryInterface) => {
      if (stateParam.selected) {
        country.selectedStates = [...country.selectedStates, stateParam.id];
      } else {
        country.selectedStates = _.cloneDeep(country.selectedStates).filter(
          stateId => stateId !== stateParam.id
        );
      }

      // country.selected = country.selectedStates.length > 0;
      // Uncomment above and comment below to auto deselect country
      country.selected = true; // Let the user remove the country
      this.selectedStatesFromLocation.emit(country);
    };

    const isSelectedCountry = (country: CountryInterface) => {
      this.selectedLocations.forEach((oldSelectedState, index) => {
        if (oldSelectedState.id === country.id) {
          this.selectedLocations.splice(index, 1);
        }
      });

      this.selectCountry(null, country);
    };

    this.locationData.forEach(region => {
      region.countries.forEach((country: CountryInterface) => {
        if (country.id === countryParam.id) {
          isSelectedState(country);
          isSelectedCountry(country);
        }
      });
    });
  }

  /**
   * Sort country by ASC
   * This function required for selected Location tab
   */
  public getSelectedLocationByNameAsc() {
    return _.sortBy(this.selectedLocations, 'name');
  }

  /**
   * Since state is in own component
   * Connecting between location and state should share
   *
   * Serve as initial StatesProvince selected
   *
   * TODO: RHEA-3363 - Improvement
   */
  public initialStateProvinceSelected() {
    const selectedStates = {};
    if (this.selectedIdsFromLocation) {
      const fromLocation = this.selectedIdsFromLocation;
      const globalRegions = fromLocation.globalRegions;
      const selectedStatesFromLocation = fromLocation.selectedStates;

      if (selectedStatesFromLocation) {
        fromLocation.selectedStates.forEach(selectedState => {
          selectedStates[selectedState] = true;
        });
      }

      this.locationData.forEach(region => {
        if (globalRegions) {
          fromLocation.globalRegions.forEach(selectedRegion => {
            if (selectedRegion.id === region.id && region.countries) {
              region.countries.forEach(country => {
                if (country.id === fromLocation.id) {
                  country.stateOrProvinces.forEach(state => {
                    state.selected = selectedStates[state.id] || false;
                  });
                }
              });
            }
          });
        }
      });
    }
  }
}
