import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BpFilterViewComponent } from './bp-filter-view.component';
import { TaButtonsModule } from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [BpFilterViewComponent],
  imports: [CommonModule, TaButtonsModule],
  exports: [BpFilterViewComponent]
})
export class BpFilterViewModule {}
