import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReviewBusinessProcessesRoutingModule } from './review-business-processes-routing.module';
import { PageHeaderTitleModule } from '../../shared/components/page-header-title/page-header-title.module';
import { SlotModule } from '../../shared/directives/slot/slot.module';
import { PageNavModule } from '../../shared/components/page-nav/page-nav.module';
import { PageFooterModule } from '../../shared/components/page-footer-nav/page-footer-nav.module';
import { DropdownFieldModule } from '../../shared/components/dropdown/dropdown-field.module';
import { CategoricalViewModule } from '../../shared/components/categorical-view/categorical-view.module';
import { ReviewBusinessProcessesComponent } from './review-business-processes.component';
import { ReviewStepContainerComponent } from './review-step-container/review-step-container.component';
import { InfoModalModule } from 'src/app/shared/components/info-modal/info-modal.module';
import { SelectedItemsContainerModule } from '../../shared/components/selected-items-container/selected-items-container.module';
import { TagsSelectorModule } from '../../shared/components/tags-selector/tags-selector.module';
import { ClipboardModule } from 'ngx-clipboard';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaProgressbarModule,
  TaTabsetModule,
  TaDropdownModule,
  TaModalModule,
  TaAccordionModule,
  TaStepsModule
} from '@trustarc/ui-toolkit';
import { ReviewStepContainerService } from './review-step-container/review-step-container.service';
import { StepFinalReviewComponent } from './step-final-review/step-final-review.component';
import { ReviewTableModule } from './step-final-review/review-table/review-table.module';
import { BusinessProcessWizardHeaderModule } from '../business-process-wizard/shared';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from 'src/app/shared/services/auth/auth-interceptor.service';

@NgModule({
  declarations: [
    ReviewBusinessProcessesComponent,
    ReviewStepContainerComponent,
    StepFinalReviewComponent
  ],
  imports: [
    BusinessProcessWizardHeaderModule,
    CategoricalViewModule,
    ClipboardModule,
    CommonModule,
    ReviewBusinessProcessesRoutingModule,
    DropdownFieldModule,
    FormsModule,
    InfoModalModule,
    PageFooterModule,
    PageHeaderTitleModule,
    PageNavModule,
    ReactiveFormsModule,
    SelectedItemsContainerModule,
    SlotModule,
    TagsSelectorModule,
    TaAccordionModule,
    TaButtonsModule,
    TaCheckboxModule,
    TaDropdownModule,
    TaModalModule,
    TaProgressbarModule,
    TaTabsetModule,
    ReviewTableModule,
    TaStepsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    ReviewStepContainerService
  ]
})
export class ReviewBusinessProcessesModule {}
