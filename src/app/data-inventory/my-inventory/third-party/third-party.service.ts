import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CountryInterface } from 'src/app/shared/models/location.model';
import {
  ThirdPartyDetailsGetResponse,
  ThirdPartyDetailsPutRequest,
  BaseCCPAQuestionInterface
} from './details-form/details-form.model';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { multicastInProgressState } from 'src/app/shared/utils/rxjs-utils';
import { IndustrySector } from 'src/app/shared/models/industry-sector.model';
import { isIdParameterInvalid } from 'src/app/shared/utils/basic-utils';
import { CompanyEntityInterface } from './third-party.model';

@Injectable()
export class ThirdPartyService {
  private isUpdatingSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public getIsUpdatingSubject(): BehaviorSubject<boolean> {
    return this.isUpdatingSubject;
  }

  constructor(private httpClient: HttpClient) {}

  public getThirdParty(id: string): Observable<ThirdPartyDetailsGetResponse> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    if (id === 'new') {
      return of({
        contractEndDate: undefined,
        contractStartDate: undefined,
        id: 'new',
        locations: [],
        name: '',
        entityRole: undefined,
        type: undefined,
        notes: undefined,
        version: 0,
        industrySectors: []
      });
    }
    return this.httpClient.get<ThirdPartyDetailsGetResponse>(
      `/api/hub/third-parties/${id}`
    );
  }

  public saveThirdParty(
    id: string,
    thirdPartyData: ThirdPartyDetailsPutRequest
  ): Observable<BaseDomainInterface> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    let thirdPartySaveAndResponse;
    if (id === 'new') {
      thirdPartySaveAndResponse = this.httpClient
        .post<ThirdPartyDetailsPutRequest>(
          `/api/hub/third-parties/new`,
          thirdPartyData
        )
        .pipe(
          map(
            response =>
              ({
                id: response.id,
                version: response.version
              } as BaseDomainInterface)
          )
        );
    } else {
      thirdPartySaveAndResponse = this.httpClient
        .put<ThirdPartyDetailsPutRequest>(
          `/api/hub/third-parties/${id}`,
          thirdPartyData
        )
        .pipe(
          map(
            response =>
              ({
                id: response.id,
                version: response.version
              } as BaseDomainInterface)
          )
        );
    }

    return multicastInProgressState(
      thirdPartySaveAndResponse,
      this.isUpdatingSubject
    );
  }

  public getLocations(): Observable<CountryInterface[]> {
    return this.httpClient.get<CountryInterface[]>(
      `/api/hub/locations/countries`
    );
  }

  public getIndustrySectors(): Observable<IndustrySector[]> {
    return this.httpClient.get<IndustrySector[]>(`/api/hub/industry-sectors`);
  }

  public getCCPAQuestions(): Observable<BaseCCPAQuestionInterface[]> {
    return this.httpClient.get<BaseCCPAQuestionInterface[]>(
      `/api/hub/ccpa-questions`
    );
  }

  public getCompanyEntities(
    page: number = 0
  ): Observable<CompanyEntityInterface> {
    let params = new HttpParams();
    params = params.append('size', '5000');

    return this.httpClient.get<CompanyEntityInterface>(
      `/api/hub/company-entities`,
      { params }
    );
  }
}
