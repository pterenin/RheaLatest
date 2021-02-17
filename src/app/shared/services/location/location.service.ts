import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  CountryInterface,
  GlobalRegionInterface,
  StateOrProvinceInterface
} from '../../models/location.model';

declare const _: any;

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private cachedLocationList: CountryInterface[] = [];
  private cachedStateOrProvinces: StateOrProvinceInterface[] = [];
  private locationsRaw = new BehaviorSubject<any>(null);
  private countryListRaw = new BehaviorSubject<any>(null);

  constructor(private httpClient: HttpClient) {
    this.arrangeCountryList = this.arrangeCountryList.bind(this);
    this.getRegion = this.getRegion.bind(this);
    this.groupCountriesByRegion = this.groupCountriesByRegion.bind(this);
  }

  public emitLocationsRawUpdated(locationsRaw: any) {
    this.locationsRaw.next(locationsRaw);
  }

  public getLocationsRaw(): Observable<any> {
    return this.locationsRaw.asObservable();
  }

  public mapLocationsFromRegions(regions) {
    const locations = [];
    regions.forEach(region => {
      region.countries.forEach(country => {
        locations.push({
          id: country.id,
          version: country.version,
          country: {
            id: country.id,
            version: country.version,
            i18nKey: country.i18nKey,
            name: country.name,
            threeLetterCode: country.threeLetterCode,
            twoLetterCode: country.twoLetterCode
          },
          globalRegion: {
            id: _.get(country, 'globalRegions[0].id'),
            version: _.get(country, 'globalRegions[0].version'),
            i18nKey: _.get(country, 'globalRegions[0].i18nKey'),
            name: _.get(country, 'globalRegions[0].name')
          },
          stateOrProvinces: null
        });

        if (Array.isArray(country.stateOrProvinces)) {
          country.stateOrProvinces.forEach(item => {
            locations.push({
              id: item.id,
              version: item.version,
              country: {
                id: country.id,
                version: country.version,
                i18nKey: country.i18nKey,
                name: country.name,
                threeLetterCode: country.threeLetterCode,
                twoLetterCode: country.twoLetterCode
              },
              globalRegion: {
                id: _.get(country, 'globalRegions[0].id'),
                version: _.get(country, 'globalRegions[0].version'),
                i18nKey: _.get(country, 'globalRegions[0].i18nKey'),
                name: _.get(country, 'globalRegions[0].name')
              },
              stateOrProvince: {
                id: item.id,
                version: item.version,
                name: item.name,
                shortValue: item.shortValue,
                i18nKey: item.i18nKey
              }
            });
          });
        }
      });
    });

    return locations;
  }

  public emitCountryListRawUpdated(countryListRaw: any) {
    this.countryListRaw.next(countryListRaw);
  }

  public getCountryListRaw(): Observable<any> {
    return this.countryListRaw.asObservable();
  }

  public getFullCountryList(
    orderByGlobalRegions = false,
    bustCache: boolean = false
  ): Observable<GlobalRegionInterface[]> {
    const networkRequest = this.httpClient
      .get<CountryInterface[]>(
        `/api/hub/locations/countries?sortByGlobalRegion=${orderByGlobalRegions}`
      )
      .pipe(tap(countryList => (this.cachedLocationList = countryList)));

    const cachedRequest = new Observable(sub => {
      sub.next(this.cachedLocationList);
      sub.complete();
    });

    const request =
      this.cachedLocationList.length === 0 || bustCache
        ? networkRequest
        : cachedRequest;

    return request.pipe(map(this.arrangeCountryList));
  }

  public getCountryIdByThreeLetterCode(code: string) {
    const found = this.cachedLocationList.find(
      cached => cached.threeLetterCode === code
    );
    if (found) {
      return found.id;
    }
    return undefined;
  }

  private arrangeCountryList(countries: CountryInterface[]) {
    const regions = _(countries)
      .flatMap((country: CountryInterface) => country.globalRegions)
      .uniqBy((region: GlobalRegionInterface) => region.id)
      .value();

    return _(countries)
      .groupBy(this.getRegion)
      .toPairs()
      .map(this.groupCountriesByRegion(regions))
      .value();
  }

  private getRegion(country: CountryInterface): string {
    switch (country.globalRegions.length) {
      case 0:
        return 'Other';

      case 1:
        return country.globalRegions[0].name;

      case 2:
        return country.globalRegions.find(region => region.name !== 'EU').name;

      default:
        console.warn('Country exists in more than 2 regions: ', country);
        return 'Many';
    }
  }

  private groupCountriesByRegion(regions): Function {
    return ([region_name, country_list]: [string, CountryInterface[]]) => {
      const known_region = regions.find(r => r.name === region_name);

      const region = {
        name: region_name,
        countries: country_list
      };

      return typeof known_region !== 'undefined'
        ? { ...region, id: known_region.id }
        : region;
    };
  }

  public mapCountryListForBadge(locationData, withoutStates = false) {
    // provide `withoutStates = true` argument if need to filter out locations with statesOrProvinces
    if (!locationData) {
      return;
    }
    const mappedCountryList = _.cloneDeep(locationData);
    this.getLocationsRaw().subscribe(locations => {
      if (Array.isArray(locations) && mappedCountryList) {
        // add locationID for each country
        mappedCountryList.map(region => {
          region.countries.map(country => {
            const found = Object.assign(
              [],
              locations.filter(loc => {
                if (withoutStates && loc.stateOrProvince !== null) {
                  return false;
                }
                return loc.country ? loc.country.id === country.id : false;
              })
            );
            country.locationId = null;
            country.locationIds = [];

            if (found.length > 0) {
              country.locationId = found[0].id;
              country.locationIds = found.map(location => location.id);
            }
          });
        });
      }
    });
    return mappedCountryList;
  }

  public getAllStatesAndProvinces(): Observable<StateOrProvinceInterface[]> {
    const request = this.httpClient
      .get<StateOrProvinceInterface[]>(`/api/hub/locations/state-or-provinces`)
      .pipe(
        tap(
          stateOrProvinces => (this.cachedStateOrProvinces = stateOrProvinces)
        )
      );

    return this.cachedStateOrProvinces.length > 0
      ? of(this.cachedStateOrProvinces)
      : request;
  }

  public getCountries(): Observable<CountryInterface[]> {
    let params = new HttpParams();
    params = params.append('size', '5000');
    return this.httpClient
      .get('/api/hub/locations/countries', { params })
      .pipe(map(this.mapCountriesResponse));
  }

  private mapCountriesResponse(
    response: CountryInterface[]
  ): CountryInterface[] {
    return response;
  }
}
