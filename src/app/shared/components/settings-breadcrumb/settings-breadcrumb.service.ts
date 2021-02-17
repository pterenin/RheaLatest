import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SettingsBreadcrumbInterface } from '../../models/settings-breadcrumb.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsBreadcrumbService {
  private _navLinkChange$: BehaviorSubject<
    SettingsBreadcrumbInterface[]
  > = new BehaviorSubject<SettingsBreadcrumbInterface[]>([]);

  public _navLinkChangeObservable$: Observable<
    SettingsBreadcrumbInterface[]
  > = this._navLinkChange$.asObservable();

  constructor() {}

  public setCurrentNavLinks(breadcrumbs: SettingsBreadcrumbInterface[]) {
    this._navLinkChange$.next(breadcrumbs);
  }
}
