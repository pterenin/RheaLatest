import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatagridDeleteButtonComponent } from './datagrid-delete-button.component';
import { TaButtonsModule } from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [DatagridDeleteButtonComponent],
  imports: [CommonModule, TaButtonsModule],
  exports: [DatagridDeleteButtonComponent]
})
export class DatagridDeleteButtonModule {}
