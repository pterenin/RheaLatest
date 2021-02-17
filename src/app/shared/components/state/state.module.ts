import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateComponent } from './state.component';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaIconSearchModule,
  TaSvgIconModule,
  TaTableModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { DatagridSearchBoxModule } from '../record-datagrid/datagrid-header/datagrid-search-box/datagrid-search-box.module';
import { FormsModule } from '@angular/forms';
import { SearchFieldModule } from '../../_components/search-field/search-field.module';

@NgModule({
  declarations: [StateComponent],
  exports: [StateComponent],
  imports: [
    CommonModule,
    TaButtonsModule,
    TaCheckboxModule,
    TaTableModule,
    TaIconSearchModule,
    TaTooltipModule,
    DatagridSearchBoxModule,
    FormsModule,
    SearchFieldModule,
    TaSvgIconModule
  ]
})
export class StateModule {}
