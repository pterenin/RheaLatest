import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  DataSubjectCategoryInterface,
  DataSubjectInterface,
  DataSubjectRequestInterface,
  DataSubjectUpsertResponseInterface
} from '../../models/data-subjects.model';
import {
  BaseCategoryInterface,
  categorize
} from '../../components/categorical-view/base-category.model';

import { SearchResponseInterface } from '../../models/search.model';
import { DataInterface } from '../../components/categorical-view/categorical-view.component';

import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { isIdParameterInvalid } from 'src/app/shared/utils/basic-utils';

@Injectable({
  providedIn: 'root'
})
export class DataSubjectsService {
  constructor(private httpClient: HttpClient) {}

  public getAllDataSubjects(): Observable<
    BaseCategoryInterface<DataSubjectInterface>[]
  > {
    return this.httpClient
      .get<{ content: DataSubjectInterface[] }>(
        `/api/hub/data-subjects?size=300`
      )
      .pipe(map(this.mapDataSubjectsToDataInterface));
  }

  public getDataSubjects(): Observable<
    SearchResponseInterface<DataSubjectInterface>
  > {
    return this.httpClient.get<SearchResponseInterface<DataSubjectInterface>>(
      `/api/hub/data-subjects`
    );
  }

  private mapDataSubjectsToDataInterface(response: {
    content: DataSubjectInterface[];
  }): BaseCategoryInterface<DataSubjectInterface>[] {
    const dataSubjects = response.content;

    const categorized = categorize<DataSubjectInterface>(
      dataSubjects,
      'dataSubject'
    );

    categorized.map(category => ({
      ...category,
      items: category.items.map(item => ({
        ...item,
        subItem: category.label
      }))
    }));

    // remove element hidden from the list
    const dataSubjectsGroups = [];
    categorized.map(categories => {
      const isHiddenCate = categories.items.find(
        item => item.categoryHidden === true
      );
      const items = categories.items.filter(item => !item.hidden);
      if (!isHiddenCate && items.length > 0) {
        categories.items = items;
        dataSubjectsGroups.push(categories);
      }
    });

    return dataSubjectsGroups;
  }

  public getAllDataSubjectsForBusinessProcess(id) {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    const response = this.httpClient.get(
      `/api/hub/business-processes/${id}/approval`
    );
    return response;
  }

  public addOtherElementToTheEndOfDataSubjectCategories(
    dataArray: (BaseCategoryInterface<DataSubjectInterface> | DataInterface)[]
  ) {
    const otherIndex = dataArray
      .map((element: any) => element.label)
      .indexOf('Other');
    if (otherIndex !== -1) {
      const otherElement = dataArray.splice(otherIndex, 1);
      dataArray.push(otherElement[0]);
    }
  }

  public createCustomDataSubject(
    body: DataSubjectRequestInterface
  ): Observable<DataSubjectUpsertResponseInterface> {
    return this.httpClient.request<DataSubjectUpsertResponseInterface>(
      'POST',
      '/api/hub/data-subjects',
      { body }
    );
  }

  public updateCustomDataSubjectById(
    id: string,
    body: DataSubjectRequestInterface
  ): Observable<DataSubjectUpsertResponseInterface> {
    return this.httpClient.request<DataSubjectUpsertResponseInterface>(
      'PUT',
      `/api/hub/data-subjects/${id}`,
      { body }
    );
  }

  public deleteDataSubjects(ids: string[]): Observable<any> {
    return this.httpClient.request('DELETE', '/api/hub/data-subjects', {
      body: ids
    });
  }

  public putToggleVisibility(ppItems): Observable<any> {
    return this.httpClient.put(`api/hub/data-subjects/toggleVisibility`, {
      dataSubjectIds: ppItems.map(item => item.id)
    });
  }

  public unlinkDataSubjects(dataSubjectIds: string[]): Observable<any> {
    return this.httpClient.put<any>(
      '/api/hub/data-subjects/unlink',
      dataSubjectIds
    );
  }

  public unlinkDataSubjectsCategories(
    categories: DataSubjectCategoryInterface[]
  ): Observable<any> {
    const ids = categories.map(category => category.id);
    return this.httpClient.put(`/api/hub/data-subject-categories/unlink`, {
      dataSubjectCategoryIds: ids
    });
  }
}
