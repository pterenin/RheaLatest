import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpUtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyAffiliateControllerService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  public createNewCompanyAffiliateFull(payload: any): Observable<any> {
    return this.httpClient
      .post(`/api/hub/company-affiliates/new-full`, payload)
      .pipe(
        map(this.mapPostNewCompanyAffiliate),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapPostNewCompanyAffiliate(response): any {
    return response;
  }
}
