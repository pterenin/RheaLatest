import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaDatagridRequest } from '@trustarc/ui-toolkit';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GetSearchBpResponseInterface } from './record-listing.model';

@Injectable({
  providedIn: 'root'
})
export class RecordListingService {
  private recordsUpdated = new BehaviorSubject(false);

  public recordsUpdatedObservable = this.recordsUpdated.asObservable();

  constructor(private httpClient: HttpClient) {}

  private handleError(error: Response | any) {
    return throwError(error);
  }

  public getSearchBp(request: TaDatagridRequest): Observable<any> {
    request.page = request.page > 0 ? request.page - 1 : 0;

    return this.httpClient
      .post<GetSearchBpResponseInterface>(
        '/api/hub/search/base-records/filters',
        request
      )
      .pipe(catchError(this.handleError));
  }

  public getAssessmentEnabled(): Observable<boolean> {
    return this.httpClient
      .get<boolean>('/api/hub/user-roles/assessment-enabled')
      .pipe(catchError(this.handleError));
  }

  public triggerRecordsUpdated() {
    this.recordsUpdated.next(true);
  }
}
