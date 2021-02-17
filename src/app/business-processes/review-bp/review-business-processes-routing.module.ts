import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewBusinessProcessesComponent } from './review-business-processes.component';

import { StepFinalReviewComponent } from './step-final-review/step-final-review.component';
import { AAA_NAV_LINK } from 'src/app/shared/components/header/header-aaa.constant';

export const routes: Routes = [
  {
    path: '',
    component: ReviewBusinessProcessesComponent,
    children: [
      {
        path: 'review',
        component: StepFinalReviewComponent,
        canDeactivate: [StepFinalReviewComponent],
        data: {
          title: 'Review', // [i18n-tobeinternationalized]
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
  providers: [ReviewBusinessProcessesComponent, StepFinalReviewComponent]
})
export class ReviewBusinessProcessesRoutingModule {}
