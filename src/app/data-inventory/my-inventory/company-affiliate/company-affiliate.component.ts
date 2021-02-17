import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { BaseDomainTypeEnum } from 'src/app/shared/models/base-domain-model';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router, CanDeactivate } from '@angular/router';
import { getRouteParamObservable } from 'src/app/shared/utils/route-utils';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { CompanyAffiliateService } from 'src/app/shared/services/company-affiliate/company-affiliate.service';
import { ToastService } from '@trustarc/ui-toolkit';
import { DataInventoryService } from '../../data-inventory.service';
import { TabsetGuardedComponent } from 'src/app/shared/components/tabset-guarded/tabset-guarded.component';
import { SETTINGS } from 'src/app/app.constants';

@AutoUnsubscribe(['_paramMap$', '_queryParam$'])
@Component({
  selector: 'ta-company-affiliate',
  templateUrl: './company-affiliate.component.html',
  styleUrls: ['./company-affiliate.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompanyAffiliateComponent
  implements OnInit, OnDestroy, CanDeactivate<CompanyAffiliateComponent> {
  @ViewChild(TabsetGuardedComponent)
  public tabSetGuarded: TabsetGuardedComponent;

  public baseDomainId: string;
  public baseDomainType = BaseDomainTypeEnum.CompanyEntity;

  public showRiskFields = SETTINGS.ShowRiskFields;
  public isUploading = false;
  public isCurrentFormValid = false;
  public action: string;

  private _paramMap$: Subscription;
  private _queryParam$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyAffiliateService: CompanyAffiliateService,
    private toastService: ToastService,
    private dataInventoryService: DataInventoryService
  ) {}

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

  public updateValidity($event) {
    this.isCurrentFormValid = $event;
  }

  public updateUploading(newValue: boolean) {
    this.isUploading = newValue;
  }

  public saveAndNavigateToDataInventory() {
    this.router.navigate([`data-inventory`]);
  }

  public onCancel() {
    this.dataInventoryService.setCancelFormChanges = true;
  }

  ngOnDestroy() {}

  public canDeactivate(
    companyAffiliateComponent: CompanyAffiliateComponent
  ): Observable<boolean> | boolean {
    return companyAffiliateComponent.tabSetGuarded.canDeactivate();
  }
}
