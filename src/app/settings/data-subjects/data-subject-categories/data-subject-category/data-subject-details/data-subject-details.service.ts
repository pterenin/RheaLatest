import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  defaultTo,
  isIdParameterInvalid
} from '../../../../../shared/utils/basic-utils';
import { from, Observable, of, throwError } from 'rxjs';
import { DataSubjectServerDetails } from '../../../../../shared/models/data-subjects.model';
import { concatMap, map } from 'rxjs/operators';
// tslint:disable-next-line:max-line-length
import { ItSystemIdsGroupedByBusinessProcessInterface } from '../../../../data-elements/data-element-categories/data-element-category/data-element-details/data-element-details.model';

@Injectable({
  providedIn: 'root'
})
export class DataSubjectDetailsService {
  public DEFAULT_PAGEABLE_PARAMS = {
    ID: undefined,
    PAGE: '0',
    SIZE: '25',
    SORT: ''
  };

  constructor(private httpClient: HttpClient) {}

  public getDataSubjectDetails(
    dataSubjectId: string,
    page: number,
    size: number,
    sort: string
  ) {
    if (isIdParameterInvalid(dataSubjectId)) {
      return throwError(`Invalid ID: ${dataSubjectId}`);
    }
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('id', dataSubjectId);
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
    const url = `/api/hub/data-subjects/${dataSubjectId}/details`;
    return this.httpClient
      .get<DataSubjectServerDetails>(url, { params })
      .pipe(
        map(item => {
          return {
            ...item,
            name: item.dataSubject
          };
        })
      );
  }

  public unlinkDataSubjectFromBusinessProcesses(
    dataSubjectId: string,
    businessProcessIds: string[]
  ): Observable<void> {
    if (
      !dataSubjectId ||
      !businessProcessIds ||
      businessProcessIds.length === 0
    ) {
      return of();
    }
    const businessProcessObservables = from(businessProcessIds);
    return businessProcessObservables.pipe(
      concatMap(businessProcessId => {
        const url = `/api/hub/data-subjects/${dataSubjectId}/business-process/${businessProcessId}/unlink`;
        return this.httpClient.put<any>(url, null);
      })
    );
  }

  public unlinkDataSubjectFromItSystems(
    dataSubjectId: string,
    itSystemIdsGroupedByBusinessProcess: ItSystemIdsGroupedByBusinessProcessInterface[]
  ): Observable<void> {
    if (
      !dataSubjectId ||
      !itSystemIdsGroupedByBusinessProcess ||
      itSystemIdsGroupedByBusinessProcess.length === 0
    ) {
      return of();
    }

    const itSystemIdsObservables = from(itSystemIdsGroupedByBusinessProcess);

    return itSystemIdsObservables.pipe(
      concatMap(itSystemGroup => {
        const url = `/api/hub/data-subjects/${dataSubjectId}/business-process/${itSystemGroup.businessProcessId}/it-systems/unlink`;
        return this.httpClient.put<any>(url, {
          itSystemIds: itSystemGroup.itSystemIds
        });
      })
    );
  }
}
