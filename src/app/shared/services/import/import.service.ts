import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImportInterface } from '../../models/import.model';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  constructor(private httpClient: HttpClient) {}

  public downloadTemplates(path: String): Observable<HttpResponse<Blob>> {
    return this.httpClient.get(`/api/hub/templates${path}`, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  public uploadCsvs(
    files: FormData
  ): Observable<HttpResponse<ImportInterface>> {
    return this.httpClient.post<ImportInterface>(
      '/api/hub/imports/all/csv',
      files,
      {
        observe: 'response'
      }
    );
  }
}
