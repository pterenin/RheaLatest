import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaButtonsModule, TaModalModule } from '@trustarc/ui-toolkit';
import { ConfirmUnlinkDataElementCategoriesComponent } from './confirm-unlink-data-element-categories.component';

@NgModule({
  declarations: [ConfirmUnlinkDataElementCategoriesComponent],
  imports: [CommonModule, TaButtonsModule, TaModalModule],
  entryComponents: [ConfirmUnlinkDataElementCategoriesComponent]
})
export class ConfirmUnlinkDataElementCategoriesModule {}
