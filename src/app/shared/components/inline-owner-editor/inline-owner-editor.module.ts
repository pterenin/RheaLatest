import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineOwnerEditorComponent } from './inline-owner-editor.component';
import { SearchFilterPipeModule } from 'src/app/shared/pipes/filter/search-filter.module';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaPopoverModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultipleStringPipeModule } from '../../pipes/multiple-string/multiple-string.module';

@NgModule({
  declarations: [InlineOwnerEditorComponent],
  imports: [
    TaPopoverModule,
    TaDropdownModule,
    TaSvgIconModule,
    TaButtonsModule,
    TaCheckboxModule,
    SearchFilterPipeModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MultipleStringPipeModule
  ],
  exports: [InlineOwnerEditorComponent]
})
export class InlineOwnerEditorModule {}
