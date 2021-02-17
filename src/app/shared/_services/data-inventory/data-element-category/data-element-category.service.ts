import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { DataElementCategoryListResponseRawInterface } from '../../../_interfaces/data-inventory/data-element-category/data-element-category.interface';

@Injectable({
  providedIn: 'root'
})
export class DataElementCategoryService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get data element categories list
   * @description: Get data elements categories list
   * @controller: data-element-category-controller
   * @link: /GET /data-element-categories findAllSorted
   */
  public getDataElementCategoryList(): Observable<
    DataElementCategoryListResponseRawInterface
  > {
    const params = new HttpParams().append('page', '0').append('size', '100');
    return this.httpClient.get<DataElementCategoryListResponseRawInterface>(
      `/api/hub/data-element-categories`,
      { params }
    );
  }
}
