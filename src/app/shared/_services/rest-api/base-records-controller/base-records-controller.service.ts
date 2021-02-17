import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpUtilsService } from '../utils/utils.service';
import { TagGroupInterface } from 'src/app/shared/models/tags.model';
import { isIdParameterInvalid } from 'src/app/shared/utils/basic-utils';
import { BaseDomainTypeEnum } from 'src/app/shared/models/base-domain-model';

@Injectable({
  providedIn: 'root'
})
export class BaseRecordsControllerService {
  public versionAfterUpdateTags: BehaviorSubject<number>;
  private typeToUrlMap: object = {};

  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {
    this.typeToUrlMap[
      BaseDomainTypeEnum.BusinessProcess
    ] = `/api/hub/tags/business-processes`;
    this.typeToUrlMap[
      BaseDomainTypeEnum.CompanyEntity
    ] = `/api/hub/tags/company-entities`;
    this.typeToUrlMap[BaseDomainTypeEnum.ItSystem] = `/api/hub/tags/it-systems`;
    this.typeToUrlMap[
      BaseDomainTypeEnum.ThirdParty
    ] = `/api/tags/third-parties`;

    this.versionAfterUpdateTags = new BehaviorSubject(0);
  }

  //#region tags
  public getTags(baseDomainId: string): Observable<TagGroupInterface[]> {
    if (!baseDomainId) {
      return of([]);
    } else {
      if (isIdParameterInvalid(baseDomainId)) {
        return throwError(`Invalid ID: ${baseDomainId}`);
      }
      return this.httpClient
        .get(`/api/hub/base-records/${baseDomainId}/tags`, {})
        .pipe(map(success => success['tags'] as TagGroupInterface[]));
    }
  }

  public putTags(
    baseDomainId: string,
    tags: TagGroupInterface[]
  ): Observable<any> {
    if (!baseDomainId) {
      return of({});
    } else {
      if (isIdParameterInvalid(baseDomainId)) {
        return throwError(`Invalid ID: ${baseDomainId}`);
      }
      return this.httpClient.put<any>(
        `/api/hub/base-records/${baseDomainId}/tags`,
        { tags }
      );
    }
  }

  public getAllTags(
    baseDomainType: BaseDomainTypeEnum,
    includeChild = false
  ): Observable<TagGroupInterface[]> {
    let url = this.typeToUrlMap[baseDomainType];
    if (includeChild) {
      url = `${url}?flatten=false&includeChild=true`;
    }
    if (url) {
      return this.httpClient.get<TagGroupInterface[]>(url, {});
    } else {
      return of([]);
    }
  }

  //#endregion
}
