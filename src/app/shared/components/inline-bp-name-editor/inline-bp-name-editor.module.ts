import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineBpNameEditorComponent } from './inline-bp-name-editor.component';
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
  declarations: [InlineBpNameEditorComponent],
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
  exports: [InlineBpNameEditorComponent]
})
export class InlineBpNameEditorModule {}
