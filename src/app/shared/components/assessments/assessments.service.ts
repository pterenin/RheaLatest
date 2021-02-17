import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AssessmentsCollectionInterface } from '../../models/assessment.model';
import { isIdParameterInvalid } from 'src/app/shared/utils/basic-utils';

@Injectable()
export class AssessmentsService {
  constructor(private httpClient: HttpClient) {}

  public getAssessments(
    recordId: String
  ): Observable<AssessmentsCollectionInterface> {
    if (isIdParameterInvalid(recordId)) {
      return throwError(`Invalid ID: ${recordId}`);
    }
    return this.httpClient.get<AssessmentsCollectionInterface>(
      `/api/hub/base-records/${recordId}/assessments`
    );
  }
}
