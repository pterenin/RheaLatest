import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError, from, Observable, of } from 'rxjs';
import {
  isIdParameterInvalid,
  defaultTo
} from 'src/app/shared/utils/basic-utils';
import { DataElementServerDetails } from 'src/app/shared/models/data-elements.model';
import { concatMap } from 'rxjs/operators';
import { ItSystemIdsGroupedByBusinessProcessInterface } from './data-element-details.model';

@Injectable({
  providedIn: 'root'
})
export class DataElementDetailsService {
  public DEFAULT_PAGEABLE_PARAMS = {
    ID: undefined,
    PAGE: '0',
    SIZE: '25',
    SORT: ''
  };

  constructor(private httpClient: HttpClient) {}

  public getDataElementDetails(
    dataElementId: string,
    page: number,
    size: number,
    sort: string
  ) {
    if (isIdParameterInvalid(dataElementId)) {
      return throwError(`Invalid ID: ${dataElementId}`);
    }
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('id', dataElementId);
    params = params.append(
      'page',
      defaultTo(this.DEFAULT_PAGEABLE_PARAMS.PAGE, page + '')
    );
    params = params.append(
      'size',
      defaultTo(this.DEFAULT_PAGEABLE_PARAMS.SIZE, size + '')
    );
    if (sort) {
      params = params.append('sort', sort);
    }
    const url = `/api/hub/data-elements/${dataElementId}/details`;
    return this.httpClient.get<DataElementServerDetails>(url, { params });
  }

  public unlinkDataElementFromBusinessProcesses(
    dataElementId: string,
    businessProcessIds: string[]
  ): Observable<void> {
    if (
      !dataElementId ||
      !businessProcessIds ||
      businessProcessIds.length === 0
    ) {
      return of();
    }
    const businessProcessObservables = from(businessProcessIds);
    return businessProcessObservables.pipe(
      concatMap(businessProcessId => {
        const url = `/api/hub/data-elements/${dataElementId}/business-process/${businessProcessId}/unlink`;
        return this.httpClient.put<any>(url, null);
      })
    );
  }

  public unlinkDataElementFromItSystems(
    dataElementId: string,
    itSystemIdsGroupedByBusinessProcess: ItSystemIdsGroupedByBusinessProcessInterface[]
  ): Observable<void> {
    if (
      !dataElementId ||
      !itSystemIdsGroupedByBusinessProcess ||
      itSystemIdsGroupedByBusinessProcess.length === 0
    ) {
      return of();
    }

    const itSystemIdsObservables = from(itSystemIdsGroupedByBusinessProcess);

    return itSystemIdsObservables.pipe(
      concatMap(itSystemGroup => {
        const url = `/api/hub/data-elements/${dataElementId}/business-process/${itSystemGroup.businessProcessId}/it-systems/unlink`;
        return this.httpClient.put<any>(url, {
          itSystemIds: itSystemGroup.itSystemIds
        });
      })
    );
  }
}
