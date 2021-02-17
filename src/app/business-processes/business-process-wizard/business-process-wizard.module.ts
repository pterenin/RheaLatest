import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import {
  TaStepsModule,
  TaButtonsModule,
  TaSvgIconModule,
  TaAccordionModule,
  TaTooltipModule,
  TaPopoverModule,
  TaTabsetModule,
  TaTableModule,
  TaDropdownModule,
  TaModalModule,
  TaCheckboxModule,
  TaBadgeModule,
  TaTagsModule,
  TaPaginationModule,
  TaToggleSwitchModule,
  TaCollapseModule
} from '@trustarc/ui-toolkit';
import { DropdownFieldModule } from '../../shared/components/dropdown/dropdown-field.module';

import { BusinessProcessWizardRoutingModule } from './business-process-wizard-routing.module';
import { BusinessProcessWizardComponent } from './business-process-wizard.component';
import { SystemsSelectionComponent } from './systems-selection/systems-selection.component';
import { BuildDataFlowNewUiComponent } from './build-data-flow/build-data-flow.component';

import {
  BusinessProcessWizardHeaderModule,
  BusinessProcessWizardFooterComponent,
  SystemRecordFilterComponent,
  SystemRecordTabProcessingPurposeComponent,
  SystemRecordTabDataElementComponent,
  SystemRecordTabDataSubjectComponent,
  SystemRecordTabHostingLocationsComponent,
  SystemRecordNoneComponent,
  SystemRecordInfoComponent,
  SystemRecordItemComponent,
  SystemRecordItemListComponent,
  SelectedSystemRecordFilterComponent,
  AddEditOwningOrganizationContactsModalComponent,
  OwingOrganizationsContactsComponent,
  PopoverFilterWrapperComponent,
  PopoverFilterBodyComponent,
  PopoverFilterBodySimpleListComponent
} from './shared';

import { RecordIconModule } from 'src/app/shared/_components/record-icon/record-icon.module';
import { ItemButtonModule } from '../../shared/_components/item-button/item-button.module';
import { LocationModalContentModule } from 'src/app/shared/components/location-modal-content/location-modal-content.module';
import { SearchFieldModule } from 'src/app/shared/_components/search-field/search-field.module';
import { RouterModule } from '@angular/router';
import { ModalsModule } from './shared/components/modals/modals.module';
import { ReplacePipeModule } from 'src/app/shared/pipes/replace/replace.module';
import { CollectionPipeModule } from '../../shared/pipes/collection/collection.module';
import { ArrayPipeModule } from '../../shared/pipes/array/array.module';
import { LocationPipeModule } from '../../shared/pipes/location/location.module';
import { DataFlowPipeModule } from '../../shared/pipes/data-flow/data-flow.module';
import { DataSubjectPipeModule } from '../../shared/pipes/data-subject/data-subject.module';
import { DataElementPipeModule } from '../../shared/pipes/data-element/data-element.module';
import { ProcessingPurposePipeModule } from '../../shared/pipes/processing-purpose/processing-purpose.module';
import { SearchByPipeModule } from 'src/app/shared/_pipes/search-by/search-by.module';
import { FilterByArrayPipeModule } from 'src/app/shared/_pipes/filter-by-array-pipe/filter-by-array-pipe.module';
// tslint:disable-next-line:max-line-length
import { CategoryFormSearchFilterPipeModule } from '../../shared/_pipes/category-form-search-filter/category-form-search-filter.pipe.module';
import { TableSearchFilterPipeModule } from '../../shared/_pipes/table-search-filter/table-search-filter.pipe.module';
import { TabsetGuardedModule } from '../../shared/components/tabset-guarded/tabset-guarded.module';
import { DataInventoryModule } from '../../data-inventory/data-inventory.module';
import { RiskFieldIndicatorModule } from '../../shared/components/risk-field-indicator/risk-field-indicator.module';
import { CustomIconMaximizeComponent } from './shared/components/custom-icon-maximize/custom-icon-maximize.component';
import { CustomIconMinimizeComponent } from './shared/components/custom-icon-minimize/custom-icon-minimize.component';
import { AuthInterceptorService } from '../../shared/services/auth/auth-interceptor.service';
import { SystemRecordAddComponent } from './shared/components/system-record-add/system-record-add.component';
// tslint:disable-next-line:max-line-length
import { SystemRecordAddThirdPartyComponent } from './shared/components/system-record-add-third-party/system-record-add-third-party.component';
// tslint:disable-next-line:max-line-length
import { SystemRecordAddCompanyAffiliateComponent } from './shared/components/system-record-add-company-affiliate/system-record-add-company-affiliate.component';
import { DetailsComponent } from './details/details.component';
import { BusinessProcessDetailComponent } from './shared/components/business-process-detail/business-process-detail.component';
import { BaseRecordFileUploadModule } from 'src/app/shared/components/base-record-file-upload/base-record-file-upload.module';
import { TagsSelectorModule } from 'src/app/shared/components/tags-selector/tags-selector.module';
import { SecurityRisksComponent } from './security-risks/security-risks.component';
import { DataInventoryCardComponent } from './shared/components/data-inventory-card/data-inventory-card.component';
import { DataInventoryCardAddComponent } from './shared/components/data-inventory-card-add/data-inventory-card-add.component';
import { DataInventoryCardFilterComponent } from './shared/components/data-inventory-card-filter/data-inventory-card-filter.component';
import { ReviewComponent } from './review/review.component';
import { PaginatePipeModule } from '../../shared/pipes/paginate/paginate.module';
import { SearchFilterPipeModule } from '../../shared/pipes/filter/search-filter.module';
import { DataFlowSideBarComponent } from './build-data-flow/data-flow-side-bar/data-flow-side-bar.component';
import { DataFlowSearchComponent } from './build-data-flow/data-flow-side-bar/data-flow-search/data-flow-search.component';
import { DataFlowFiltersComponent } from './build-data-flow/data-flow-side-bar/data-flow-filters/data-flow-filters.component';
import { DataFlowExpandViewComponent } from './build-data-flow/data-flow-side-bar/data-flow-expand-view/data-flow-expand-view.component';
import { DataFlowCollapseComponent } from './build-data-flow/data-flow-side-bar/data-flow-collapse-view/data-flow-collapse-view.component';
import { SystemTransfersComponent } from './build-data-flow/system-transfers/system-transfers.component';
import { SystemTransfersTableComponent } from './build-data-flow/system-transfers-table/system-transfers-table.component';
import { RheaUiLibraryModule } from 'projects/rhea-ui-library/src/public-api';
import { SystemRecordTabTableComponent } from './shared/components/system-record-tab-table/system-record-tab-table.component';
// tslint:disable-next-line:max-line-length
import { DataInventoryCardTableBodyComponent } from 'src/app/business-processes/business-process-wizard/shared/components/data-inventory-card-table-body/data-inventory-card-table-body.component';

