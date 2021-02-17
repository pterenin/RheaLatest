import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TaButtonsModule,
  TaModalModule,
  TaActiveModal
} from '@trustarc/ui-toolkit';
import { ItSystemEditLocationConfirmDialogComponent } from './it-system-edit-location-confirm-dialog.component';

@NgModule({
  declarations: [ItSystemEditLocationConfirmDialogComponent],
  imports: [CommonModule, TaButtonsModule, TaModalModule],
  providers: [TaActiveModal],
  entryComponents: [ItSystemEditLocationConfirmDialogComponent],
  exports: [ItSystemEditLocationConfirmDialogComponent]
})
export class ItSystemEditLocationConfirmDialogModule {}
