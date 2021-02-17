import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { DataSubjectCategoryListResponseRawInterface } from '../../../_interfaces/data-inventory/data-subject-category/data-subject-category.interface';

@Injectable({
  providedIn: 'root'
})
export class DataSubjectCategoryService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get data subject categories list
   * @description: Get data subjects categories list
   * @controller: data-subject-category-controller
   * @link: /GET /data-subjects-categories findAllSorted
   */
  public getDataSubjectCategoryList(): Observable<
    DataSubjectCategoryListResponseRawInterface
  > {
    const params = new HttpParams().append('page', '0').append('size', '100');
    return this.httpClient.get<DataSubjectCategoryListResponseRawInterface>(
      `/api/hub/data-subject-categories`,
      { params }
    );
  }
}
