import { CollaboratorModalComponent } from './collaborator-modal.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TaButtonsModule,
  TaDropdownModule,
  TaModalModule,
  TaRadioModule
} from '@trustarc/ui-toolkit';
import { DropdownFieldModule } from '../../dropdown/dropdown-field.module';

@NgModule({
  declarations: [CollaboratorModalComponent],
  imports: [
    CommonModule,
    DropdownFieldModule,
    FormsModule,
    ReactiveFormsModule,
    TaButtonsModule,
    TaDropdownModule,
    TaModalModule,
    TaRadioModule
  ],
  entryComponents: [CollaboratorModalComponent]
})
export class CollaboratorModalModule {}
