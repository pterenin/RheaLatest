import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpUtilsService } from '../utils/utils.service';
import { LegalBasisInterface } from '../../../_interfaces/rest-api/legal-bases-controller/legal-bases-controller';

@Injectable({
  providedIn: 'root'
})
export class LegalBasesControllerService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  public findAll(): Observable<LegalBasisInterface[]> {
    return this.httpClient
      .get(`/api/hub/legal-bases`)
      .pipe(
        map(this.mapGetColumnConfig),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapGetColumnConfig(
    response: LegalBasisInterface[]
  ): LegalBasisInterface[] {
    return response;
  }
}
