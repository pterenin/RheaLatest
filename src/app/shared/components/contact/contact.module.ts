import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TaActiveModal,
  TaButtonsModule,
  TaModalModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { DropdownFieldModule } from '../dropdown/dropdown-field.module';
import { ContactService } from './contact.service';

@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaModalModule,
    TaButtonsModule,
    DropdownFieldModule,
    TaSvgIconModule
  ],
  providers: [TaActiveModal, ContactService],
  entryComponents: [ContactComponent],
  exports: [ContactComponent]
})
export class ContactModule {}
