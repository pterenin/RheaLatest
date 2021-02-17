import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateChild,
  Router,
  UrlSegment
} from '@angular/router';
import { Observable } from 'rxjs';
import { FeatureFlagService } from '../shared/services/feature-flag/feature-flag.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsFeatureGuard implements CanActivateChild {
  constructor(
    private router: Router,
    private featureService: FeatureFlagService
  ) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.featureService.moduleFeatureAvailability(
      childRoute.url,
      'Settings'
    );
  }
}
