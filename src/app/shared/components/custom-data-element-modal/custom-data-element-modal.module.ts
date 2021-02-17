import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TaButtonsModule,
  TaSvgIconModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { CustomDataElementModalComponent } from './custom-data-element-modal.component';
import { DropdownFieldModule } from '../dropdown/dropdown-field.module';

@NgModule({
  declarations: [CustomDataElementModalComponent],
  imports: [
    CommonModule,
    DropdownFieldModule,
    FormsModule,
    ReactiveFormsModule,
    TaButtonsModule,
    TaTooltipModule,
    TaSvgIconModule
  ],
  exports: [CustomDataElementModalComponent],
  entryComponents: [CustomDataElementModalComponent]
})
export class CustomDataElementModalModule {}
