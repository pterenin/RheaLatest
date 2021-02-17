import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatagridEditButtonComponent } from './datagrid-edit-button.component';
import { TaButtonsModule } from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [DatagridEditButtonComponent],
  imports: [CommonModule, TaButtonsModule],
  exports: [DatagridEditButtonComponent]
})
export class DatagridEditButtonModule {}
