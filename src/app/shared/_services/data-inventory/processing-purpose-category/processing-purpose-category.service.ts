import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { ProcessingPurposeCategoryListResponseRawInterface } from '../../../_interfaces/data-inventory/processing-purpose-category/processing-purpose-category.interface';

@Injectable({
  providedIn: 'root'
})
export class ProcessingPurposeCategoryService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get processing purpose categories list
   * @description: Get processing purpose categories list
   * @controller: processing-purpose-category-controller
   * @link: /GET /processing-purpose-categories findAllSorted
   */
  public getProcessingPurposeCategoryList(): Observable<
    ProcessingPurposeCategoryListResponseRawInterface
  > {
    const params = new HttpParams().append('page', '0').append('size', '100');
    return this.httpClient.get<
      ProcessingPurposeCategoryListResponseRawInterface
    >(`/api/hub/processing-purpose-categories`, { params });
  }
}
