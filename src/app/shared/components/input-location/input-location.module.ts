import { InputLocationComponent } from './input-location.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownFieldModule } from '../dropdown/dropdown-field.module';

import {
  TaButtonsModule,
  TaSvgIconModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { RiskFieldIndicatorModule } from '../risk-field-indicator/risk-field-indicator.module';

@NgModule({
  declarations: [InputLocationComponent],
  imports: [
    CommonModule,
    DropdownFieldModule,
    ReactiveFormsModule,
    TaTooltipModule,
    TaButtonsModule,
    TaSvgIconModule,
    RiskFieldIndicatorModule
  ],
  exports: [InputLocationComponent]
})
export class InputLocationModule {}
