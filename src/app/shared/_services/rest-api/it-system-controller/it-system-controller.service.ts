import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpUtilsService } from '../utils/utils.service';
import { ItSystemControllerInterfaceInterface } from 'src/app/shared/_interfaces';

@Injectable({
  providedIn: 'root'
})
export class ItSystemControllerService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  public getItSystems(
    itSystemId: string,
    countryOnly?: boolean
  ): Observable<ItSystemControllerInterfaceInterface> {
    let params = new HttpParams();

    if (countryOnly) {
      params = params.set('countriesOnly', 'true');
    }

    return this.httpClient
      .get(`/api/hub/it-systems/${itSystemId}/it-systems`, { params })
      .pipe(
        map(this.mapGetItSystems),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public createNewItSystem(payload: any): Observable<any> {
    return this.httpClient
      .post(`/api/hub/it-systems/new`, payload)
      .pipe(
        map(this.mapPostNewItSystem),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public createNewItSystemFull(payload: any): Observable<any> {
    return this.httpClient
      .post(`/api/hub/it-systems/new-full`, payload)
      .pipe(
        map(this.mapPostNewItSystem),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapGetItSystems(
    response: ItSystemControllerInterfaceInterface
  ): ItSystemControllerInterfaceInterface {
    return response;
  }

  private mapPostNewItSystem(response): any {
    return response;
  }
}
