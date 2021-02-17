import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import {
  catchError,
  flatMap,
  map,
  shareReplay,
  switchMap
} from 'rxjs/operators';

import { HttpUtilsService } from '../utils/utils.service';
import { FeatureFlagAllInterface } from 'src/app/shared/_interfaces';

const REFRESH_INTERVAL = undefined; // infinity
const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagControllerService {
  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {}

  private featureFlags = {};
  private timer$ = timer(0, REFRESH_INTERVAL); // Will be polling new data at specified interval
  private sourceAllFeatureFlags$: Observable<FeatureFlagAllInterface>;

  public getAllFeatureFlags(): Observable<FeatureFlagAllInterface> {
    if (!this.sourceAllFeatureFlags$) {
      // For each tick make an http request to fetch new data
      this.sourceAllFeatureFlags$ = this.timer$.pipe(
        switchMap(_ => this.requestGetAllFeatureFlags()),
        shareReplay(CACHE_SIZE)
      );
    }

    return this.sourceAllFeatureFlags$;
  }

  private requestGetAllFeatureFlags(): Observable<FeatureFlagAllInterface> {
    return this.httpClient.get('api/hub/feature-flag/all').pipe(
      map(this.mapGetAllFeatureFlags),
      flatMap((featureFlags: FeatureFlagAllInterface) => {
        this.featureFlags = featureFlags;
        return of(featureFlags);
      }),
      catchError(this.httpUtilsService.handleError)
    );
  }

  public getFeatureFlag(featureName: string): Observable<boolean> {
    // If the license is cached, used cached license instead of xhr request
    if (this.featureFlags[featureName]) {
      return of(this.featureFlags[featureName]);
    }

    return this.httpClient
      .get(`/api/hub/feature-flag/${featureName}`)
      .pipe(
        map(this.mapGetFeatureFlag),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapGetAllFeatureFlags(
    response: FeatureFlagAllInterface
  ): FeatureFlagAllInterface {
    return response;
  }

  private mapGetFeatureFlag(response: boolean): boolean {
    return response;
  }
}
