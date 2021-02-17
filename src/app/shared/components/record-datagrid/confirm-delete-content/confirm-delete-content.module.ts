import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaButtonsModule, TaModalModule } from '@trustarc/ui-toolkit';
import { ConfirmDeleteContentComponent } from './confirm-delete-content.component';

@NgModule({
  declarations: [ConfirmDeleteContentComponent],
  imports: [CommonModule, TaButtonsModule, TaModalModule],
  entryComponents: [ConfirmDeleteContentComponent]
})
export class ConfirmDeleteContentModule {}
