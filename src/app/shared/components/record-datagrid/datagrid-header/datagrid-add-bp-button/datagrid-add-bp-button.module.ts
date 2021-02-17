import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TaButtonsModule,
  TaDatagridModule,
  TaDropdownModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { RouterModule } from '@angular/router';
import { DatagridAddBpButtonComponent } from './datagrid-add-bp-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { AssignBusinessProcessModule } from 'src/app/business-processes/create-bp/assign-business-process/assign-business-process.module';

@NgModule({
  declarations: [DatagridAddBpButtonComponent],
  imports: [
    AssignBusinessProcessModule,
    CommonModule,
    RouterModule,
    TaButtonsModule,
    TaDatagridModule,
    TaDropdownModule,
    TaSvgIconModule,
    TranslateModule
  ],
  exports: [DatagridAddBpButtonComponent]
})
export class DatagridAddBpButtonModule {}
