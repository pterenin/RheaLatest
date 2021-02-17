import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeoJsonObject } from 'geojson';
import { combineLatest, Observable, of, Subject, throwError } from 'rxjs';

import { COUNTRIES } from '../../constants/countries';
import { WORLD_MAP } from '../../constants/world-map';

declare const _: any;
/**
 * Series map data
 * A series of MapDataPoints, each representing a location on the map.
 */
export interface SeriesMapData {
  data: Array<MapDataRelationship>;
}

/**
 * NOTE: If this needs to be edited, changes will also need to occur on the Rhea Server so that Themis
 * receives all of the necessary data. Also, notify the Themis team of the changes so that they can update their end.
 * Map data relationship
 * from: The entity where data is coming from.
 * to: (optional) The entity where data is flowing to.
 */
export interface MapDataRelationship {
  from: MapDataPoint;
  to?: MapDataPoint;
  alternatePathToLocation?: boolean;
  needsLineRender?: boolean;
  needsPointRender?: boolean;
  pathCount?: number;
}

/**
 * NOTE: If this needs to be edited, changes will also need to occur on the Rhea Server so that Themis
 * receives all of the necessary data. Also, notify the Themis team of the changes so that they can update their end.
 * Lat lon conversion interface
 * This is what we convert the country to lat-lon data to after receiving it from the back-end.
 */
export interface LatLonConversionInterface {
  [index: string]: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Map data point
 *
 * NOTE: If this needs to be edited, changes will also need to occur on the Rhea Server so that Themis
 * receives all of the necessary data. Also, notify the Themis team of the changes so that they can update their end.
 *
 * The following should be returned from the server.
 * name: should contain the entity name
 * type: One of the four entity types: DATA_SUBJECT, IT_SYSTEM_1ST_PARTY, IT_SYSTEM_3RD_PARTY, DATA_RECIPIENT
 * coordinates: latitude and longitude coordinates.
 * location: lattitude and longitude to be converted to map coordinate system and placed in x and y variables.
 * stateOrProvince?: optional parameter for state/province-level granularity.
 *
 * The following are to be filled in on the client-side.
 * x: (optional) The x coordinate on the map of this data point (not lat/long) converted from lon.
 * y: (optional) The y coordinate on the map of this data point (not lat/long) converted from lat
 * pointColor: (optional) Used for coloring the data points.
 * lineColor: (optional) Used for coloring lines.
 * originalName: (optional) Used to keep a record of where entities exist, mainly for multiple-entity locations.
 */
export interface MapDataPoint {
  name: string;
  type: string;
  coordinates: Coordinates;
  location: string;
  stateOrProvince?: string;
  x?: number;
  y?: number;
  pointColor?: string;
  lineColor?: string;
  originalName?: string;
}

/**
 *
 * NOTE: If this needs to be edited, changes will also need to occur on the Rhea Server so that Themis
 * receives all of the necessary data. Also, notify the Themis team of the changes so that they can update their end.
 *
 * Coordinates
 * lat: latitude
 * lon: longitude
 */
export interface Coordinates {
  lat: number;
  lon: number;
}

@Injectable({
  providedIn: 'root'
})
export class WorldMapService {
  constructor(private httpClient: HttpClient) {}

  /** Set this to true to use province-level granularity of nodes.*/
  private useProvinces = false;

  public latLonTable;
  private loadlatLonTableEvent = new Subject<any>();
  public loadlatLonTableEvent$ = this.loadlatLonTableEvent.asObservable();
  private convertCountryCodeEvent = new Subject<any>();
  public convertCountryCodeEvent$ = this.convertCountryCodeEvent.asObservable();

