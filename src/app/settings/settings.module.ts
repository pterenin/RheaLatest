import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { RecordDatagridModule } from '../shared/components/record-datagrid/record-datagrid.module';
import { PageWrapperModule } from '../shared/components/page-wrapper/page-wrapper.module';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaPaginationModule,
} from '@trustarc/ui-toolkit';
import { TranslateModule } from '@ngx-translate/core';
import { DatagridHeaderModule } from '../shared/components/record-datagrid/datagrid-header/datagrid-header.module';
import { CategoricalManagementModule } from '../shared/components/categorical-management/categorical-management.module';
import { AddDropdownModule } from '../shared/components/add-dropdown/add-dropdown.module';
import { CustomCategoryModalModule } from '../shared/components/custom-category-modal/custom-category-modal.module';
// tslint:disable-next-line:max-line-length
import { CustomDataElementModalModule } from '../shared/components/custom-data-element-modal/custom-data-element-modal.module';
// tslint:disable-next-line:max-line-length
import { CustomProcessingPurposeModalModule } from '../shared/components/custom-processing-purpose-modal/custom-processing-purpose-modal.module';
// tslint:disable-next-line:max-line-length
import { CustomDataSubjectModalModule } from '../shared/components/custom-data-subject-modal/custom-data-subject-modal.module';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    AddDropdownModule,
    CategoricalManagementModule,
    CustomCategoryModalModule,
    CustomDataElementModalModule,
    CustomDataSubjectModalModule,
    CustomProcessingPurposeModalModule,
    CommonModule,
    DatagridHeaderModule,
    PageWrapperModule,
    RecordDatagridModule,
    SettingsRoutingModule,
    TaButtonsModule,
    TaCheckboxModule,
    TaDropdownModule,
    TaPaginationModule,
    TranslateModule
  ]
})
export class SettingsModule {}
