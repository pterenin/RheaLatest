import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateBusinessProcessesComponent } from './create-business-processes.component';
import { Step1Component } from './step-1/step-1.component';
import { Step2Component } from './step-2/step-2.component';
import { Step3Component } from './step-3/step-3.component';
import { Step4Component } from './step-4/step-4.component';
import { BuildDataFlowComponent } from './build-data-flow/build-data-flow.component';

import { StepContainerService } from './step-container/step-container.service';
import { Step6Component } from './step-6/step-6.component';
import { AAA_NAV_LINK } from 'src/app/shared/components/header/header-aaa.constant';

export const routes: Routes = [
  {
    path: '',
    component: CreateBusinessProcessesComponent,
    children: [
      {
        path: 'background',
        component: Step1Component,
        canDeactivate: [Step1Component],
        data: {
          title: 'Background', // [i18n-tobeinternationalized]
          header: true,
          aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS
        }
      },
      {
        path: 'owner',
        component: Step2Component,
        canDeactivate: [Step2Component],
        data: {
          title: 'Owners', // [i18n-tobeinternationalized]
          header: true,
          aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS
        }
      },
      {
        path: 'subjects',
        component: Step3Component,
        canDeactivate: [Step3Component],
        data: {
          title: 'Subjects', // [i18n-tobeinternationalized]
          header: true,
          aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS
        }
      },
      {
        path: 'it-systems',
        component: Step4Component,
        data: {
          title: 'Systems', // [i18n-tobeinternationalized]
          header: true,
          aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS
        }
      },
      {
        path: 'data-flow',
        component: BuildDataFlowComponent,
        data: {
          title: 'Data Flow', // [i18n-tobeinternationalized]
          header: true,
          aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS
        }
      },
      {
        path: 'security-and-risk',
        component: Step6Component,
        canDeactivate: [Step6Component],
        data: {
          title: 'Security & Risk', // [i18n-tobeinternationalized]
          header: true,
          aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    Step1Component,
    Step2Component,
    Step3Component,
    BuildDataFlowComponent,
    Step6Component,
    StepContainerService
  ]
})
export class CreateBusinessProcessesRoutingModule {}
