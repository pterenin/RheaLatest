import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaButtonsModule, TaDropdownModule } from '@trustarc/ui-toolkit';
import { CustomCategoryModalComponent } from './custom-category-modal.component';
import { DropdownFieldModule } from '../dropdown/dropdown-field.module';

@NgModule({
  declarations: [CustomCategoryModalComponent],
  exports: [CustomCategoryModalComponent],
  imports: [
    CommonModule,
    DropdownFieldModule,
    FormsModule,
    ReactiveFormsModule,
    TaButtonsModule,
    TaDropdownModule
  ],
  entryComponents: [CustomCategoryModalComponent]
})
export class CustomCategoryModalModule {}
