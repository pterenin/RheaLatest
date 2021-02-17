import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessProcessWizardComponent } from './business-process-wizard.component';
import { SystemsSelectionComponent } from './systems-selection/systems-selection.component';
import { BuildDataFlowNewUiComponent } from './build-data-flow/build-data-flow.component';

import { DetailsComponent } from './details/details.component';
import { AAA_NAV_LINK } from 'src/app/shared/components/header/header-aaa.constant';
import { SecurityRisksComponent } from './security-risks/security-risks.component';
import { ReviewComponent } from './review/review.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessProcessWizardComponent,
    children: [
      {
        path: 'details',
        component: DetailsComponent,
        data: {
          title: 'Details',
          header: false,
          showBreadCrumb: false
        }
      },
      {
        path: 'systems-selection',
        component: SystemsSelectionComponent,
        data: {
          title: 'Systems Selection',
          header: false,
          showBreadCrumb: false,
          aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS
        }
      },
      {
        path: 'security-and-risks',
        component: SecurityRisksComponent,
        data: {
          title: 'Security and Risk',
          header: false,
          showBreadCrumb: false,
          checkReIndex: true,
          aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS
        }
      },
      {
        path: 'review-bp',
        component: ReviewComponent,
        data: {
          title: 'Review',
          header: false,
          showBreadCrumb: false
        }
      },
      {
        path: 'build-data-flow',
        component: BuildDataFlowNewUiComponent,
        data: {
          title: 'Build Data Flow',
          header: false,
          showBreadCrumb: false,
          aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessProcessWizardRoutingModule {}
