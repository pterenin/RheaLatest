import { AssessmentsModule } from '../shared/components/assessments/assessments.module';
import { AuditTableModule } from '../shared/components/audit-table/audit-table.module';
import { CategoricalViewModule } from '../shared/components/categorical-view/categorical-view.module';
import { CollaboratorModule } from '../shared/components/collaborator/collaborator.module';
import { CommonModule } from '@angular/common';
import { CompanyAffiliateComponent } from './my-inventory/company-affiliate/company-affiliate.component';
import { CompletionStateService } from '../shared/services/completion-state/completion-state.service';
import { ConfirmDeleteContentModule } from '../shared/components/record-datagrid/confirm-delete-content/confirm-delete-content.module';
import { DatagridHeaderModule } from '../shared/components/record-datagrid/datagrid-header/datagrid-header.module';
import { DataInventoryComponent } from './data-inventory.component';
import { DataInventoryFooterModule } from '../shared/components/data-inventory-footer/data-inventory-footer.module';
import { DataInventoryRoutingModule } from './data-inventory-routing.module';
import { DataInventoryService } from './data-inventory.service';
import { MyInventoryService } from './my-inventory/my-inventory.service';
import { DatatableService } from '../shared/services/record-listing/datatable.service';
import { DetailsFormComponent } from './my-inventory/company-affiliate/details-form/details-form.component';
import { DropdownFieldModule } from '../shared/components/dropdown/dropdown-field.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryTagsComponent } from './my-inventory/inventory-tags/inventory-tags.component';
import { ItSystemComponent } from './my-inventory/it-system/it-system.component';
import { ItSystemDataElementsComponent } from './my-inventory/it-system/it-system-data-elements/it-system-data-elements.component';
// tslint:disable-next-line:max-line-length
import { ItSystemProcessingPurposesComponent } from './my-inventory/it-system/it-system-processing-purposes/it-system-processing-purposes.component';
import { LabelBadgeModule } from '../shared/components/label-badge/label-badge.module';
import { MyInventoryComponent } from './my-inventory/my-inventory.component';
import { NgModule } from '@angular/core';
import { CustomFiltersModule } from 'src/app/shared/components/custom-filters/custom-filters.module';
import { PageHeaderTitleModule } from '../shared/components/page-header-title/page-header-title.module';
import { PageWrapperModule } from '../shared/components/page-wrapper/page-wrapper.module';
import { PrimaryCompanyComponent } from './my-inventory/primary-company/primary-company.component';
import { RecordDatagridModule } from '../shared/components/record-datagrid/record-datagrid.module';
import { TagsSelectorModule } from '../shared/components/tags-selector/tags-selector.module';
import { ThirdPartyComponent } from './my-inventory/third-party/third-party.component';
import { ThirdPartyDetailsFormComponent } from './my-inventory/third-party/details-form/details-form.component';
import { ThirdPartyService } from './my-inventory/third-party/third-party.service';
import { ImportDataModule } from './my-inventory/import-data/import-data.module';
import { DropdownCategoryGroupModule } from '../shared/components/dropdown-category-group/dropdown-category-group.module';
import { MultipleStringPipeModule } from 'src/app/shared/pipes/multiple-string/multiple-string.module';
// tslint:disable-next-line:max-line-length
import { RetentionPeriodComponent } from 'src/app/business-processes/business-process-wizard/shared/components/retention-period/retention-period.component';
import {
  TaAccordionModule,
  TaButtonsModule,
  TaDatepickerModule,
  TaDropdownModule,
  TaPaginationModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaTagsModule,
  TaTableModule,
  TaTabsetModule,
  TaTooltipModule,
  TaCheckboxModule
} from '@trustarc/ui-toolkit';
// tslint:disable-next-line:max-line-length
import { ItSystemDetailsComponent } from './my-inventory/it-system/it-system-details/it-system-details.component';
import { SlotModule } from '../shared/directives/slot/slot.module';
import { PageFooterModule } from '../shared/components/page-footer-nav/page-footer-nav.module';
import { PrimaryCompanyDetailsComponent } from './my-inventory/primary-company/primary-company-details/primary-company-details';
import { ContactModule } from '../shared/components/contact/contact.module';
import { BaseRecordFileUploadModule } from '../shared/components/base-record-file-upload/base-record-file-upload.module';
import { InventoryAttachmentsComponent } from './my-inventory/inventory-attachments/inventory-attachments.component';
import { DropdownCategoryMultipleModule } from '../shared/components/dropdown-category-multiple/dropdown-category-multiple.module';
import { TabsetGuardedModule } from '../shared/components/tabset-guarded/tabset-guarded.module';
import { AsyncCategoricalDropdownModule } from '../shared/components/async-categorical-dropdown/async-categorical-dropdown.module';
import { ExportService } from '../shared/services/export/export.service';
import { InputLocationModule } from '../shared/components/input-location/input-location.module';
import { InputIndividualTypeModule } from './my-inventory/it-system/input-individual-type/input-individual-type.module';
import { AuditAccordionModule } from '../shared/components/audit-accordion/audit-accordion.module';
import { RiskIndicatorModule } from '../shared/components/risk-indicator/risk-indicator.module';
import { TrafficSignalRiskIndicatorModule } from '../shared/components/traffic-risk-indicator/traffic-risk-indicator.module';
// tslint:disable-next-line:max-line-length
import { ItSystemEditLocationConfirmDialogModule } from './my-inventory/it-system/it-system-edit-location-confirm-dialog/it-system-edit-location-confirm-dialog.module';
import { ViewRowsDropdownModule } from '../shared/components/record-datagrid/datagrid-header/view-rows-dropdown/view-rows-dropdown.module';
import { RiskFieldIndicatorModule } from '../shared/components/risk-field-indicator/risk-field-indicator.module';
import { CloneRecordInventoryModalComponent } from './my-inventory/clone-record-modal/clone-record-inventory-modal.component';
import { TaModalModule } from '@trustarc/ui-toolkit';
import { CategoryHasSearchResultPipeModule } from '../shared/pipes/category-has-search-result/category-has-search-result.module';
// tslint:disable-next-line:max-line-length
import { ItSystemEditSubjectConfirmDialogModule } from './my-inventory/it-system/it-system-edit-subject-confirm-dialog/it-system-edit-subject-confirm-dialog.module';
import { InventoryInlineContactsComponent } from './my-inventory/inventory-inline-contacts/inventory-inline-contacts.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { HeadquartersFormModule } from 'src/app/shared/components/headquarters-form/headquarters-form.module';

