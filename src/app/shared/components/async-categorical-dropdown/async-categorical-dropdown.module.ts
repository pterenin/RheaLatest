import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncCategoricalDropdownComponent } from './async-categorical-dropdown.component';
import {
  TaButtonsModule,
  TaDropdownModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
  declarations: [AsyncCategoricalDropdownComponent],
  exports: [AsyncCategoricalDropdownComponent],
  imports: [
    CommonModule,
    TaButtonsModule,
    TaDropdownModule,
    TaSvgIconModule,
    VirtualScrollerModule
  ]
})
export class AsyncCategoricalDropdownModule {}
