import { Injectable } from '@angular/core';
import { TaTableRequest } from '@trustarc/ui-toolkit';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { SearchResponseInterface } from '../../models/search.model';
import {
  DataSubjectCategoryInterface,
  DataSubjectCategoryListResponseInterface
} from '../../models/data-subjects.model';

import { defaultTo } from '../../utils/basic-utils';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataSubjectCategoriesService {
  private static columnNameToSortNameMap = {
    name: 'dataSubject',
    riskClassification: 'risk',
    identifier: 'identifier',
    highRiskFactorCategories: 'highRiskFactorCategories',
    DataSubjectCategory: 'dataSubjects',
    linkedRecords: 'linkedRecords'
  };

  constructor(private httpClient: HttpClient) {}

  public addDataSubjectCategory(
    categoryName: string
  ): Observable<DataSubjectCategoryInterface> {
    const body = {
      category: categoryName
    };
    return this.httpClient.post<DataSubjectCategoryInterface>(
      `/api/hub/data-subject-categories`,
      body
    );
  }

  public editDataSubjectCategoryName(
    updatedCategory: DataSubjectCategoryInterface
  ) {
    return this.httpClient.put(
      `/api/hub/data-subject-categories/${updatedCategory.id}`,
      updatedCategory
    );
  }

  public getDataSubjectCategoryList(
    request: TaTableRequest,
    visibility: 'hidden' | 'visible' | 'all',
    creation: 'system' | 'custom' | 'all'
  ): Observable<SearchResponseInterface<DataSubjectCategoryInterface>> {
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

    let params;

    if (visibility === 'all' && creation === 'all') {
      params = new HttpParams()
        .append('page', request.page.toString())
        .append('size', request.maxRows.toString())
        .append('sort', sortRequest);
    } else if (visibility !== 'all' && creation === 'all') {
      params = new HttpParams()
        .append('onlyVisible', viewVisibleStr)
        .append('onlyHidden', viewHiddenStr)
        .append('onlyCustom', 'false')
        .append('onlyDefault', 'false')
        .append('page', request.page.toString())
        .append('size', request.maxRows.toString())
        .append('sort', sortRequest);
    } else if (visibility === 'all' && creation !== 'all') {
      params = new HttpParams()
        .append('onlyCustom', viewCustomStr)
        .append('onlyDefault', viewDefaultStr)
        .append('page', request.page.toString())
        .append('size', request.maxRows.toString())
        .append('sort', sortRequest);
    } else if (visibility !== 'all' && creation !== 'all') {
      params = new HttpParams()
        .append('onlyVisible', viewVisibleStr)
        .append('onlyHidden', viewHiddenStr)
        .append('onlyCustom', viewCustomStr)
        .append('onlyDefault', viewDefaultStr)
        .append('page', request.page.toString())
        .append('size', request.maxRows.toString())
        .append('sort', sortRequest);
    }
    return this.httpClient.get<
      SearchResponseInterface<DataSubjectCategoryInterface>
    >(`/api/hub/data-subject-categories`, { params });
  }

  public hideDataSubjectCategories(
    categories: DataSubjectCategoryInterface[]
  ): Observable<any> {
    return this.httpClient.put(
      `/api/hub/data-subject-categories/toggleVisibility`,
      {
        dataSubjectCategoryIds: categories.map(category => category.id)
      }
    );
  }

  public getDataSubjectSettingsByCategory(
    request: TaTableRequest,
    categoryId: string,
    visibility: 'hidden' | 'visible' | 'all',
    creation: 'system' | 'custom' | 'all'
  ): Observable<DataSubjectCategoryListResponseInterface> {
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
      DataSubjectCategoriesService.columnNameToSortNameMap[request.columnSort];
    if (sortColumnName) {
      const sortTypeExists = request.sortType && request.sortType.length > 0;

      const sortRequest = sortTypeExists
        ? `${sortColumnName},${request.sortType}`
        : sortColumnName;
      params = params.append('sort', sortRequest);
    }

    const url = `/api/hub/data-subject-categories/${categoryId}/details`;

    return this.httpClient.get<DataSubjectCategoryListResponseInterface>(url, {
      params: params
    });
  }

  public getAllDataSubjectsCategories(
    page?: number,
    size: number = 50
  ): Observable<DataSubjectCategoryInterface[]> {
    const params = new HttpParams()
      .append('page', defaultTo('0', page))
      .append('size', size.toString(10));

    return this.httpClient
      .get<{ content: DataSubjectCategoryInterface[] }>(
        `api/hub/data-subject-categories`,
        { params }
      )
      .pipe(map(this.mapCategoryToCategoryInterface));
  }

  public deleteDataSubjectCategories(
    categories: DataSubjectCategoryInterface[]
  ): Observable<any> {
    const request = {
      dataSubjectCategoryIds: categories.map(category => category.id)
    };

    return this.httpClient.request(
      'DELETE',
      `/api/hub/data-subject-categories`,
      {
        body: request
      }
    );
  }

  private mapCategoryToCategoryInterface(
    response: SearchResponseInterface<DataSubjectCategoryInterface>
  ): DataSubjectCategoryInterface[] {
    if (Array.isArray(response.content)) {
      response.content.forEach((item: any) => {
        item.id = item.categoryId;
        item.category = item.categoryName;
      });
    }

    return response.content;
  }
}
