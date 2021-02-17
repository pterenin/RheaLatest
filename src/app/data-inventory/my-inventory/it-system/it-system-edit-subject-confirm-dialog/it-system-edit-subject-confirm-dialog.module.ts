import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TaButtonsModule,
  TaModalModule,
  TaActiveModal
} from '@trustarc/ui-toolkit';
import { ItSystemEditSubjectConfirmDialogComponent } from './it-system-edit-subject-confirm-dialog.component';

@NgModule({
  declarations: [ItSystemEditSubjectConfirmDialogComponent],
  imports: [CommonModule, TaButtonsModule, TaModalModule],
  providers: [TaActiveModal],
  entryComponents: [ItSystemEditSubjectConfirmDialogComponent],
  exports: [ItSystemEditSubjectConfirmDialogComponent]
})
export class ItSystemEditSubjectConfirmDialogModule {}
