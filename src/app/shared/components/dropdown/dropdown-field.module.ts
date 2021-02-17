import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownFieldComponent } from './dropdown-field.component';
import {
  TaButtonsModule,
  TaDropdownModule,
  TaTagsModule
} from '@trustarc/ui-toolkit';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { RiskFieldIndicatorModule } from '../risk-field-indicator/risk-field-indicator.module';

@NgModule({
  declarations: [DropdownFieldComponent],
  imports: [
    CommonModule,
    TaDropdownModule,
    TaButtonsModule,
    TaTagsModule,
    VirtualScrollerModule,
    RiskFieldIndicatorModule
  ],
  exports: [DropdownFieldComponent]
})
export class DropdownFieldModule {}
