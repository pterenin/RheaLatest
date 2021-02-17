import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownCategoryMultipleComponent } from './dropdown-category-multiple/dropdown-category-multiple.component';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaSvgIconModule,
  TaTagsModule
} from '@trustarc/ui-toolkit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DropdownCategoryMultipleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaCheckboxModule,
    TaDropdownModule,
    TaButtonsModule,
    TaSvgIconModule,
    TaTagsModule
  ],
  exports: [DropdownCategoryMultipleComponent]
})
export class DropdownCategoryMultipleModule {}
