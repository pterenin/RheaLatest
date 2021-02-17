import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataInventoryInterface } from '../../models/bp-data-model';

declare const _: any;

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private static exportMultiTypeEndpoint = '/api/hub/exports/async';

  constructor(private httpClient: HttpClient) {}

  public exportAll(): Observable<HttpResponse<Blob>> {
    return this.httpClient.get('/api/hub/exports/async/all', {
      observe: 'response',
      responseType: 'blob'
    });
  }

  // single api for all types export
  public exportSelected(
    items: DataInventoryInterface[]
  ): Observable<HttpResponse<Blob>> {
    const ids: string[] = items.map(item => item.id);

    const params = new HttpParams().append('ids', ids.toString());
    return this.httpClient.get('/api/hub/exports/async', {
      observe: 'response',
      params: params,
      responseType: 'blob'
    });
  }
}
