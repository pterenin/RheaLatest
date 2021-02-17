import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RecordDatagridComponent } from './record-datagrid.component';
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
import { DatagridHeaderModule } from './datagrid-header/datagrid-header.module';
import { DatagridHeaderService } from '../../services/record-listing/datagrid-header.service';
import { DatagridFooterModule } from './datagrid-footer/datagrid-footer.module';
import { DatagridAddBpButtonModule } from './datagrid-header/datagrid-add-bp-button/datagrid-add-bp-button.module';
import { DatagridEditButtonModule } from './datagrid-header/datagrid-edit-button/datagrid-edit-button.module';
import { DatagridDeleteButtonModule } from './datagrid-header/datagrid-delete-button/datagrid-delete-button.module';
import { ViewRowsDropdownModule } from './datagrid-header/view-rows-dropdown/view-rows-dropdown.module';
import { RiskIndicatorModule } from '../risk-indicator/risk-indicator.module';
import { TrafficSignalRiskIndicatorModule } from '../traffic-risk-indicator/traffic-risk-indicator.module';
import { CustomFiltersModule } from 'src/app/shared/components/custom-filters/custom-filters.module';
import { CloneRecordModalComponent } from './clone-record-modal/clone-record-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalsModule } from 'src/app/business-processes/business-process-wizard/shared/components/modals/modals.module';
import { ReplacePipeModule } from '../../pipes/replace/replace.module';
import { InlineTagEditorModule } from 'src/app/shared/components/inline-tag-editor/inline-tag-editor.module';
import { TagsSelectorService } from 'src/app/shared/components/tags-selector/tags-selector.service';
import { InlineOwnerEditorModule } from '../inline-owner-editor/inline-owner-editor.module';
import { ModalReportDownloadComponent } from '../modals/modal-report-download/modal-report-download.component';

@NgModule({
  declarations: [
    RecordDatagridComponent,
    CloneRecordModalComponent,
    ModalReportDownloadComponent
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    InlineOwnerEditorModule,
    InlineTagEditorModule,
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
    TaDatepickerModule
  ],
  entryComponents: [CloneRecordModalComponent, ModalReportDownloadComponent],
  exports: [RecordDatagridComponent],
  providers: [DatagridHeaderService, TagsSelectorService]
})
export class RecordDatagridModule {}
