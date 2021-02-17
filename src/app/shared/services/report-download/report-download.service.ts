import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MultiDocumentFileRequest } from './report-download.model';

@Injectable({
  providedIn: 'root'
})
export class ReportDownloadService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Download Article 30 or BP Summary report(s).
   */
  public downloadMultiReport(
    multiDocumentFileRequest: MultiDocumentFileRequest
  ): Observable<Blob> {
    return this.httpClient.post(
      `/api/hub/reports/multiple-document-file`,
      multiDocumentFileRequest,
      { responseType: 'blob' }
    );
  }
}
