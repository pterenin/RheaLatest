import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { BaseCategoryInterface } from '../../components/categorical-view/category-model';
import {
  DataRecipientTypeInterface,
  DataSubjectTypeInterface
} from '../../models/subjects-recipients.model';
import { categorize } from '../../components/categorical-view/base-category.model';

declare const _: any;

@Injectable({
  providedIn: 'root'
})
export class DataSubjectsRecipientsService {
  public fullDataSubjectList: BaseCategoryInterface<DataSubjectTypeInterface>[];
  public fullDataRecipientList: BaseCategoryInterface<
    DataRecipientTypeInterface
  >[];
  public fullDataRecipientListRaw: DataRecipientTypeInterface[];

  constructor(private httpClient: HttpClient) {}

  public getDataSubjectTypeList(): Observable<
    BaseCategoryInterface<DataSubjectTypeInterface>[]
  > {
    if (!this.fullDataSubjectList) {
      return this.httpClient
        .get<DataSubjectTypeInterface[]>('/api/hub/data-subject-types')
        .pipe(
          map(response => this.mapDataSubjectTypes(response)),
          tap(mappedResponse => (this.fullDataSubjectList = mappedResponse)),
          catchError(this.handleError)
        );
    } else {
      return of(this.fullDataSubjectList);
    }
  }

  public onDestroy() {
    this.fullDataSubjectList = null;
    this.fullDataRecipientList = null;
    this.fullDataRecipientListRaw = null;
  }

  public getDataRecipients(): Observable<
    BaseCategoryInterface<DataRecipientTypeInterface>[]
  > {
    if (!this.fullDataRecipientList) {
      return this.httpClient
        .get<DataRecipientTypeInterface[]>('/api/hub/data-recipient-types')
        .pipe(
          map(response => this.mapDataRecipientTypes(response)),
          tap(mappedResponse => (this.fullDataRecipientList = mappedResponse)),
          catchError(this.handleError)
        );
    } else {
      return of(this.fullDataRecipientList);
    }
  }

  public getDataRecipientsRaw() {
    if (!this.fullDataRecipientListRaw) {
      return this.httpClient.get<DataRecipientTypeInterface[]>(
        '/api/hub/data-recipient-types'
      );
    } else {
      return of(this.fullDataRecipientListRaw);
    }
  }

  private mapDataSubjectTypes(
    dataSubjectTypes: DataSubjectTypeInterface[]
  ): BaseCategoryInterface<DataSubjectTypeInterface>[] {
    const r = categorize<DataSubjectTypeInterface>(
      dataSubjectTypes,
      'dataSubject'
    );

    return r;
  }

  private mapDataRecipientTypes(
    dataRecipientTypes: DataRecipientTypeInterface[]
  ): BaseCategoryInterface<DataRecipientTypeInterface>[] {
    const r = categorize<DataRecipientTypeInterface>(
      dataRecipientTypes,
      'dataRecipientType'
    );

    return r;
  }

  private handleError(error: Response | any) {
    return throwError(error);
  }
}
