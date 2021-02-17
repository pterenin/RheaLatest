import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TaButtonsModule,
  TaRadioModule,
  TaSvgIconModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { CustomDataSubjectModalComponent } from './custom-data-subject-modal.component';
import { DropdownFieldModule } from '../dropdown/dropdown-field.module';

@NgModule({
  declarations: [CustomDataSubjectModalComponent],
  imports: [
    CommonModule,
    DropdownFieldModule,
    FormsModule,
    ReactiveFormsModule,
    TaButtonsModule,
    TaTooltipModule,
    TaRadioModule,
    TaSvgIconModule
  ],
  exports: [CustomDataSubjectModalComponent],
  entryComponents: [CustomDataSubjectModalComponent]
})
export class CustomDataSubjectModalModule {}
