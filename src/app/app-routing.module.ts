import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAccessComponent } from './no-access/no-access.component';
import { ComponentRegistryComponent } from './component-registry/component-registry.component';
import { AAA_NAV_LINK } from './shared/components/header/header-aaa.constant';
import { SettingsFeatureGuard } from './settings/settings-feature.guard';

const routes: Routes = [
  {
    path: 'automation',
    loadChildren:
      './am-integration/am-integration/am-integration.module#AmIntegrationModule'
  },
  {
    path: 'business-process',
    loadChildren:
      './business-processes/business-processes.module#BusinessProcessesModule',
    data: {
      title: 'Business Processes', // [i18n-tobeinternationalized]
      breadcrumb: 'All Business Processes', // [i18n-tobeinternationalized]
      showLeftNav: true,
      leftNavType: 'BUSINESS_PROCESS',
      aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS,
      showBreadCrumb: true,
      footer: true,
      header: true
    }
  },
  {
    path: 'data-inventory',
    loadChildren: './data-inventory/data-inventory.module#DataInventoryModule',
    data: {
      title: 'Data Inventory', // [i18n-tobeinternationalized]
      breadcrumb: 'Data Inventory', // [i18n-tobeinternationalized]
      showLeftNav: true,
      leftNavType: 'MY_INVENTORY',
      aaaNavLink: AAA_NAV_LINK.DATA_INVENTORY,
      showBreadCrumb: true,
      footer: true,
      header: true
    }
  },
  {
    path: 'settings',
    canActivateChild: [SettingsFeatureGuard],
    loadChildren: './settings/settings.module#SettingsModule',
    data: {
      title: 'Settings', // [i18n-tobeinternationalized]
      breadcrumb: 'Settings', // [i18n-tobeinternationalized]
      showLeftNav: true,
      leftNavType: 'SETTINGS',
      aaaNavLink: AAA_NAV_LINK.SETTINGS,
      showBreadCrumb: true,
      footer: true,
      header: true
    }
  },
  {
    path: 'dashboard',
    redirectTo: 'business-process'
  },
  {
    path: 'registry',
    component: ComponentRegistryComponent,
    data: {
      header: true,
      footer: true,
      breadcrumb: 'Component Registry',
      showBreadCrumb: true,
      showLeftNav: true
    }
  },
  {
    path: 'no-access',
    component: NoAccessComponent,
    data: {
      title: 'Data Inventory', // [i18n-tobeinternationalized]
      breadcrumb: 'No Access', // [i18n-tobeinternationalized]
      showLeftNav: false,
      aaaNavLink: AAA_NAV_LINK.DATA_INVENTORY,
      showBreadCrumb: true,
      footer: true,
      header: true
    }
  },
  { path: '**', redirectTo: 'business-process' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