// tslint:disable-next-line: max-line-length
import { DataFlowChartModalDetailsComponent } from './build-data-flow/data-flow-chart-modal-details/data-flow-chart-modal-details.component';
// tslint:disable-next-line:max-line-length
import { DataFlowEmptyStateComponent } from 'src/app/business-processes/business-process-wizard/build-data-flow/data-flow-empty-state/data-flow-empty-state.component';
import { MapPipeModule } from 'src/app/shared/pipes/map/map.module';
import { HeadquartersFormModule } from 'src/app/shared/components/headquarters-form/headquarters-form.module';
import { NoMappedSystemsStateComponent } from './build-data-flow/no-mapped-systems-state/no-mapped-systems-state.component';

@NgModule({
  declarations: [
    AddEditOwningOrganizationContactsModalComponent,
    BusinessProcessWizardComponent,
    BuildDataFlowNewUiComponent,
    BusinessProcessWizardFooterComponent,
    BusinessProcessDetailComponent,
    CustomIconMaximizeComponent,
    CustomIconMinimizeComponent,
    DetailsComponent,
    DataInventoryCardComponent,
    DataInventoryCardAddComponent,
    DataInventoryCardFilterComponent,
    OwingOrganizationsContactsComponent,
    ReviewComponent,
    SystemRecordFilterComponent,
    SystemRecordNoneComponent,
    SystemRecordInfoComponent,
    SystemRecordItemComponent,
    SystemRecordItemListComponent,
    SystemRecordAddComponent,
    SystemRecordAddThirdPartyComponent,
    SystemRecordAddCompanyAffiliateComponent,
    SystemRecordTabProcessingPurposeComponent,
    SystemRecordTabDataElementComponent,
    SystemRecordTabDataSubjectComponent,
    SystemRecordTabHostingLocationsComponent,
    PopoverFilterWrapperComponent,
    PopoverFilterBodyComponent,
    PopoverFilterBodySimpleListComponent,
    SelectedSystemRecordFilterComponent,
    SystemsSelectionComponent,
    SecurityRisksComponent,
    DataFlowSideBarComponent,
    DataFlowSearchComponent,
    DataFlowFiltersComponent,
    DataFlowExpandViewComponent,
    DataFlowCollapseComponent,
    DataFlowEmptyStateComponent,
    SystemTransfersComponent,
    SystemTransfersTableComponent,
    DataFlowChartModalDetailsComponent,
    SystemRecordTabTableComponent,
    DataInventoryCardTableBodyComponent,
    NoMappedSystemsStateComponent
  ],
  imports: [
    BusinessProcessWizardHeaderModule,
    HttpClientModule,
    CommonModule,
    TaStepsModule,
    TaButtonsModule,
    TaAccordionModule,
    TaTooltipModule,
    TaPopoverModule,
    TaSvgIconModule,
    TaTabsetModule,
    TaTableModule,
    TaDropdownModule,
    TaModalModule,
    TaCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    RecordIconModule,
    ItemButtonModule,
    BusinessProcessWizardRoutingModule,
    HeadquartersFormModule,
    SearchFieldModule,
    LocationModalContentModule,
    RouterModule,
    ModalsModule,
    ReplacePipeModule,
    CollectionPipeModule,
    ArrayPipeModule,
    MapPipeModule,
    LocationPipeModule,
    DataFlowPipeModule,
    DataSubjectPipeModule,
    DataElementPipeModule,
    ProcessingPurposePipeModule,
    SearchByPipeModule,
    FilterByArrayPipeModule,
    CategoryFormSearchFilterPipeModule,
    TableSearchFilterPipeModule,
    TabsetGuardedModule,
    DataInventoryModule,
    RiskFieldIndicatorModule,
    DropdownFieldModule,
    NgxSkeletonLoaderModule,
    BaseRecordFileUploadModule,
    TaBadgeModule,
    TagsSelectorModule,
    TaTagsModule,
    TaPaginationModule,
    TaToggleSwitchModule,
    PaginatePipeModule,
    SearchFilterPipeModule,
    RheaUiLibraryModule,
    TaCollapseModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
})
export class BusinessProcessWizardModule {}
