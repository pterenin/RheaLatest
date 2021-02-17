import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineTagEditorComponent } from './inline-tag-editor.component';
import { SearchFilterPipeModule } from 'src/app/shared/pipes/filter/search-filter.module';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaPopoverModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// retrigger build
@NgModule({
  declarations: [InlineTagEditorComponent],
  imports: [
    TaPopoverModule,
    TaDropdownModule,
    TaSvgIconModule,
    TaButtonsModule,
    TaCheckboxModule,
    SearchFilterPipeModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  exports: [InlineTagEditorComponent]
})
export class InlineTagEditorModule {}
