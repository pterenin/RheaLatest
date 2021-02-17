import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownCheckboxMultipleComponent } from './dropdown-checkbox-multiple/dropdown-checkbox-multiple.component';
import {
  TaCheckboxModule,
  TaDropdownModule,
  TaTagsModule
} from '@trustarc/ui-toolkit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DropdownCheckboxMultipleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaCheckboxModule,
    TaDropdownModule,
    TaTagsModule
  ],
  exports: [DropdownCheckboxMultipleComponent]
})
export class DropdownCheckboxMultipleModule {}
