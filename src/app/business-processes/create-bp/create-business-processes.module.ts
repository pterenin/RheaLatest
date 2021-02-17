import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CreateBusinessProcessesRoutingModule } from './create-business-processes-routing.module';
import { PageHeaderTitleModule } from '../../shared/components/page-header-title/page-header-title.module';
import { SlotModule } from '../../shared/directives/slot/slot.module';
import { PageNavModule } from '../../shared/components/page-nav/page-nav.module';
import { PageFooterModule } from '../../shared/components/page-footer-nav/page-footer-nav.module';
import { DropdownFieldModule } from '../../shared/components/dropdown/dropdown-field.module';
import { CategoricalViewModule } from '../../shared/components/categorical-view/categorical-view.module';
import { CreateBusinessProcessesComponent } from './create-business-processes.component';
import { StepContainerComponent } from './step-container/step-container.component';
import { Step1Service } from './step-1/step-1.service';
import { Step2Service } from './step-2/step-2.service';
import { Step1Component } from './step-1/step-1.component';
import { Step2Component } from './step-2/step-2.component';
import { Step3Component } from './step-3/step-3.component';
import { Step4Component } from './step-4/step-4.component';
import { BuildDataFlowComponent } from './build-data-flow/build-data-flow.component';
import { FinishSetStatusModule } from './finish-set-status/finish-set-status.module';
import { AddItSystemModule } from './step-4/add-it-system/add-it-system.module';
import { InfoModalModule } from 'src/app/shared/components/info-modal/info-modal.module';
import { SelectedItemsContainerModule } from '../../shared/components/selected-items-container/selected-items-container.module';
import { TagsSelectorModule } from '../../shared/components/tags-selector/tags-selector.module';

import {
  TaActiveModal,
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaModalModule,
  TaProgressbarModule,
  TaSvgIconModule,
  TaTabsetModule,
  TaPopoverModule,
  TaToggleSwitchModule,
  TaTooltipModule,
  TaStepsModule,
  TaBadgeModule,
  TaTagsModule
} from '@trustarc/ui-toolkit';
import { HighchartsContainerModule } from '../../shared/components/highcharts-container/highcharts-container.module';

import { LabelBadgeModule } from '../../shared/components/label-badge/label-badge.module';
import { LocationModule } from 'src/app/shared/components/location/location.module';
import { Step6Component } from './step-6/step-6.component';
import { ContactModule } from 'src/app/shared/components/contact/contact.module';
import { BaseRecordFileUploadModule } from 'src/app/shared/components/base-record-file-upload/base-record-file-upload.module';
import { Step4ItemsModule } from 'src/app/shared/components/step-4-selected-items-container/step-4-selected-items-container.module';
import { ReplacePipeModule } from 'src/app/shared/pipes/replace/replace.module';
import { DebounceClickDirective } from 'src/app/shared/directives/debounce-click/debounce-click.directive';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';
import { DataFlowDropdownComponent } from './build-data-flow/data-flow-dropdown/data-flow-dropdown.component';
import { DataFlowSelectedItemsComponent } from './build-data-flow/data-flow-selected-items/data-flow-selected-items.component';
import { DataFlowDropdownLabelComponent } from './build-data-flow/data-flow-dropdown-label/data-flow-dropdown-label.component';
import { LocationTooltipModule } from 'src/app/shared/components/location-tooltip/location-tooltip.module';
import { DataFlowPopoverComponent } from './build-data-flow/data-flow-popover/data-flow-popover.component';
import { BusinessProcessWizardHeaderModule } from '../business-process-wizard/shared';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from 'src/app/shared/services/auth/auth-interceptor.service';

@NgModule({
  entryComponents: [],
  declarations: [
    CreateBusinessProcessesComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    BuildDataFlowComponent,
    Step6Component,
    StepContainerComponent,
    DebounceClickDirective,
    DataFlowDropdownComponent,
    DataFlowSelectedItemsComponent,
    DataFlowDropdownLabelComponent,
    DataFlowPopoverComponent
  ],
  imports: [
    BusinessProcessWizardHeaderModule,
    AddItSystemModule,
    BaseRecordFileUploadModule,
    CategoricalViewModule,
    CommonModule,
    CreateBusinessProcessesRoutingModule,
    DropdownFieldModule,
    FinishSetStatusModule,
    FormsModule,
    HighchartsContainerModule,
    InfoModalModule,
    LabelBadgeModule,
    LocationTooltipModule,
    LocationModule,
    PageFooterModule,
    PageHeaderTitleModule,
    PageNavModule,
    ReactiveFormsModule,
    ReplacePipeModule,
    SelectedItemsContainerModule,
    Step4ItemsModule,
    SlotModule,
    TagsSelectorModule,
    TaButtonsModule,
    TaCheckboxModule,
    TaDropdownModule,
    TaModalModule,
    TaPopoverModule,
    TaProgressbarModule,
    TaBadgeModule,
    TaSvgIconModule,
    TaTabsetModule,
    TaTooltipModule,
    TaToggleSwitchModule,
    ContactModule,
    RiskFieldIndicatorModule,
    TaStepsModule,
    TaTagsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    Step1Service,
    Step2Service,
    TaActiveModal
  ]
})
export class CreateBusinessProcessesModule {}
