import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FinishSetStatusComponent } from './finish-set-status.component';
import { DropdownFieldModule } from '../../../shared/components/dropdown/dropdown-field.module';
import {
  TaModalModule,
  TaButtonsModule,
  TaRadioModule
} from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [FinishSetStatusComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownFieldModule,
    TaModalModule,
    TaButtonsModule,
    TaRadioModule
  ],
  entryComponents: [FinishSetStatusComponent]
})
export class FinishSetStatusModule {}
