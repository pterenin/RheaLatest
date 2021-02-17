import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router, CanDeactivate } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { getRouteParamObservable } from 'src/app/shared/utils/route-utils';
import { BaseDomainTypeEnum } from 'src/app/shared/models/base-domain-model';
import { TabsetGuardedComponent } from 'src/app/shared/components/tabset-guarded/tabset-guarded.component';
import { RoutingStateService } from 'src/app/global-services/routing-state.service';
import { SETTINGS } from 'src/app/app.constants';

@AutoUnsubscribe(['_paramMap$', '_queryParam$'])
@Component({
  selector: 'ta-it-system',
  templateUrl: './it-system.component.html',
  styleUrls: ['./it-system.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItSystemComponent
  implements OnInit, OnDestroy, CanDeactivate<ItSystemComponent> {
  @ViewChild(TabsetGuardedComponent)
  public tabSetGuarded: TabsetGuardedComponent;
  public baseDomainId: string;
  public baseDomainType = BaseDomainTypeEnum.ItSystem;
  public isCurrentFormValid = false;
  public isUploading = false;
  public activeTabId = 'details';
  public tabToRedirect: string;
  public action: string;
  public showRiskFields = SETTINGS.ShowRiskFields;
  public isFormSaving = false;

  private _paramMap$: Subscription;
  private _queryParam$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routingStateService: RoutingStateService
  ) {}

  public updateValidity(newValue: boolean) {
    this.isCurrentFormValid = newValue;
  }

  public updateUploading(newValue: boolean) {
    this.isUploading = newValue;
  }

  public updateSaving(newValue: boolean) {
    this.isFormSaving = newValue;
  }

  ngOnInit() {
    this._paramMap$ = getRouteParamObservable(
      this.route.paramMap,
      'id'
    ).subscribe(id => {
      this.baseDomainId = id;
    });

    this._queryParam$ = this.route.queryParams.subscribe(params => {
      this.action = params.action;
      this.tabToRedirect = params.tab;
    });
  }

  public saveAndNavigateToDataInventory() {
    const lastRoute = this.routingStateService.getLatestReplayableHistory();
    if (lastRoute && lastRoute.url) {
      // If we've navigated from somewhere outside of Data Inventory navigate back to where we were instead.
      this.router.navigate([lastRoute.url], { state: { action: this.action } });
    } else {
      this.router.navigate([`data-inventory`]);
    }
  }

  ngOnDestroy() {}

  public redirectToTab($event) {
    const id = this.tabSetGuarded.getTabIdByTabTitle($event);
    if (id) {
      this.tabSetGuarded.setDisabilityByTabId(id, false); // Enable tab
      this.tabSetGuarded.tabset.select(id); // Set target tab
      this.setTabToRedirect(undefined); // Clear tab to redirect
    }
  }

  public setTabToRedirect(value) {
    this.tabToRedirect = value;
  }

  public canDeactivate(
    itSystemComponent: ItSystemComponent
  ): Observable<boolean> | boolean {
    return itSystemComponent.tabSetGuarded.canDeactivate();
  }
}
