import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpUtilsService } from '../utils/utils.service';
import { DataSubjectVolumeInterface } from 'src/app/shared/_interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataSubjectVolumeControllerService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  public getDataSubjectVolumes(): Observable<DataSubjectVolumeInterface[]> {
    return this.httpClient
      .get(`/api/hub/data-subject-volumes`)
      .pipe(
        map(this.mapGetAllDataSubjectVolumes),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapGetAllDataSubjectVolumes(
    response: DataSubjectVolumeInterface[]
  ): DataSubjectVolumeInterface[] {
    return response;
  }
}
