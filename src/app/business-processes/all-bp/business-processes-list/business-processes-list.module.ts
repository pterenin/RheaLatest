import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDatagridModule,
  TaDatepickerModule,
  TaDropdownModule,
  TaModalModule,
  TaPaginationModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaTableModule,
  TaTagsModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
// tslint:disable-next-line:max-line-length
import { BusinessProcessesListComponent } from 'src/app/business-processes/all-bp/business-processes-list/business-processes-list.component';
import { CloneRecordModalComponent } from 'src/app/shared/components/record-datagrid/clone-record-modal/clone-record-modal.component';
import { ModalReportDownloadComponent } from 'src/app/shared/components/modals/modal-report-download/modal-report-download.component';
import { InlineOwnerEditorModule } from 'src/app/shared/components/inline-owner-editor/inline-owner-editor.module';
import { InlineTagEditorModule } from 'src/app/shared/components/inline-tag-editor/inline-tag-editor.module';
import { InlineBpNameEditorModule } from 'src/app/shared/components/inline-bp-name-editor/inline-bp-name-editor.module';
import { CustomFiltersModule } from 'src/app/shared/components/custom-filters/custom-filters.module';
// tslint:disable-next-line:max-line-length
import { DatagridAddBpButtonModule } from 'src/app/shared/components/record-datagrid/datagrid-header/datagrid-add-bp-button/datagrid-add-bp-button.module';
// tslint:disable-next-line:max-line-length
import { DatagridEditButtonModule } from 'src/app/shared/components/record-datagrid/datagrid-header/datagrid-edit-button/datagrid-edit-button.module';
// tslint:disable-next-line:max-line-length
import { DatagridDeleteButtonModule } from 'src/app/shared/components/record-datagrid/datagrid-header/datagrid-delete-button/datagrid-delete-button.module';
import { DatagridHeaderService } from 'src/app/shared/services/record-listing/datagrid-header.service';
import { TagsSelectorService } from 'src/app/shared/components/tags-selector/tags-selector.service';
import { ReplacePipeModule } from 'src/app/shared/pipes/replace/replace.module';
import { ModalsModule } from 'src/app/business-processes/business-process-wizard/shared/components/modals/modals.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrafficSignalRiskIndicatorModule } from 'src/app/shared/components/traffic-risk-indicator/traffic-risk-indicator.module';
import { RiskIndicatorModule } from 'src/app/shared/components/risk-indicator/risk-indicator.module';
import { DatagridFooterModule } from 'src/app/shared/components/record-datagrid/datagrid-footer/datagrid-footer.module';
import { DatagridHeaderModule } from 'src/app/shared/components/record-datagrid/datagrid-header/datagrid-header.module';
// tslint:disable-next-line:max-line-length
import { ViewRowsDropdownModule } from 'src/app/shared/components/record-datagrid/datagrid-header/view-rows-dropdown/view-rows-dropdown.module';
import { OwnerPipeModule } from 'src/app/shared/pipes/owner/owner.module';
import { StatusThemePipeModule } from 'src/app/shared/pipes/status/status.module';
import { CapitalizeCasePipeModule } from 'src/app/shared/pipes/string/string.module';

@NgModule({
  declarations: [BusinessProcessesListComponent],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    InlineOwnerEditorModule,
    InlineTagEditorModule,
    InlineBpNameEditorModule,
    TaButtonsModule,
    TaDatagridModule,
    CustomFiltersModule,
    DatagridAddBpButtonModule,
    DatagridEditButtonModule,
    DatagridDeleteButtonModule,
    TaDropdownModule,
    TaModalModule,
    TaTableModule,
    TaPaginationModule,
    TaPopoverModule,
    TaTagsModule,
    TaSvgIconModule,
    ViewRowsDropdownModule,
    DatagridHeaderModule,
    DatagridFooterModule,
    RiskIndicatorModule,
    TrafficSignalRiskIndicatorModule,
    TaTooltipModule,
    TaCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    ModalsModule,
    ReplacePipeModule,
    TaDatepickerModule,
    OwnerPipeModule,
    StatusThemePipeModule,
    CapitalizeCasePipeModule
  ],
  entryComponents: [CloneRecordModalComponent, ModalReportDownloadComponent],
  exports: [BusinessProcessesListComponent],
  providers: [DatagridHeaderService, TagsSelectorService]
})
export class BusinessProcessesListModule {}
