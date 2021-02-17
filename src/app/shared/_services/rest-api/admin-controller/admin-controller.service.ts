import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpUtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AdminControllerService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  public reIndexInProgress(): Observable<boolean> {
    return this.httpClient
      .get(`/api/hub/admin/reindexing`)
      .pipe(
        map(this.mapReIndexInProgress),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapReIndexInProgress(response: boolean): boolean {
    return response;
  }
}
