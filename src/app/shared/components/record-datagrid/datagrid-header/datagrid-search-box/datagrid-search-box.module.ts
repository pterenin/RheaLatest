import { NgModule } from '@angular/core';
import { DatagridSearchBoxComponent } from './datagrid-search-box.component';
import { DatagridService, TaIconSearchModule } from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [DatagridSearchBoxComponent],
  imports: [TaIconSearchModule],
  exports: [DatagridSearchBoxComponent],
  providers: [DatagridService]
})
export class DatagridSearchBoxModule {}
