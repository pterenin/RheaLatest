import { CollaboratorComponent } from './collaborator.component';
import { CollaboratorModalModule } from './collaborator-modal/collaborator-modal.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  TaButtonsModule,
  TaPopoverModule,
  TaTabsetModule,
  TaToggleSwitchModule
} from '@trustarc/ui-toolkit';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CollaboratorComponent],
  imports: [
    CollaboratorModalModule,
    CommonModule,
    FormsModule,
    TaButtonsModule,
    TaPopoverModule,
    TaTabsetModule,
    TaToggleSwitchModule
  ],
  exports: [CollaboratorComponent]
})
export class CollaboratorModule {}
