import { Injectable } from '@angular/core';
import { TaTableRequest } from '@trustarc/ui-toolkit';
import { Observable } from 'rxjs';
import { SearchResponseInterface } from '../../models/search.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ProcessingPurposeCategoryInterface,
  ProcessingPurposeCategoryListResponseInterface
} from '../../models/processing-purposes.model';
import { defaultTo } from '../../utils/basic-utils';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProcessingPurposeCategoriesService {
  private static columnNameToSortNameMap = {
    name: 'processingPurpose',
    riskClassification: 'risk',
    identifier: 'identifier',
    highRiskFactorCategories: 'highRiskFactorCategories',
    ProcessingPurposeCategory: 'linkedRecords',
    linkedRecords: 'linkedRecords'
  };

  constructor(private httpClient: HttpClient) {}

  public addProcessingPurposeCategory(
    categoryName: string
  ): Observable<ProcessingPurposeCategoryInterface> {
    const body = {
      category: categoryName
    };
    return this.httpClient.post<ProcessingPurposeCategoryInterface>(
      `/api/hub/processing-purpose-categories`,
      body
    );
  }

  public editProcessingPurposeCategoryName(
    updatedCategory: ProcessingPurposeCategoryInterface
  ) {
    return this.httpClient.put(
      `/api/hub/processing-purpose-categories/${updatedCategory.id}`,
      updatedCategory
    );
  }

  public getProcessingPurposeCategoryList(
    request: TaTableRequest,
    visibility: 'hidden' | 'visible' | 'all',
    creation: 'system' | 'custom' | 'all'
  ): Observable<SearchResponseInterface<ProcessingPurposeCategoryInterface>> {
    const sortTypeExists = request.sortType && request.sortType.length > 0;

    const columnSortExists =
      request.columnSort && request.columnSort.length > 0;

    const sortRequest =
      sortTypeExists && columnSortExists
        ? `${request.columnSort},${request.sortType}`
        : '';

    const viewCustomStr =
      creation === 'custom' || creation === 'all' ? 'true' : 'false';
    const viewDefaultStr =
      creation === 'system' || creation === 'all' ? 'true' : 'false';
    const viewHiddenStr =
      visibility === 'hidden' || visibility === 'all' ? 'true' : 'false';
    const viewVisibleStr =
      visibility === 'visible' || visibility === 'all' ? 'true' : 'false';

    const params = new HttpParams()
      .append('viewVisible', viewVisibleStr)
      .append('viewHidden', viewHiddenStr)
      .append('viewCustom', viewCustomStr)
      .append('viewDefault', viewDefaultStr)
      .append('page', request.page.toString())
      .append('size', request.maxRows.toString())
      .append('sort', sortRequest);

    return this.httpClient.get<
      SearchResponseInterface<ProcessingPurposeCategoryInterface>
    >(`/api/hub/processing-purpose-categories`, { params: params });
  }

  public hideProcessingPurposeCategories(
    categories: ProcessingPurposeCategoryInterface[]
  ): Observable<any> {
    return this.httpClient.put(
      `/api/hub/processing-purpose-categories/toggleVisibility`,
      {
        processingPurposeCategoryIds: categories.map(category => category.id)
      }
    );
  }

  public getProcessingPurposeSettingsByCategory(
    request: TaTableRequest,
    categoryId: string,
    visibility: 'hidden' | 'visible' | 'all',
    creation: 'system' | 'custom' | 'all'
  ): Observable<ProcessingPurposeCategoryListResponseInterface> {
    //
    const viewCustomStr = creation !== 'system' ? 'true' : 'false';
    const viewDefaultStr = creation !== 'custom' ? 'true' : 'false';
    const viewHiddenStr = visibility !== 'visible' ? 'true' : 'false';
    const viewVisibleStr = visibility !== 'hidden' ? 'true' : 'false';

    let params = new HttpParams()
      .append('page', request.page.toString())
      .append('size', request.maxRows.toString())
      .append('viewCustom', viewCustomStr)
      .append('viewDefault', viewDefaultStr)
      .append('viewHidden', viewHiddenStr)
      .append('viewVisible', viewVisibleStr);

    const sortColumnName =
      ProcessingPurposeCategoriesService.columnNameToSortNameMap[
        request.columnSort
      ];
    if (sortColumnName) {
      const sortTypeExists = request.sortType && request.sortType.length > 0;

      const sortRequest = sortTypeExists
        ? `${sortColumnName},${request.sortType}`
        : sortColumnName;
      params = params.append('sort', sortRequest);
    }

    const url = `/api/hub/processing-purpose-categories/${categoryId}/details`;

    return this.httpClient.get<ProcessingPurposeCategoryListResponseInterface>(
      url,
      {
        params: params
      }
    );
  }
  public getAllProcessingPurposesCategories(
    page?: number,
    size: number = 50
  ): Observable<ProcessingPurposeCategoryInterface[]> {
    const params = new HttpParams()
      .append('page', defaultTo('0', page))
      .append('size', size.toString(10));

    return this.httpClient
      .get<{ content: ProcessingPurposeCategoryInterface[] }>(
        `api/hub/processing-purpose-categories`,
        { params }
      )
      .pipe(map(this.mapCategoryToCategoryInterface));
  }

  public deleteProcessingPurposesCategories(
    categories: ProcessingPurposeCategoryInterface[]
  ): Observable<any> {
    const request = {
      processingPurposeCategoryIds: categories.map(category => category.id)
    };

    return this.httpClient.request(
      'DELETE',
      `/api/hub/processing-purpose-categories`,
      {
        body: request
      }
    );
  }

  private mapCategoryToCategoryInterface(
    response: SearchResponseInterface<ProcessingPurposeCategoryInterface>
  ): ProcessingPurposeCategoryInterface[] {
    return response.content;
  }
}
