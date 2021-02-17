import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedFilterTypeComponent } from './selected-filter-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [SelectedFilterTypeComponent],
  imports: [
    CommonModule,
    TaButtonsModule,
    TaDropdownModule,
    TaCheckboxModule,
    TaSvgIconModule,
    TaPopoverModule,
    FormsModule,
    ReactiveFormsModule,
    TaTooltipModule
  ],
  exports: [SelectedFilterTypeComponent]
})
export class SelectedFilterTypeModule {}
