import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFieldComponent } from './search-field.component';
import {
  TaButtonsModule,
  TaDropdownModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SearchFieldComponent],
  imports: [
    CommonModule,
    TaDropdownModule,
    TaSvgIconModule,
    TaButtonsModule,
    ReactiveFormsModule
  ],
  exports: [SearchFieldComponent],
  entryComponents: [SearchFieldComponent]
})
export class SearchFieldModule {}
