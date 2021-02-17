import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaDropdownModule, TaPaginationModule } from '@trustarc/ui-toolkit';
import { DatagridFooterComponent } from './datagrid-footer.component';

@NgModule({
  declarations: [DatagridFooterComponent],
  imports: [CommonModule, TaPaginationModule, TaDropdownModule],
  exports: [DatagridFooterComponent]
})
export class DatagridFooterModule {}
