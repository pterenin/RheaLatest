import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpUtilsService } from '../utils/utils.service';
import {
  NotificationTimingsInterface,
  RecurrenceOptionsInterface,
  RevalidationDetailsInterface
} from 'src/app/shared/_interfaces/rest-api/revalidation-notification-controller/revalidation-notification-controller';

@Injectable({
  providedIn: 'root'
})
export class RevalidationNotificationControllerService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  public getRevalidationDetails(
    baseRecordId: string
  ): Observable<RevalidationDetailsInterface> {
    return this.httpClient
      .get(`/api/hub/revalidation/business-process/${baseRecordId}`)
      .pipe(
        map(this.mapGetRevalidationDetails),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public getRecurrenceOptions(): Observable<RecurrenceOptionsInterface[]> {
    return this.httpClient
      .get('/api/hub/revalidation/recurrence_options')
      .pipe(
        map(this.mapGetRecurrenceOptions),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public getTimingOptions(): Observable<NotificationTimingsInterface[]> {
    return this.httpClient
      .get('/api/hub/revalidation/timing_options')
      .pipe(
        map(this.mapGetTimingOptions),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public updateRevalidationDetails(
    baseRecordId: string,
    payload: RevalidationDetailsInterface
  ): Observable<RevalidationDetailsInterface> {
    return this.httpClient
      .put(`/api/hub/revalidation/business-process/${baseRecordId}`, payload)
      .pipe(
        map(this.mapPutUpdateRevalidationDetails),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapGetRevalidationDetails(
    response: RevalidationDetailsInterface
  ): RevalidationDetailsInterface {
    return response;
  }

  private mapGetRecurrenceOptions(
    response: RecurrenceOptionsInterface[]
  ): RecurrenceOptionsInterface[] {
    return response;
  }

  private mapGetTimingOptions(
    response: NotificationTimingsInterface[]
  ): NotificationTimingsInterface[] {
    return response;
  }

  private mapPutUpdateRevalidationDetails(
    response: RevalidationDetailsInterface
  ): RevalidationDetailsInterface {
    return response;
  }
}
