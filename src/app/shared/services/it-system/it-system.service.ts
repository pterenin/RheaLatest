import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseDomainInterface } from '../../models/base-domain-model';
import { Observable } from 'rxjs';
import { HttpUtilsService } from '../../_services/rest-api/utils/utils.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItSystemService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  public create(): Observable<BaseDomainInterface> {
    return this.httpClient.post<BaseDomainInterface>(`/api/hub/it-systems`, {});
  }
  public clone(id: string, body: any): Observable<BaseDomainInterface> {
    return this.httpClient
      .post<BaseDomainInterface>(`/api/hub/it-systems/${id}/clone`, body)
      .pipe(
        map(success => success),
        catchError(this.httpUtilsService.handleError)
      );
  }
}
