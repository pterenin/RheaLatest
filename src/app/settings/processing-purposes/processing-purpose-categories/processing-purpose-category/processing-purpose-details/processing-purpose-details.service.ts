import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  defaultTo,
  isIdParameterInvalid
} from '../../../../../shared/utils/basic-utils';
import { from, Observable, of, throwError } from 'rxjs';
import { DataElementServerDetails } from '../../../../../shared/models/data-elements.model';
import { concatMap } from 'rxjs/operators';
// tslint:disable-next-line:max-line-length
import { ItSystemIdsGroupedByBusinessProcessInterface } from '../../../../data-elements/data-element-categories/data-element-category/data-element-details/data-element-details.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessingPurposeDetailsService {
  public DEFAULT_PAGEABLE_PARAMS = {
    ID: undefined,
    PAGE: '0',
    SIZE: '25',
    SORT: ''
  };

  constructor(private httpClient: HttpClient) {}

  public getProcessingPurposeDetails(
    processingPurposeId: string,
    page: number,
    size: number,
    sort: string
  ) {
    if (isIdParameterInvalid(processingPurposeId)) {
      return throwError(`Invalid ID: ${processingPurposeId}`);
    }
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('id', processingPurposeId);
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
    const url = `/api/hub/processing-purposes/${processingPurposeId}/details`;
    return this.httpClient.get<DataElementServerDetails>(url, { params });
  }

  public unlinkDataElementFromBusinessProcesses(
    processingPurposeId: string,
    businessProcessIds: string[]
  ): Observable<void> {
    if (
      !processingPurposeId ||
      !businessProcessIds ||
      businessProcessIds.length === 0
    ) {
      return of();
    }
    const businessProcessObservables = from(businessProcessIds);
    return businessProcessObservables.pipe(
      concatMap(businessProcessId => {
        const url = `/api/hub/processing-purposes/${processingPurposeId}/business-process/${businessProcessId}/unlink`;
        return this.httpClient.put<any>(url, null);
      })
    );
  }

  public unlinkDataElementFromItSystems(
    processingPurposeId: string,
    itSystemIdsGroupedByBusinessProcess: ItSystemIdsGroupedByBusinessProcessInterface[]
  ): Observable<void> {
    if (
      !processingPurposeId ||
      !itSystemIdsGroupedByBusinessProcess ||
      itSystemIdsGroupedByBusinessProcess.length === 0
    ) {
      return of();
    }

    const itSystemIdsObservables = from(itSystemIdsGroupedByBusinessProcess);

    return itSystemIdsObservables.pipe(
      concatMap(itSystemGroup => {
        // tslint:disable-next-line:max-line-length
        const url = `/api/hub/processing-purposes/${processingPurposeId}/business-process/${itSystemGroup.businessProcessId}/it-systems/unlink`;
        return this.httpClient.put<any>(url, {
          itSystemIds: itSystemGroup.itSystemIds
        });
      })
    );
  }
}
