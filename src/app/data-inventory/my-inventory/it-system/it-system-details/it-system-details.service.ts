import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  forkJoin,
  throwError,
  of
} from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DataInventoryType } from '../../my-inventory.component';
import { SearchRequest } from 'src/app/shared/models/search.model';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import {
  ItSystemDetailsGetResponse,
  ItSystemDetailsPutRequest
} from './it-system-details.model';
import { isIdParameterInvalid } from 'src/app/shared/utils/basic-utils';
import { LocationService } from 'src/app/shared/services/location/location.service';
import { ToastService } from '@trustarc/ui-toolkit';
import { getErrorMessageNoPermissionsToViewRecord } from '../../../../shared/utils/error-utils';

declare const _: any;

@Injectable({
  providedIn: 'root'
})
export class ItSystemDetailsFormService {
  private _allDetailsSubscription$: Subscription;
  private data;
  private itSystemDetailsDataBehaviorSubject = new BehaviorSubject<
    ItSystemDetailsGetResponse
  >(this.data);
  public _itSystemData$: Observable<
    ItSystemDetailsGetResponse
  > = this.itSystemDetailsDataBehaviorSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private locationService: LocationService,
    private toastService: ToastService
  ) {}

  public updateItSystemDetails(
    id: string,
    updateItSystemDetails?: boolean
  ): void {
    if (isIdParameterInvalid(id)) {
      throw new Error(`Invalid ID: ${id}`);
    }

    const result = forkJoin([
      this.getItSystemDetails(id, updateItSystemDetails),
      this.getAllLocations(),
      this.getAllDataSubjectTypes(),
      this.getAllDataSubjectVolumes()
    ]);

    if (this._allDetailsSubscription$) {
      this._allDetailsSubscription$.unsubscribe();
    }

    this._allDetailsSubscription$ = result.subscribe(
      ([
        details,
        mappedLocations,
        individualTypes,
        individualRecordsVolume
      ]) => {
        const data: ItSystemDetailsGetResponse = details;

        data.individualTypes = individualTypes;
        data.individualRecordsVolume = individualRecordsVolume;
        data.locationsForDropdown = mappedLocations.selectBoxLocations;
        data.fullCountryList = mappedLocations.countryListByGlobalRegion;
        this.data = data;
        this.itSystemDetailsDataBehaviorSubject.next(this.data);
      },
      err => {
        const { status } = err;
        if (status === 404 || status === 403) {
          const message = getErrorMessageNoPermissionsToViewRecord();
          return this.toastService.error(message, null, 5000);
        }
        console.error(err);
      }
    );
  }

  public clearItSystemDetails() {
    this.itSystemDetailsDataBehaviorSubject.next(null);
  }

  public searchLegalEntities(
    entityType: DataInventoryType,
    searchRequest?: SearchRequest
  ): Observable<any> {
    const searchTerm = searchRequest.searchTerm;

    let queryParams = new HttpParams()
      .append('entityType', entityType)
      .append('page', searchRequest.page.toString())
      .append('size', searchRequest.size.toString())
      .append('sort', searchRequest.sort);

    if (searchTerm && searchTerm.length > 0) {
      queryParams = queryParams.append('searchTerm', searchTerm);
    }

    const searchUrl = `/api/hub/legal-entities/entity-type-and-search`;
    const getUrl = `/api/hub/legal-entities/entity-type`;
    const url = searchTerm && searchTerm.length > 0 ? searchUrl : getUrl;

    return this.httpClient.get(url, { params: queryParams });
  }

  public searchAllLegalEntities(searchRequest: SearchRequest) {
    let url;
    let queryParams = new HttpParams();

    if (searchRequest.page) {
      queryParams = queryParams.append('page', searchRequest.page.toString());
    }

    if (searchRequest.size) {
      queryParams = queryParams.append('size', searchRequest.size.toString());
    }

    if (searchRequest.sort) {
      queryParams = queryParams.append('sort', searchRequest.sort.toString());
    }

    const searchTerm = searchRequest.searchTerm;
    if (searchTerm && searchTerm.trim().length > 0) {
      queryParams = queryParams.append('searchTerm', searchTerm.trim());
      url = '/api/hub/legal-entities/search';
    } else {
      url = '/api/hub/legal-entities';
    }

    return this.httpClient.get(url, { params: queryParams });
  }

  private getItSystemDetails(
    id: string,
    withBusinessProcessUsage?: boolean
  ): Observable<ItSystemDetailsGetResponse> {
    if (!id || id === 'new') {
      return of({});
    }

    let params = new HttpParams();

    if (withBusinessProcessUsage) {
      params = params.append('withBusinessProcessUsage', 'true');
    }
    return this.httpClient.get<ItSystemDetailsGetResponse>(
      `/api/hub/it-systems/${id}/details`,
      { params }
    );
  }

  private getAllDataSubjectTypes() {
    return this.httpClient.get(
      `/api/hub/data-subject-types?sortByCategory=false`
    );
  }

  private getAllDataSubjectVolumes() {
    return this.httpClient.get(`/api/hub/data-subject-volumes`);
  }

  private getAllLocations() {
    return this.locationService.getFullCountryList().pipe(
      map(countryListByGlobalRegion => {
        const countries = [];
        countryListByGlobalRegion.forEach(region =>
          countries.push(...region.countries)
        );

        const sortedCountries = _.sortBy(countries, ['name']);
        const selectBoxLocations = this.createLocationDropdownItems(
          sortedCountries
        );

        return {
          countryListByGlobalRegion,
          selectBoxLocations
        };
      })
    );
  }

  private createLocationDropdownItems(locations) {
    return locations.map(location => {
      return {
        name: location.name,
        id: location.id,
        stateOrProvinces: location.stateOrProvinces.map(stateOrProvince => {
          return {
            name: stateOrProvince.name,
            id: stateOrProvince.id
          };
        })
      };
    });
  }

  public saveItSystem(
    id: string,
    newData: ItSystemDetailsPutRequest
  ): Observable<BaseDomainInterface> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    if (id === 'new') {
      return this.httpClient.post<BaseDomainInterface>(
        `/api/hub/it-systems/new`,
        newData
      );
    }
    return this.httpClient.put<BaseDomainInterface>(
      `/api/hub/it-systems/${id}/details`,
      newData
    );
  }
}
