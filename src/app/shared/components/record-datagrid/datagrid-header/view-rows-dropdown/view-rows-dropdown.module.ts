import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewRowsDropdownComponent } from './view-rows-dropdown.component';
import { TaButtonsModule, TaDropdownModule } from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [ViewRowsDropdownComponent],
  imports: [CommonModule, TaDropdownModule, TaButtonsModule],
  exports: [ViewRowsDropdownComponent]
})
export class ViewRowsDropdownModule {}
