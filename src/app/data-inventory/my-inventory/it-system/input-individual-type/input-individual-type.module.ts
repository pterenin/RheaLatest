import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputIndividualTypeComponent } from './input-individual-type.component';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { InputLocationModule } from '../../../../shared/components/input-location/input-location.module';
import { RegionDisplayFieldModule } from '../region-display-field/region-display-field.module';
import {
  TaSvgIconModule,
  TaTooltipModule,
  TaButtonsModule
} from '@trustarc/ui-toolkit';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';

@NgModule({
  declarations: [InputIndividualTypeComponent],
  imports: [
    CommonModule,
    DropdownFieldModule,
    ReactiveFormsModule,
    InputLocationModule,
    RegionDisplayFieldModule,
    TaSvgIconModule,
    TaTooltipModule,
    TaButtonsModule,
    RiskFieldIndicatorModule
  ],
  exports: [InputIndividualTypeComponent]
})
export class InputIndividualTypeModule {}
