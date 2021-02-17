import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { BaseDomainTypeEnum } from 'src/app/shared/models/base-domain-model';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router, CanDeactivate } from '@angular/router';
import { getRouteParamObservable } from 'src/app/shared/utils/route-utils';
import { PrimaryCompanyDetailsService } from './primary-company-details/primary-company-details.service';
import { ToastService } from '@trustarc/ui-toolkit';
import { exists } from 'src/app/shared/utils/basic-utils';
import { TabsetGuardedComponent } from 'src/app/shared/components/tabset-guarded/tabset-guarded.component';
import { SETTINGS } from 'src/app/app.constants';

declare const window: Window;

@AutoUnsubscribe(['_paramMap$'])
@Component({
  selector: 'ta-primary-company',
  templateUrl: './primary-company.component.html',
  styleUrls: ['./primary-company.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrimaryCompanyComponent
  implements OnInit, OnDestroy, CanDeactivate<PrimaryCompanyComponent> {
  @ViewChild(TabsetGuardedComponent)
  public tabSetGuarded: TabsetGuardedComponent;
  public baseDomainId: string;
  public baseDomainType = BaseDomainTypeEnum.CompanyEntity;

  private _paramMap$: Subscription;
  public activeTabId = 'details';

  private elpisUrl: string;
  public isUploading = false;
  public isCurrentFormValid = true;
  public showRiskFields = SETTINGS.ShowRiskFields;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private primaryCompanyDetailsService: PrimaryCompanyDetailsService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this._paramMap$ = getRouteParamObservable(
      this.route.paramMap,
      'id'
    ).subscribe(id => {
      this.baseDomainId = id;
    });
  }

  public onDetailsLoaded(event) {
    this.elpisUrl = event.companyProfileEditUrl;
  }

  public saveAndNavigateToDataInventory() {
    this.router.navigate([`data-inventory`]);
  }

  public onEditCompanyProfile() {
    if (exists(this.elpisUrl)) {
      window.open(this.elpisUrl, '_blank');
    } else {
      // [i18n-tobeinternationalized]
      this.toastService.error(
        'Error redirecting to Edit Full Company Profile page'
      );
    }
  }

  public updateValidity(newValue: boolean) {
    this.isCurrentFormValid = newValue;
  }

  public updateUploading(newValue: boolean) {
    this.isUploading = newValue;
  }

  ngOnDestroy() {}

  public canDeactivate(
    primaryCompanyComponent: PrimaryCompanyComponent
  ): Observable<boolean> | boolean {
    return primaryCompanyComponent.tabSetGuarded.canDeactivate();
  }
}
