import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { ProcessingPurposeListResponseRawInterface } from '../../../_interfaces/data-inventory/processing-purpose/processing-purpose.interface';

@Injectable({
  providedIn: 'root'
})
export class ProcessingPurposeService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get processing purposes list
   * @description: Get processing purposes list
   * @controller: processing-purpose-controller
   * @method: /GET /processing-purposes findAllByOrderByCategoryAscProcessingPurposeAsc
   */
  public getProcessingPurposesList(): Observable<
    ProcessingPurposeListResponseRawInterface
  > {
    return this.httpClient.get<ProcessingPurposeListResponseRawInterface>(
      `/api/hub/processing-purposes?size=10000`
    );
  }
}
