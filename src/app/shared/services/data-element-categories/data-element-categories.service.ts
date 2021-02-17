import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TaTableRequest } from '@trustarc/ui-toolkit';
import { DataElementCategoryInterface } from '../../models/data-elements.model';
import { SearchResponseInterface } from '../../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class DataElementCategoriesService {
  constructor(private httpClient: HttpClient) {}

  public addDataElementCategory(
    categoryName: string
  ): Observable<DataElementCategoryInterface> {
    const body = {
      category: categoryName
    };
    return this.httpClient.post<DataElementCategoryInterface>(
      `/api/hub/data-element-categories`,
      body
    );
  }

  public editDataElementCategoryName(
    updatedCategory: DataElementCategoryInterface
  ) {
    return this.httpClient.put(
      `/api/hub/data-element-categories/${updatedCategory.id}`,
      updatedCategory
    );
  }

  public getDataElementCategoryList(
    request: TaTableRequest,
    visibility: 'hidden' | 'visible' | 'all',
    creation: 'system' | 'custom' | 'all'
  ): Observable<SearchResponseInterface<DataElementCategoryInterface>> {
    const sortTypeExists = request.sortType && request.sortType.length > 0;

    const columnSortExists =
      request.columnSort && request.columnSort.length > 0;

    const sortRequest =
      sortTypeExists && columnSortExists
        ? `${request.columnSort},${request.sortType}`
        : '';

    const onlyCustomStr = creation === 'custom' ? 'true' : 'false';
    const onlyDefaultStr = creation === 'system' ? 'true' : 'false';
    const onlyHiddenStr = visibility === 'hidden' ? 'true' : 'false';
    const onlyVisibleStr = visibility === 'visible' ? 'true' : 'false';

    const params = new HttpParams()
      .append('page', request.page.toString())
      .append('size', request.maxRows.toString())
      .append('onlyCustom', onlyCustomStr)
      .append('onlyDefault', onlyDefaultStr)
      .append('onlyHidden', onlyHiddenStr)
      .append('onlyVisible', onlyVisibleStr)
      .append('sort', sortRequest);

    return this.httpClient.get<
      SearchResponseInterface<DataElementCategoryInterface>
    >(`/api/hub/data-element-categories`, { params: params });
  }

  public hideDataElementCategories(
    categories: DataElementCategoryInterface[]
  ): Observable<any> {
    return this.httpClient.put(
      `/api/hub/data-element-categories/toggleVisibility`,
      {
        dataElementCategoryIds: categories.map(category => category.id)
      }
    );
  }

  public unlinkDataElementCategories(
    categories: DataElementCategoryInterface[]
  ): Observable<any> {
    return this.httpClient.put(`/api/hub/data-element-categories/unlink`, {
      dataElementCategoryIds: categories.map(category => category.id)
    });
  }

  public deleteDataElementCategories(
    categories: DataElementCategoryInterface[]
  ): Observable<any> {
    const request = {
      dataElementCategoryIds: categories.map(category => category.id)
    };

    return this.httpClient.request(
      'DELETE',
      `/api/hub/data-element-categories`,
      {
        body: request
      }
    );
  }
}
