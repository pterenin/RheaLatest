import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { Subscription, Observable } from 'rxjs';
import { BaseDomainTypeEnum } from 'src/app/shared/models/base-domain-model';
import { ActivatedRoute, Router, CanDeactivate } from '@angular/router';
import { getRouteParamObservable } from 'src/app/shared/utils/route-utils';
import { ThirdPartyService } from 'src/app/shared/services/third-party/third-party.service';
import { ToastService } from '@trustarc/ui-toolkit';
import { DataInventoryService } from '../../data-inventory.service';
import { TabsetGuardedComponent } from 'src/app/shared/components/tabset-guarded/tabset-guarded.component';
import { SETTINGS } from 'src/app/app.constants';

@AutoUnsubscribe(['_paramMap$', '_queryParam$'])
@Component({
  selector: 'ta-third-party',
  templateUrl: './third-party.component.html',
  styleUrls: ['./third-party.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ThirdPartyComponent
  implements OnInit, OnDestroy, CanDeactivate<ThirdPartyComponent> {
  @ViewChild(TabsetGuardedComponent)
  public tabSetGuarded: TabsetGuardedComponent;
  public baseDomainId: string;
  public baseDomainType = BaseDomainTypeEnum.ThirdParty;
  public showRiskFields = SETTINGS.ShowRiskFields;
  public isUploading = false;
  public isCurrentFormValid = false;
  public activeTabId = 'details';
  public action: string;

  public _paramMap$: Subscription;
  private _queryParam$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private thirdPartyService: ThirdPartyService,
    private toastService: ToastService,
    private dataInventoryService: DataInventoryService
  ) {}

  public updateValidity(newValue: boolean) {
    this.isCurrentFormValid = newValue;
  }

  public updateUploading(newValue: boolean) {
    this.isUploading = newValue;
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
    });
  }

  public saveAndNavigateToDataInventory() {
    this.router.navigate([`data-inventory`]);
  }

  ngOnDestroy() {}

  public canDeactivate(
    thirdPartyComponent: ThirdPartyComponent
  ): Observable<boolean> | boolean {
    return thirdPartyComponent.tabSetGuarded.canDeactivate();
  }
}
