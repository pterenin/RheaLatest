import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  DataInventoryInterface,
  LinkedBPs
} from 'src/app/shared/models/bp-data-model';
import {
  SearchResponseInterface,
  FilterRequest
} from '../shared/models/search.model';
import { TaTableRequest } from '@trustarc/ui-toolkit';
import { FilterNonLeafNode } from '../shared/models/filter-model';
import { exists, defaultTo } from '../shared/utils/basic-utils';
import { Router } from '@angular/router';
import { RoutingStateService } from '../global-services/routing-state.service';

@Injectable()
export class DataInventoryService {
  private cancelFormChanges$: BehaviorSubject<boolean>;

  public get getCancelFormChanges(): Observable<boolean> {
    return this.cancelFormChanges$.asObservable();
  }

  public set setCancelFormChanges(value: boolean) {
    this.cancelFormChanges$.next(value);
  }

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private routingStateService: RoutingStateService
  ) {
    this.cancelFormChanges$ = new BehaviorSubject<boolean>(false);
  }

  private searchRequest: FilterRequest = {};
  private inventoryFilters: FilterNonLeafNode = {
    operand: 'AND',
    filters: [
      {
        fieldName: 'recordType',
        values: ['CompanyEntity', 'ThirdParty', 'ItSystem']
      }
    ]
  };

  public getDataInventory(
    request: TaTableRequest
  ): Observable<SearchResponseInterface<DataInventoryInterface>> {
    this.searchRequest.page = exists(request.page)
      ? Math.max(0, request.page - 1)
      : 0;

    this.searchRequest.size = defaultTo(25, request.maxRows);
    this.searchRequest.search = request.search;

    this.searchRequest.sortField = defaultTo(
      'lastModified',
      request.search && request.search.length > 0 ? 'name' : request.columnSort
    );
    this.searchRequest.customFilters = request.customFilters;
    this.searchRequest.sortDirection =
      request.sortType === 'asc' ? 'ASC' : 'DESC';
    this.searchRequest.filters = this.inventoryFilters;

    return this.httpClient
      .post<SearchResponseInterface<DataInventoryInterface>>(
        '/api/hub/search/base-records/filters',
        this.searchRequest
      )
      .pipe(map(this.mapDataInventory), catchError(this.handleError));
  }

  private mapDataInventory(
    response: SearchResponseInterface<DataInventoryInterface>
  ): SearchResponseInterface<DataInventoryInterface> {
    return response;
  }

  public getLinkedBPs(systemId: string): Observable<LinkedBPs> {
    return this.httpClient
      .get(`/api/hub/it-systems/${systemId}/usage`)
      .pipe(map(this.mapLinkedBPs), catchError(this.handleError));
  }

  private mapLinkedBPs(response: LinkedBPs): LinkedBPs {
    return response;
  }

  private handleError(error: Response | any) {
    return throwError(error);
  }

  public goBackDataInventoryListPage() {
    this.setCancelFormChanges = false;
    const lastRoute = this.routingStateService.getLatestReplayableHistory();
    if (lastRoute && lastRoute.url) {
      this.router.navigate([lastRoute.url]);
    } else {
      this.router.navigateByUrl('/data-inventory');
    }
  }
}
