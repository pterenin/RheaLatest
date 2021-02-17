import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessProcessesComponent } from './business-processes.component';
import { AllBusinessProcessesComponent } from './all-bp/all-business-processes.component';
import { ViewBpComponent } from './view-bp/view-bp.component';
import { AAA_NAV_LINK } from '../shared/components/header/header-aaa.constant';

export const routes: Routes = [
  {
    path: '',
    component: AllBusinessProcessesComponent,
    data: {
      title: 'All Business Processes', // [i18n-tobeinternationalized]
      showLeftNav: true,
      aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS,
      footer: true,
      header: true,
      headerWhite: true,
      headerTitle: true
    }
  },
  {
    path: ':id/view-bp',
    component: ViewBpComponent,
    data: {
      title: 'View Business Process', // [i18n-tobeinternationalized]
      breadcrumb: '',
      showLeftNav: true,
      aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS,
      showBreadCrumb: true,
      footer: true,
      header: true,
      leftNavType: 'BUSINESS_PROCESS'
    }
  },
  {
    path: ':id',
    component: BusinessProcessesComponent,
    children: [
      {
        path: '',
        redirectTo: 'background',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren:
          './create-bp/create-business-processes.module#CreateBusinessProcessesModule',
        data: {
          title: 'Create Business Processes', // [i18n-tobeinternationalized]
          breadcrumb: 'Create', // [i18n-tobeinternationalized]
          showLeftNav: false,
          aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS,
          footer: false,
          header: false
        }
      },
      {
        path: '',
        loadChildren:
          './review-bp/review-business-processes.module#ReviewBusinessProcessesModule',
        data: {
          title: 'Review Business Processes', // [i18n-tobeinternationalized]
          breadcrumb: 'Review', // [i18n-tobeinternationalized]
          showLeftNav: false,
          aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS,
          footer: false,
          header: false
        }
      },
      {
        path: '',
        loadChildren:
          './business-process-wizard/business-process-wizard.module#BusinessProcessWizardModule',
        data: {
          title: 'Business Processes Wizard', // [i18n-tobeinternationalized]
          breadcrumb: 'Create', // [i18n-tobeinternationalized]
          aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS,
          footer: false,
          header: false
        }
      },
      {
        path: '**',
        redirectTo: 'background',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessProcessesRoutingModule {}