@NgModule({
  entryComponents: [CloneRecordInventoryModalComponent],
  declarations: [
    CloneRecordInventoryModalComponent,
    CompanyAffiliateComponent,
    DataInventoryComponent,
    DetailsFormComponent,
    InventoryAttachmentsComponent,
    InventoryTagsComponent,
    ItSystemComponent,
    ItSystemDataElementsComponent,
    ItSystemDetailsComponent,
    ItSystemProcessingPurposesComponent,
    MyInventoryComponent,
    PrimaryCompanyComponent,
    PrimaryCompanyDetailsComponent,
    ThirdPartyComponent,
    ThirdPartyDetailsFormComponent,
    InventoryInlineContactsComponent,
    RetentionPeriodComponent
  ],

  imports: [
    CategoryHasSearchResultPipeModule,
    ItSystemEditLocationConfirmDialogModule,
    ItSystemEditSubjectConfirmDialogModule,
    AsyncCategoricalDropdownModule,
    NgxSkeletonLoaderModule,
    AssessmentsModule,
    AuditTableModule,
    BaseRecordFileUploadModule,
    CategoricalViewModule,
    CollaboratorModule,
    CommonModule,
    ContactModule,
    ConfirmDeleteContentModule,
    CustomFiltersModule,
    DatagridHeaderModule,
    DataInventoryFooterModule,
    DataInventoryRoutingModule,
    DropdownCategoryMultipleModule,
    DropdownFieldModule,
    InputLocationModule,
    FormsModule,
    ImportDataModule,
    InputIndividualTypeModule,
    LabelBadgeModule,
    MultipleStringPipeModule,
    PageFooterModule,
    PageHeaderTitleModule,
    PageWrapperModule,
    ReactiveFormsModule,
    RecordDatagridModule,
    SlotModule,
    TaButtonsModule,
    TaDropdownModule,
    TabsetGuardedModule,
    TagsSelectorModule,
    TaPaginationModule,
    TaPopoverModule,
    TaSvgIconModule,
    TaTableModule,
    TaModalModule,
    TaTagsModule,
    TaTabsetModule,
    TaTooltipModule,
    TaDatepickerModule,
    TaAccordionModule,
    TaSvgIconModule,
    AuditAccordionModule,
    RiskIndicatorModule,
    ViewRowsDropdownModule,
    TrafficSignalRiskIndicatorModule,
    RiskFieldIndicatorModule,
    TaCheckboxModule,
    DropdownCategoryGroupModule,
    HeadquartersFormModule
  ],
  exports: [
    ItSystemComponent,
    ItSystemDetailsComponent,
    ItSystemDataElementsComponent,
    ItSystemProcessingPurposesComponent,
    ThirdPartyDetailsFormComponent,
    DetailsFormComponent,
    InventoryAttachmentsComponent,
    InventoryTagsComponent,
    RetentionPeriodComponent
  ],
  providers: [
    CompanyAffiliateComponent,
    CompletionStateService,
    DataInventoryService,
    MyInventoryService,
    DatatableService,
    FormBuilder,
    ItSystemComponent,
    PrimaryCompanyComponent,
    ThirdPartyComponent,
    ThirdPartyService,
    ExportService
  ]
})
export class DataInventoryModule {}
