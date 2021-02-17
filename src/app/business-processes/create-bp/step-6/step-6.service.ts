import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  defaultTo,
  isIdParameterInvalid
} from 'src/app/shared/utils/basic-utils';

export interface SecurityControlInterface {
  id: string;
  version: number;
  securityControl: string;
  displayOrder: number;
}

export interface SecurityAndRiskPutRequest {
  additionalDataElementIds: string[];
  additionalProcessingPurposeIds: string[];
  dataRetention: {
    description: string;
    summary: string;
    type: string;
    value: string;
  };
  id: string;
  securityControlIds: string[];
  securityControlOther: string;
  version: number;
}

@Injectable({
  providedIn: 'root'
})
export class Step6Service {
  constructor(private httpClient: HttpClient) {}

  public getSecurityControlList(): Observable<SecurityControlInterface[]> {
    return this.httpClient.get<SecurityControlInterface[]>(
      '/api/hub/security-controls'
    );
  }

  public getStep6PageData(id) {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    return this.httpClient.get<any>(
      `/api/hub/business-processes/${id}/security-and-risk`
    );
  }

  public save(data) {
    if (isIdParameterInvalid(data.id)) {
      return throwError(`Invalid ID: ${data.id}`);
    }
    return this.httpClient.put<SecurityAndRiskPutRequest>(
      `/api/hub/business-processes/${data.id}/security-and-risk`,
      defaultTo({}, data)
    );
  }
}
