import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TaButtonsModule,
  TaDatagridModule,
  TaDropdownModule,
  TaModalModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { DatagridHeaderComponent } from './datagrid-header.component';
import { RouterModule } from '@angular/router';
import { ViewRowsDropdownModule } from './view-rows-dropdown/view-rows-dropdown.module';
import { DatagridAddBpButtonModule } from './datagrid-add-bp-button/datagrid-add-bp-button.module';
import { BpFilterViewModule } from './bp-filter-view/bp-filter-view.module';
import { DatagridDeleteButtonModule } from './datagrid-delete-button/datagrid-delete-button.module';
import { ConfirmDeleteContentModule } from '../confirm-delete-content/confirm-delete-content.module';
import { TranslateModule } from '@ngx-translate/core';
import { DatagridEditButtonModule } from './datagrid-edit-button/datagrid-edit-button.module';
import { DatagridSearchBoxModule } from './datagrid-search-box/datagrid-search-box.module';
// tslint:disable-next-line:max-line-length
import { ConfirmUnlinkDataElementCategoriesModule } from '../../confirm-unlink-data-element-categories/confirm-unlink-data-element-categories.module';

@NgModule({
  declarations: [DatagridHeaderComponent],
  imports: [
    CommonModule,
    ConfirmUnlinkDataElementCategoriesModule,
    ConfirmDeleteContentModule,
    TaDatagridModule,
    TaDropdownModule,
    TaButtonsModule,
    TaModalModule,
    TaSvgIconModule,
    RouterModule,
    ViewRowsDropdownModule,
    DatagridAddBpButtonModule,
    DatagridDeleteButtonModule,
    DatagridEditButtonModule,
    BpFilterViewModule,
    TranslateModule,
    DatagridSearchBoxModule
  ],
  exports: [DatagridHeaderComponent]
})
export class DatagridHeaderModule {}
