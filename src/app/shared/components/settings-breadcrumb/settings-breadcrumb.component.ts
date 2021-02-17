import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsBreadcrumbService } from './settings-breadcrumb.service';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { SettingsBreadcrumbInterface } from '../../models/settings-breadcrumb.model';

@AutoUnsubscribe(['_navLinkChange$'])
@Component({
  selector: 'ta-settings-breadcrumb',
  templateUrl: './settings-breadcrumb.component.html',
  styleUrls: ['./settings-breadcrumb.component.scss']
})
export class SettingsBreadcrumbComponent implements OnInit, OnDestroy {
  public breadcrumbs: SettingsBreadcrumbInterface[];

  public _navLinkChange$: Subscription;

  constructor(private settingsBreadcrumbService: SettingsBreadcrumbService) {}

  ngOnInit() {
    if (this._navLinkChange$) {
      this._navLinkChange$.unsubscribe();
    }
    this._navLinkChange$ = this.settingsBreadcrumbService._navLinkChangeObservable$.subscribe(
      breadcrumbs => {
        this.breadcrumbs = breadcrumbs;
      }
    );
  }

  public isLastBreadcrumb(index: number) {
    return index === this.breadcrumbs.length - 1;
  }

  ngOnDestroy() {}
}
