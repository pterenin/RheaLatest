import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpUtilsService } from '../utils/utils.service';
import { PrimaryEntityExistsInterface } from 'src/app/shared/_interfaces/rest-api/primary-entity-controller/primary-entity-controller';

@Injectable({
  providedIn: 'root'
})
export class PrimaryEntityControllerService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  public hasPrimaryEntity(): Observable<PrimaryEntityExistsInterface> {
    return this.httpClient
      .get('/api/hub/primary-entities/exists')
      .pipe(
        map(this.mapHasPrimaryEntity),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapHasPrimaryEntity(
    response: PrimaryEntityExistsInterface
  ): PrimaryEntityExistsInterface {
    return response;
  }
}
