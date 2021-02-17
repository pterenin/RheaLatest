import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlSegment } from '@angular/router';
import { LoadingEventService } from '../loading/loading-event.service';
import { Events } from 'src/app/app.constants';

export interface IFeatureInfo {
  module: string;
  featureName: string;
  associatedRouteUriSegment: string;
  apiKey: string;
  isEnabled?: boolean | null;
  menuLabel?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private featureFlags: Array<IFeatureInfo>;

  constructor(
    private httpClient: HttpClient,
    private loadingEventService: LoadingEventService
  ) {
    this.loadingEventService.getData().subscribe(event => {
      const { type } = event;
      if (type === Events.AAA_TOP_HEADER_LOADED) {
        this.updateConfiguration();
      }
    });
  }

  // specify the main module, api key , menu label for left nav bar, and associated route in module
  private featureConfiguration() {
    const features: IFeatureInfo[] = [
      // Custom Data Subject
      {
        module: 'Settings',
        featureName: 'DATA_SUBJECT',
        associatedRouteUriSegment: 'data-subjects',
        apiKey: 'custom-data-subjects',
        menuLabel: 'Data Subjects'
      },

      // Custom Data RECIPIENT
      {
        module: 'Settings',
        featureName: 'DATA_RECIPIENT',
        associatedRouteUriSegment: 'data-recipients',
        apiKey: 'data-recipients',
        menuLabel: 'Data Recipients'
      }
    ];
    return features;
  }

  public updateConfiguration() {
    this.featureFlags = this.featureConfiguration();
    this.featureFlags.map(
      x => (x.isEnabled = this.isAvailable(x.featureName, true))
    );
  }

  private getStatus(featureAPIKey: string): Observable<HttpResponse<boolean>> {
    const url = `api/hub/feature-flag/${featureAPIKey}`;
    return this.httpClient.get<HttpResponse<boolean>>(url);
  }

  public isAvailable(featureName: string, nonCached?: true): boolean {
    const index = this.featureFlags.findIndex(
      x => x.featureName === featureName
    );
    if (index < 0) {
      return false;
    }

    if (
      nonCached === true ||
      this.featureFlags[index].isEnabled === undefined
    ) {
      this.getStatus(this.featureFlags[index].apiKey).subscribe(x => {
        this.featureFlags[index].isEnabled = x.valueOf() as boolean;
      });
    }

    return this.featureFlags.find(x => x.featureName === featureName)
      .isEnabled as boolean;
  }

  // for route guards
  public moduleFeatureAvailability(
    url: UrlSegment[],
    moduleName: string,
    nonCached?: true
  ): boolean {
    if (this.featureFlags === undefined || this.featureFlags.length < 1) {
      // no any feature defined for this module, ok to view
      return true;
    }
    const features = this.featureFlags.filter(
      x => x.module.toLowerCase() === moduleName.toLowerCase()
    );

    if (features.length < 1) {
      // no any feature defined for this module, ok to view
      return true;
    }

    const result = features
      .filter(f => f.isEnabled === false)
      .map(x => {
        if (url.findIndex(u => u.path === x.associatedRouteUriSegment) === 0) {
          return false;
        }
      })
      .filter(x => x === false).length;

    return result > 0 ? false : true;
  }

  // this method works for left Nav bar
  public getFeaturesList(moduleName: string, nonCached?: true): IFeatureInfo[] {
    if (this.featureFlags === undefined || this.featureFlags.length < 1) {
      return [];
    }

    const features = this.featureFlags.filter(
      x => x.module.toLowerCase() === moduleName.toLowerCase()
    );

    if (features.length < 1) {
      return [];
    }

    if (
      nonCached === true ||
      features.filter(f => f.isEnabled === undefined).length > 0
    ) {
      features.map(x => {
        this.isAvailable(x.featureName, true);
      });
    }
    return this.featureFlags.filter(
      x => x.module.toLowerCase() === moduleName.toLowerCase()
    );
  }
}
