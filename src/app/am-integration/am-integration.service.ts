import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ThirdPartyService } from '../shared/services/third-party/third-party.service';
import { ToastService } from '@trustarc/ui-toolkit';
import { ItSystemService } from '../shared/services/it-system/it-system.service';
import { CompanyAffiliateService } from '../shared/services/company-affiliate/company-affiliate.service';
import { BusinessProcessService } from '../shared/services/business-process/business-process.service';
import { Router } from '@angular/router';
import { BaseDomainInterface } from '../shared/models/base-domain-model';

export type RecordTypes =
  | 'third-party'
  | 'it-system'
  | 'company-affiliate'
  | 'business-process';

@Injectable({
  providedIn: 'root'
})
export class AmIntegrationService {
  constructor(
    private router: Router,
    private thirdPartyService: ThirdPartyService,
    private toastService: ToastService,
    private itSystemService: ItSystemService,
    private companyAffiliateService: CompanyAffiliateService,
    private businessProcessService: BusinessProcessService
  ) {}

  public handleAmCreateAndRedirect(
    url: string
  ): Observable<boolean> | Promise<boolean> | boolean {
    // an example of urlFragments looks like this
    // ["", "automation", "third-party", "new"]

    const urlFragments = url.split('/');

    if (urlFragments.length !== 4) {
      return false;
    }
    let recordType: RecordTypes;
    try {
      recordType = urlFragments[2] as RecordTypes;
    } catch (error) {
      // [i18n-tobeinternationalized]
      this.toastService.error(
        'Record creation failed, please navigate back to Assessment Manager and try again.'
      );
      console.error(error);
      return false;
    }

    switch (recordType) {
      case 'third-party': {
        this.newThirdParty();
        break;
      }

      case 'it-system': {
        this.newITSystem();
        break;
      }

      case 'company-affiliate': {
        this.newCompanyAffiliate();
        break;
      }
      case 'business-process': {
        this.createNewBpAndRedirect();
        break;
      }
      default:
        return false;
    }
  }

  public createNewDataInventoryItemAndRedirect(
    creationObservable: Observable<BaseDomainInterface>,
    urlPathFragment: RecordTypes
  ) {
    if (urlPathFragment === 'business-process') {
      // [i18n-tobeinternationalized]
      // this method should be used only for data inventory types
      throwError(
        'createNewDataInventoryItemAndRedirect should not be called for a business-process record type'
      );
    }

    // NOTE: Because the services are backed by HttpClient, the subscriptions
    // will unsubscribe automatically on completion.
    creationObservable.toPromise().then(
      baseDomain =>
        this.router.navigate([
          `/data-inventory/my-inventory/${urlPathFragment}/${baseDomain.id}`
        ]),
      error =>
        // [i18n-tobeinternationalized]
        this.toastService.error('Error creating new item')
    );
  }

  public newThirdParty() {
    return this.createNewDataInventoryItemAndRedirect(
      this.thirdPartyService.create(),
      'third-party'
    );
  }

  public newITSystem() {
    return this.createNewDataInventoryItemAndRedirect(
      this.itSystemService.create(),
      'it-system'
    );
  }

  public newCompanyAffiliate() {
    return this.createNewDataInventoryItemAndRedirect(
      this.companyAffiliateService.create(),
      'company-affiliate'
    );
  }

  public createNewBpAndRedirect() {
    return this.businessProcessService
      .create()
      .toPromise()
      .then(
        bp => {
          this.router.navigate([`/business-process/${bp.id}`]);
        },
        error =>
          // [i18n-tobeinternationalized]
          this.toastService.error('Error creating new item')
      );
  }
}
