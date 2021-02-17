import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  CompanyEntityInterface,
  EntityContentInterface,
  OwnerEntityInterface,
  OwnerInterface
} from './step-2.model';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { multicastInProgressState } from 'src/app/shared/utils/rxjs-utils';
import {
  isIdParameterInvalid,
  isNullOrUndefined
} from 'src/app/shared/utils/basic-utils';

declare const _: any;

@Injectable()
export class Step2Service {
  private isUpdatingSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public getIsUpdatingSubject(): BehaviorSubject<boolean> {
    return this.isUpdatingSubject;
  }
  constructor(private httpClient: HttpClient) {}

  public getBpOwner(id: string): Observable<OwnerEntityInterface> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    return this.httpClient
      .get<OwnerEntityInterface>(`/api/hub/business-processes/${id}/owner`, {})
      .pipe(map(this.mapBpOwner), catchError(this.handleError));
  }

  private mapBpOwner(response: OwnerEntityInterface): OwnerEntityInterface {
    return response;
  }

  public getCompanyEntities(page?: number): Observable<CompanyEntityInterface> {
    let params = new HttpParams();

    params = params.append('size', '5000');

    const pageString = isNullOrUndefined(page) ? '0' : page.toString();
    if (!isNullOrUndefined(page)) {
      params = params.append('page', page.toString());
    }

    return this.httpClient.get<CompanyEntityInterface>(
      `/api/hub/company-entities`,
      { params }
    );
  }

  public getDepartments(): Observable<EntityContentInterface[]> {
    return this.httpClient.get<EntityContentInterface[]>(
      `/api/hub/departments`
    );
  }

  public getOwningEntityRoles(): Observable<String[]> {
    return this.httpClient.get<String[]>(
      `/assets/json/data-inventory/owningEntityRole.json`
    );
  }
  public saveOwner(owner: OwnerInterface): Observable<BaseDomainInterface> {
    return multicastInProgressState(
      this.httpClient
        .put<OwnerInterface>(
          `/api/hub/business-processes/${owner.id}/owner`,
          owner
        )
        .pipe(
          map(
            response =>
              ({
                id: response.id,
                version: response.version
              } as BaseDomainInterface)
          ),
          catchError(this.handleError)
        ),
      this.isUpdatingSubject
    );
  }

  private handleError(error: Response | any) {
    return throwError(error);
  }
}
