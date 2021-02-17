import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  OnDestroy,
  EventEmitter,
  Output
} from '@angular/core';
import {
  getRegistryCategoryLoaders,
  locationData
} from './component-registry-data';
import { AutoUnsubscribe } from '../shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';

/**
 * This component should not be used in the front-end,
 * this is only for building components and having access to view the components via a URL.
 */

declare const _: any;

const identityFunction = item => item;

@AutoUnsubscribe(['_nodeLocationsSubscription$'])
@Component({
  selector: 'ta-registry',
  templateUrl: './component-registry.component.html',
  styleUrls: ['./component-registry.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComponentRegistryComponent implements OnInit, OnDestroy {
  @Input() public isReadOnly: boolean;
  @Input()
  public registryInputEntityTypeDisplayValue: any;
  @Input() _nodeLocationsObservable$;
  @Input() public allLocations;
  @Input() public allGlobalRegions;

  @Output() getLocationIds = new EventEmitter();
  private _nodeLocationsSubscription$;

  public mapContentItem = identityFunction;
  public locationData;
  public categoryLoaders = getRegistryCategoryLoaders({ isDelayed: true });
  public locationsForDisplay = [];
  public isFinishLoaded = false;

  constructor() {}

  public onCountrySelected(locData) {
    locData.forEach(locations => {
      if (locations && locations.length) {
        locations.forEach(country => console.log(country.name));
      }
    });
  }

  public cancel() {
    console.log('country selector closed');
  }

  ngOnInit() {
    if (this._nodeLocationsObservable$) {
      this._nodeLocationsSubscription$ = this._nodeLocationsObservable$.subscribe(
        node => {
          this.mapLocationsWithGlobalCountries(node.locationIds);
          this.isFinishLoaded = true;
          this.getLocationIds.emit(node.locationIds);
        }
      );
    }
  }

  ngOnDestroy() {}

  public mapLocationsWithGlobalCountries(locationIds) {
    const countryIds = _(this.allLocations)
      .filter(location => locationIds.includes(location.id))
      .map(location => location.country.id)
      .value();

    /** TODO: Need to keep only thae countries in allGlobalRegions that exist
     * in the locationIds array. Then store this information in this.locationData
     * Also, set as selected even though we aren't keeping track of that yet. This will come in the future. */
    this.locationsForDisplay = [];
    this.locationData = [];
    this.allGlobalRegions.forEach(region => {
      const countriesContainIdInList = region.countries.filter(country => {
        if (countryIds.includes(country.id)) {
          country.selected = true;
          return country;
        }
      });

      if (countriesContainIdInList.length > 0) {
        const temp = Object.assign({}, region);
        temp.totalOriginalCountries = region.countries.length;
        temp.countries = countriesContainIdInList;

        this.locationsForDisplay.push(temp);
        this.locationData.push(temp);
      }
    });
  }

  public onSearchChange(searchValue) {
    this.filterSearch(searchValue);
  }

  public filterSearch(search) {
    this.locationsForDisplay = [];
    this.locationData.map(region => {
      const containsCountry = region.countries.filter(
        country =>
          String(country.name)
            .toLowerCase()
            .indexOf(search.toLowerCase()) !== -1
      );

      const tempRegion = Object.assign({}, region);

      if (containsCountry.length > 0) {
        tempRegion.countries = containsCountry;
        this.locationsForDisplay.push(tempRegion);
      }
    });
  }
}
