import {
  AddDropdownComponent,
  AddDropdownItemComponent
} from './add-dropdown.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TaButtonsModule, TaDropdownModule } from '@trustarc/ui-toolkit';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddDropdownComponent, AddDropdownItemComponent],
  imports: [CommonModule, FormsModule, TaButtonsModule, TaDropdownModule],
  exports: [AddDropdownComponent, AddDropdownItemComponent]
})
export class AddDropdownModule {}
