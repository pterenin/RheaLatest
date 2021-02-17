import { NgModule } from '@angular/core';
import { DataInventoryComponent } from './data-inventory.component';
import { Routes, RouterModule } from '@angular/router';
import { CompanyAffiliateComponent } from './my-inventory/company-affiliate/company-affiliate.component';
import { ItSystemComponent } from './my-inventory/it-system/it-system.component';
import { ThirdPartyComponent } from './my-inventory/third-party/third-party.component';
import { MyInventoryComponent } from './my-inventory/my-inventory.component';
import { PrimaryCompanyComponent } from './my-inventory/primary-company/primary-company.component';
import { AAA_NAV_LINK } from '../shared/components/header/header-aaa.constant';

const routes: Routes = [
  {
    path: '',
    component: DataInventoryComponent,
    children: [
      {
        path: 'my-inventory',
        component: MyInventoryComponent,
        data: {
          title: 'My Inventory', // [i18n-tobeinternationalized]
          // breadcrumb: 'My Inventory', // [i18n-tobeinternationalized]
          showLeftNav: true,
          leftNavType: 'MY_INVENTORY',
          aaaNavLink: AAA_NAV_LINK.DATA_INVENTORY,
          showBreadCrumb: true,
          footer: true,
          header: true
        }
      },
      {
        path: 'my-inventory/company-affiliate/:id',
        component: CompanyAffiliateComponent,
        canDeactivate: [CompanyAffiliateComponent],
        data: {
          title: 'Company Affiliate', // [i18n-tobeinternationalized], temp placeholder
          header: true,
          aaaNavLink: AAA_NAV_LINK.DATA_INVENTORY
        }
      },
      {
        path: 'my-inventory/it-system/:id',
        component: ItSystemComponent,
        canDeactivate: [ItSystemComponent],
        data: {
          title: 'System', // [i18n-tobeinternationalized], temp placeholder
          header: true,
          aaaNavLink: AAA_NAV_LINK.DATA_INVENTORY
        }
      },
      {
        path: 'my-inventory/third-party/:id',
        component: ThirdPartyComponent,
        canDeactivate: [ThirdPartyComponent],
        data: {
          title: 'Third Party', // [i18n-tobeinternationalized], temp placeholder
          header: true,
          aaaNavLink: AAA_NAV_LINK.DATA_INVENTORY
        }
      },
      {
        path: 'my-inventory/primary-company/:id',
        component: PrimaryCompanyComponent,
        canDeactivate: [PrimaryCompanyComponent],
        data: {
          title: 'Primary Company', // [i18n-tobeinternationalized], temp placeholder
          header: true,
          aaaNavLink: AAA_NAV_LINK.DATA_INVENTORY
        }
      },
      {
        path: '**',
        redirectTo: 'my-inventory',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataInventoryRoutingModule {}
