import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, throwError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  BusinessStructureOptions,
  CompanyAffiliateDetailsGetResponse,
  CompanyAffiliateDetailsPutRequest,
  LegalEntityInterface
} from './details-form.model';
import { map } from 'rxjs/operators';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { isIdParameterInvalid } from 'src/app/shared/utils/basic-utils';
import { getErrorMessageNoPermissionsToViewRecord } from '../../../../shared/utils/error-utils';
import { LocationService } from 'src/app/shared/services/location/location.service';
import { ToastService } from '@trustarc/ui-toolkit';

declare const _: any;

@Injectable({
  providedIn: 'root'
})
export class DetailsFormService {
  private data;
  private _companyAffiliateDataBehaviorSubject$ = new BehaviorSubject<
    CompanyAffiliateDetailsGetResponse
  >(this.data);

  public _companyAffiliateData$: Observable<
    CompanyAffiliateDetailsGetResponse
  > = this._companyAffiliateDataBehaviorSubject$.asObservable();

  constructor(
    private httpClient: HttpClient,
    private locationService: LocationService,
    private toastService: ToastService
  ) {}

  public updateCompanyAffiliateDetails(id: string): void {
    if (isIdParameterInvalid(id)) {
      throw new Error(`Invalid ID: ${id}`);
    }
    const result = forkJoin([
      this.mapAllLocations(),
      this.getCompanyAffiliateDetails(id),
      this.httpClient.get(`/api/hub/industry-sectors`),
      this.getAllBusinessStructures()
    ]);

    result.subscribe(
      res => {
        const mappedLocations = res[0];
        const data: CompanyAffiliateDetailsGetResponse = res[1];
        const industrySectorResponse = this.prepareIndustrySectorsForCategoricalSelectBox(
          res[2]
        );
        const businessStructures = this.mapBusinessStructures(res[3]);
        const selectBoxLocations = mappedLocations.selectBoxLocations;

        data.businessStructureOptions = businessStructures;

        data.industrySectorOptions = industrySectorResponse;

        if (selectBoxLocations) {
          data.locationsForDropdown = selectBoxLocations;
        }

        this.data = this.setContactLocation(data, mappedLocations);
        this._companyAffiliateDataBehaviorSubject$.next(this.data);
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

  public clearCompanyAffiliateDetails() {
    this._companyAffiliateDataBehaviorSubject$.next(null);
  }

  private getCompanyAffiliateDetails(
    id: string
  ): Observable<CompanyAffiliateDetailsGetResponse> {
    if (!id || id === 'new') {
      return of({
        id: '',
        name: '',
        version: -1,
        note: '',
        notes: '',
        contactType: undefined,
        companyAddress: null
      });
    }
    return this.httpClient.get<CompanyAffiliateDetailsGetResponse>(
      `/api/hub/company-affiliates/${id}/details`
    );
  }

  /**
   * Maps business structures to be used by the business-structure/legal-entity-type dropdown.
   * This method can be removed when we get the go-ahead to use all countries. (no ticket yet)
   */
  private mapBusinessStructures(businessStructuresList) {
    const mappedList = {
      'United States (US)': businessStructuresList['United States (US)'],
      'Other (Other)': businessStructuresList['Other (Other)']
    };

    const flattenedList = _(mappedList)
      .keys()
      .map((key: string) => mappedList[key])
      .flatten()
      .map(item => {
        return { ...item, name: item.businessStructure };
      })
      .value();

    return flattenedList;
  }

  private getAllBusinessStructures(): Observable<BusinessStructureOptions> {
    return this.httpClient.get<any>(`/api/hub/business-structures`);
  }

  private setContactLocation(data, mappedLocations) {
    const newData = data;
    const dataLocation = this.getDataLocation(data);
    if (
      dataLocation &&
      dataLocation.countryId &&
      mappedLocations.countryList[dataLocation.countryId]
    ) {
      newData['contact'].location.countryName =
        mappedLocations.countryList[dataLocation.countryId].name;

      if (
        dataLocation.stateOrProvinceId &&
        mappedLocations.stateOrProvincesList[dataLocation.stateOrProvinceId]
      ) {
        newData['contact'].location.stateOrProvinceName =
          mappedLocations.stateOrProvincesList[
            dataLocation.stateOrProvinceId
          ].name;
      }
    }

    return newData;
  }

  private getDataLocation(data) {
    if (this.getDataContact(data)) {
      return this.getDataContact(data).location;
    }
    return undefined;
  }

  private getDataContact(data) {
    if (data) {
      return data['contact'];
    }
    return undefined;
  }

  private prepareIndustrySectorsForCategoricalSelectBox(
    industrySectorsFromServer
  ) {
    return _(industrySectorsFromServer)
      .groupBy('sector')
      .map((items, sector) => {
        return {
          items: items.map(item => {
            return { id: item.id, label: item.name };
          }),
          label: sector
        };
      })
      .value();
  }

  public saveCompanyAffiliate(
    id: string,
    newData: CompanyAffiliateDetailsPutRequest
  ): Observable<BaseDomainInterface> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    if (id === 'new') {
      return this.httpClient.post<BaseDomainInterface>(
        `/api/hub/company-affiliates/new`,
        newData
      );
    }
    return this.httpClient.put<BaseDomainInterface>(
      `/api/hub/company-affiliates/${id}/details`,
      newData
    );
  }

  private getAllCountries() {
    return this.httpClient.get<[{ any }]>(`/api/hub/locations/countries`);
  }

  public mapAllLocations() {
    const countries = this.getAllCountries();
    const statesOrProvinces = this.locationService.getAllStatesAndProvinces();

    return forkJoin(countries, statesOrProvinces).pipe(
      map(([countryList, statesOrProvincesList]) => {
        return {
          countryList: this.mapLocation(countryList, 'name'),
          stateOrProvincesList: this.mapLocation(
            statesOrProvincesList,
            'shortValue'
          ),
          selectBoxLocations: this.createLocationDropdownItems(countryList)
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

  private mapLocation(locationList, field) {
    return _(locationList)
      .map(location => {
        return { id: location['id'], name: location[field] };
      })
      .keyBy('id')
      .value();
  }

  public legalEntitiesFindAll(
    companyAffiliateId
  ): Observable<LegalEntityInterface[]> {
    const url = companyAffiliateId
      ? `/api/hub/legal-entities/company-affiliates/${companyAffiliateId}`
      : `/api/hub/legal-entities`;
    return this.httpClient.get<LegalEntityInterface[]>(url);
  }
}
