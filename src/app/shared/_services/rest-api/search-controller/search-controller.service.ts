import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpUtilsService } from '../utils/utils.service';

import {
  BaseRecordsFiltersResponseInterface,
  ItSystemRecordsFilterInterface,
  ItSystemRecordsSearchFiltersRequestInterface
} from 'src/app/shared/_interfaces';
import { TaDatagridRequest } from '@trustarc/ui-toolkit';

@Injectable({
  providedIn: 'root'
})
export class SearchControllerService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  public baseRecordsFilters(
    request: TaDatagridRequest
  ): Observable<BaseRecordsFiltersResponseInterface> {
    return this.httpClient
      .post<BaseRecordsFiltersResponseInterface>(
        '/api/hub/search/base-records/filters',
        request
      )
      .pipe(
        map(this.mapBaseRecordsFilters),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public itSystemRecordsFilters(
    data: ItSystemRecordsSearchFiltersRequestInterface,
    businessProcessId: string
  ): Observable<ItSystemRecordsFilterInterface> {
    return this.httpClient
      .post(
        `/api/hub/search/it-systems/business-process-id/${businessProcessId}`,
        data
      )
      .pipe(
        map(this.mapItSystemRecordsFilters),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapItSystemRecordsFilters(
    response: ItSystemRecordsFilterInterface
  ): ItSystemRecordsFilterInterface {
    return response;
  }

  private mapBaseRecordsFilters(
    response: BaseRecordsFiltersResponseInterface
  ): BaseRecordsFiltersResponseInterface {
    return response;
  }
}
