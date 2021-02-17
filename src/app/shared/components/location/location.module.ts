import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationComponent } from './location.component';
import {
  TaAccordionModule,
  TaButtonsModule,
  TaCheckboxModule,
  TaSvgIconModule,
  TaTabsetModule
} from '@trustarc/ui-toolkit';
import { FormsModule } from '@angular/forms';

import { SearchFieldModule } from '../../_components/search-field/search-field.module';

@NgModule({
  declarations: [LocationComponent],
  imports: [
    CommonModule,
    FormsModule,
    TaCheckboxModule,
    TaAccordionModule,
    TaSvgIconModule,
    TaButtonsModule,
    TaTabsetModule,
    SearchFieldModule
  ],
  exports: [LocationComponent]
})
export class LocationModule {}
