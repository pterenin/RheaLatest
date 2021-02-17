import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpUtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ThirdPartyControllerService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  public createNewThirdPartyFull(payload: any): Observable<any> {
    return this.httpClient
      .post(`/api/hub/third-parties/new-full`, payload)
      .pipe(
        map(this.mapPostNewThirdParty),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapPostNewThirdParty(response): any {
    return response;
  }
}
