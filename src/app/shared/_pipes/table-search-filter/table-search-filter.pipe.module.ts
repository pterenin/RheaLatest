import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableSearchFilterPipe } from './table-search-filter.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [TableSearchFilterPipe],
  exports: [TableSearchFilterPipe]
})
export class TableSearchFilterPipeModule {}
