import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomFiltersComponent } from './custom-filters.component';
import { SelectedFilterTypeModule } from './selected-filter-type/selected-filter-type.module';
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
  declarations: [CustomFiltersComponent],
  imports: [
    CommonModule,
    TaButtonsModule,
    TaDropdownModule,
    TaCheckboxModule,
    TaSvgIconModule,
    TaPopoverModule,
    SelectedFilterTypeModule,
    FormsModule,
    ReactiveFormsModule,
    TaTooltipModule
  ],
  exports: [CustomFiltersComponent]
})
export class CustomFiltersModule {}
