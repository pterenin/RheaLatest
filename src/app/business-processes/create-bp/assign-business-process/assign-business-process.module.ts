import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AssignBusinessProcessComponent } from './assign-business-process.component';
import { DropdownFieldModule } from '../../../shared/components/dropdown/dropdown-field.module';
import {
  TaModalModule,
  TaButtonsModule,
  TaRadioModule
} from '@trustarc/ui-toolkit';
import { CreateBusinessProcessesModule } from '../create-business-processes.module';

@NgModule({
  declarations: [AssignBusinessProcessComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownFieldModule,
    TaModalModule,
    TaButtonsModule,
    TaRadioModule
  ],
  entryComponents: [AssignBusinessProcessComponent]
})
export class AssignBusinessProcessModule {}
