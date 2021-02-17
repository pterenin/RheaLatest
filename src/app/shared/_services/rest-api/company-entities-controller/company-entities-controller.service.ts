import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpUtilsService } from '../utils/utils.service';
import { Observable } from 'rxjs';
import {
  CompanyEntityInterface,
  EntityContentInterface
} from 'src/app/shared/_interfaces';
import { isNullOrUndefined } from '../../../utils/basic-utils';

@Injectable({
  providedIn: 'root'
})
export class CompanyEntitiesControllerService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  public getCompanyEntities(page?: number): Observable<CompanyEntityInterface> {
    let params = new HttpParams();

    params = params.append('size', '1000');

    const pageString = isNullOrUndefined(page) ? '0' : page.toString();
    params = params.append('page', pageString);

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
}
