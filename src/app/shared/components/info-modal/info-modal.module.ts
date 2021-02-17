import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoModalComponent } from './info-modal.component';
import {
  TaPopoverModule,
  TaTabsetModule,
  TaToggleSwitchModule
} from '@trustarc/ui-toolkit';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [InfoModalComponent],
  imports: [
    CommonModule,
    TaPopoverModule,
    TaTabsetModule,
    TaToggleSwitchModule,
    FormsModule
  ],
  exports: [InfoModalComponent]
})
export class InfoModalModule {}
