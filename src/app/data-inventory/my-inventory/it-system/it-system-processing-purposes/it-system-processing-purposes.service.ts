import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { isIdParameterInvalid } from 'src/app/shared/utils/basic-utils';

@Injectable({
  providedIn: 'root'
})
export class ItSystemProcessingPurposesService {
  constructor(private httpClient: HttpClient) {}

  public getSelectedProcessingPurposeIds(
    id: string
  ): Observable<{ processingPurposeIds: string[] } & BaseDomainInterface> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    return this.httpClient.get<
      { processingPurposeIds: string[] } & BaseDomainInterface
    >(`/api/hub/it-systems/${id}/processing-purposes`);
  }

  public updateSelectedProcessingPurposeIds(
    baseDomain: BaseDomainInterface,
    processingPurposeIds: string[]
  ): Observable<BaseDomainInterface> {
    if (isIdParameterInvalid(baseDomain.id)) {
      return throwError(`Invalid ID: ${baseDomain.id}`);
    }
    return this.httpClient.put<BaseDomainInterface>(
      `/api/hub/it-systems/${baseDomain.id}/processing-purposes`,
      { ...baseDomain, processingPurposeIds }
    );
  }

  public mapProcessingPurposeToIds(processingPurposes: any[]): string[] {
    return processingPurposes.map(processingPurpose => processingPurpose.id);
  }
}