  /**
   * Gets map coordinate translations
   * @param [refresh] - optional parameter. If set to true will re-fetch data from
   * the server and store it in the latLonConversions variable.
   * @returns the latLonConversions variable if
   */
  public getMapCoordinateTranslations(
    refresh?: boolean
  ): Observable<LatLonConversionInterface> {
    // keep this in case of PDF generator will have api calls
    const idKeyFieldName = 'location';
    const countryCodeKeyByField = 'countryCode';
    const removeFields = ['stateOrProvince'];
    const endpoint = this.useProvinces
      ? `/api/hub/locations/coordinates/state-or-provinces`
      : `/api/hub/locations/coordinates/countries`;

    if (refresh || !this.latLonTable) {
      this.httpClient.get<Array<any>>(endpoint, {}).subscribe(
        conversions => {
          // If using provinces create lookup by country and province.
          if (this.useProvinces) {
            conversions.forEach(obj => {
              obj[idKeyFieldName] = this.getLatLonTableFieldName(
                this.useProvinces,
                obj.countryCode,
                obj.stateOrProvince
              );
            });
            this.latLonTable = _(conversions)
              .map(obj => _.omit(obj, removeFields))
              .keyBy(idKeyFieldName)
              .value();
          }

          // Always include the countries alone in-case there are locations without provinces.
          if (!this.latLonTable) {
            this.latLonTable = _(conversions)
              .map(obj => _.omit(obj, removeFields))
              .keyBy(countryCodeKeyByField)
              .value();
          } else {
            Object.assign(
              this.latLonTable,
              _(conversions)
                .map(obj => _.omit(obj, removeFields))
                .keyBy(countryCodeKeyByField)
                .value()
            );
          }
          this.loadlatLonTableEvent.next(this.latLonTable);
        },
        err => throwError(err)
      );
    }
    return of(this.latLonTable);
  }

  private getLatLonTableFieldName(
    useProvinces: boolean,
    countryCode: string,
    stateOrProvince?: string
  ): string {
    let code: string;
    if (useProvinces && stateOrProvince) {
      code = _.toUpper(countryCode) + '_' + stateOrProvince;
    } else {
      code = _.toUpper(countryCode);
    }
    return code;
  }

  /**
   * Converts country code to location
   * Note that this must be called AFTER getMapCoordinateTranslations is called and sets the latLonConversions variable.
   * @param countryCode - case-insensitive country code.
   * @param [stateOrProvince] - optional field, case-sensitive province.
   */
  public convertCountryCodeToLocation(
    countryCode: string,
    stateOrProvince?: string
  ): { lat: number; lon: number } {
    if (countryCode === 'AQ') {
      return { lat: -82.8628, lon: 0 };
    }

    if (!this.latLonTable) {
      // [i18n-tobeinternationalized]
      throw new Error(
        'Unable to convert country code before latLonTable has been set.'
      );
    }
    const key = this.getLatLonTableFieldName(
      this.useProvinces,
      countryCode,
      stateOrProvince
    );
    const countryObject = this.latLonTable[key];
    if (!countryObject) {
      this.convertCountryCodeEvent.next(key);
    }
    return countryObject
      ? { lat: countryObject.latitude, lon: countryObject.longitude }
      : null;
  }

  /**
   * getMapAndData: waits for both the world map and point data to be returned,
   * then emits both in an array with the world map as the first element in the array.
   */
  public getCountriesCoordinates(): Observable<any> {
    const conversions = COUNTRIES;
    const countryCodeKeyByField = 'countryCode';
    const removeFields = ['stateOrProvince'];

    if (!this.latLonTable) {
      this.latLonTable = _(conversions)
        .map(obj => _.omit(obj, removeFields))
        .keyBy(countryCodeKeyByField)
        .value();
    } else {
      Object.assign(
        this.latLonTable,
        _(conversions)
          .map(obj => _.omit(obj, removeFields))
          .keyBy(countryCodeKeyByField)
          .value()
      );
    }
    this.loadlatLonTableEvent.next(this.latLonTable);
    return of(this.latLonTable);
  }

  public getMapAndData(): Observable<
    [GeoJsonObject, LatLonConversionInterface]
  > {
    return combineLatest([this.getWorldMap(), this.getCountriesCoordinates()]);
  }

  /**
   * getWorldMap: sends a request out for the world map to be returned as a GeoJson object.
   */
  public getWorldMap(): Observable<any> {
    // keep this in case of PDF generator will have api calls
    // return this.httpClient.get<GeoJsonObject>('assets/get-world-map.json', {});
    return of(WORLD_MAP);
  }
}
