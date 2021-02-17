import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataSubjectListResponseRawInterface } from '../../../_interfaces/data-inventory/data-subject/data-subject.interface';

@Injectable({
  providedIn: 'root'
})
export class DataSubjectService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get data subjects list
   * @description: Get data subjects list
   * @controller: data-subject-controller
   * @link: /GET /data-subjects findAllSorted
   */
  public getDataSubjectsList(): Observable<
    DataSubjectListResponseRawInterface
  > {
    return this.httpClient.get<DataSubjectListResponseRawInterface>(
      `/api/hub/data-subjects`
    );
  }
}
