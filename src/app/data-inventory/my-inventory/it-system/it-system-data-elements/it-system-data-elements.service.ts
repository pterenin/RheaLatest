import { Injectable } from '@angular/core';
import { DataElementInterface } from 'src/app/shared/models/data-elements.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';

@Injectable({
  providedIn: 'root'
})
export class ItSystemDataElementsService {
  constructor(private httpClient: HttpClient) {}

  public getSelectedDataElementIds(
    id: string
  ): Observable<{ dataElements: any[] } & BaseDomainInterface> {
    return this.httpClient.get<{ dataElements: any[] } & BaseDomainInterface>(
      `/api/hub/it-systems/${id}/data-elements`
    );
  }

  public updateSelectedDataElementIds(
    baseDomain: BaseDomainInterface,
    dataElementIds: string[]
  ): Observable<BaseDomainInterface> {
    return this.httpClient.put<BaseDomainInterface>(
      `/api/hub/it-systems/${baseDomain.id}/data-elements`,
      { ...baseDomain, dataElementIds }
    );
  }

  public mapDataElementsToIds(dataElements: any[]): string[] {
    return dataElements.map(dataElement => dataElement.id);
  }
}
