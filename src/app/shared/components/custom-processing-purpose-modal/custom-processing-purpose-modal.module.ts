import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule
} from '@trustarc/ui-toolkit';
import { CustomProcessingPurposeModalComponent } from './custom-processing-purpose-modal.component';
import { DropdownFieldModule } from '../dropdown/dropdown-field.module';
import { DropdownCategoryMultipleModule } from '../dropdown-category-multiple/dropdown-category-multiple.module';
import { DropdownCheckboxMultipleModule } from '../dropdown-checkbox-multiple/dropdown-checkbox-multiple.module';

@NgModule({
  declarations: [CustomProcessingPurposeModalComponent],
  exports: [CustomProcessingPurposeModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaButtonsModule,
    TaCheckboxModule,
    TaDropdownModule,
    DropdownFieldModule,
    DropdownCategoryMultipleModule,
    DropdownCheckboxMultipleModule
  ],
  entryComponents: [CustomProcessingPurposeModalComponent]
})
export class CustomProcessingPurposeModalModule {}
