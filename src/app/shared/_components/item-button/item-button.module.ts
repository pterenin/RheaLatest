import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaSvgIconModule, TaTooltipModule } from '@trustarc/ui-toolkit';
import { ItemButtonComponent } from './item-button.component';
import { RecordIconModule } from '../record-icon/record-icon.module';

@NgModule({
  declarations: [ItemButtonComponent],
  exports: [ItemButtonComponent],
  entryComponents: [ItemButtonComponent],
  imports: [CommonModule, TaTooltipModule, RecordIconModule, TaSvgIconModule]
})
export class ItemButtonModule {}
