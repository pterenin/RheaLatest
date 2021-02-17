import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessProcessesRoutingModule } from './business-processes-routing.module';
import { BusinessProcessesComponent } from './business-processes.component';
import { AllBusinessProcessesComponent } from './all-bp/all-business-processes.component';
import { RecordDatagridModule } from '../shared/components/record-datagrid/record-datagrid.module';
import { PageWrapperModule } from '../shared/components/page-wrapper/page-wrapper.module';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaPaginationModule,
  TaAccordionModule,
  TaTableModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaTagsModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { TranslateModule } from '@ngx-translate/core';
import { DatagridHeaderModule } from '../shared/components/record-datagrid/datagrid-header/datagrid-header.module';
import { ViewBpComponent } from './view-bp/view-bp.component';
import { AuditTableModule } from '../shared/components/audit-table/audit-table.module';
import { AssessmentsModule } from '../shared/components/assessments/assessments.module';
import { DataInventoryService } from '../data-inventory/data-inventory.service';
import { AuditAccordionModule } from '../shared/components/audit-accordion/audit-accordion.module';
import { RiskFieldIndicatorModule } from '../shared/components/risk-field-indicator/risk-field-indicator.module';
// tslint:disable-next-line:max-line-length
import { BusinessProcessesListComponent } from 'src/app/business-processes/all-bp/business-processes-list/business-processes-list.component';
import { TrafficSignalRiskIndicatorModule } from 'src/app/shared/components/traffic-risk-indicator/traffic-risk-indicator.module';
import { RiskIndicatorModule } from 'src/app/shared/components/risk-indicator/risk-indicator.module';
import { InlineOwnerEditorModule } from 'src/app/shared/components/inline-owner-editor/inline-owner-editor.module';
import { InlineBpNameEditorModule } from 'src/app/shared/components/inline-bp-name-editor/inline-bp-name-editor.module';
import { OwnerPipeModule } from 'src/app/shared/pipes/owner/owner.module';
import { CapitalizeCasePipeModule } from 'src/app/shared/pipes/string/string.module';
import { StatusThemePipeModule } from 'src/app/shared/pipes/status/status.module';
import { ReactiveFormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { DatagridAddBpButtonModule } from 'src/app/shared/components/record-datagrid/datagrid-header/datagrid-add-bp-button/datagrid-add-bp-button.module';
import { CustomFiltersModule } from 'src/app/shared/components/custom-filters/custom-filters.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InlineTagEditorModule } from 'src/app/shared/components/inline-tag-editor/inline-tag-editor.module';
import { ReplacePipeModule } from 'src/app/shared/pipes/replace/replace.module';
import { BusinessProcessesListModule } from 'src/app/business-processes/all-bp/business-processes-list/business-processes-list.module';

@NgModule({
  declarations: [
    BusinessProcessesComponent,
    AllBusinessProcessesComponent,
    ViewBpComponent
  ],
  imports: [
    AuditTableModule,
    AssessmentsModule,
    BusinessProcessesRoutingModule,
    CommonModule,
    PageWrapperModule,
    TaAccordionModule,
    TaButtonsModule,
    TaCheckboxModule,
    TranslateModule,
    RecordDatagridModule,
    BusinessProcessesListModule,
    TaDropdownModule,
    DatagridHeaderModule,
    TaPaginationModule,
    AuditAccordionModule,
    RiskFieldIndicatorModule,
    TaTableModule,
    TrafficSignalRiskIndicatorModule,
    RiskIndicatorModule,
    TaPopoverModule,
    InlineOwnerEditorModule,
    InlineBpNameEditorModule,
    OwnerPipeModule,
    TaSvgIconModule,
    TaTagsModule,
    CapitalizeCasePipeModule,
    StatusThemePipeModule,
    ReactiveFormsModule,
    DatagridAddBpButtonModule,
    TaTooltipModule,
    CustomFiltersModule,
    NgxSkeletonLoaderModule,
    InlineTagEditorModule,
    ReplacePipeModule
  ],
  providers: [DataInventoryService]
})
export class BusinessProcessesModule {}
