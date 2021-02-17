import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownFieldModule } from '../dropdown/dropdown-field.module';
import {
  TaButtonsModule,
  TaDropdownModule,
  TaSvgIconModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { HeadquartersFormComponent } from 'src/app/shared/components/headquarters-form/headquarters-form.component';
import { CollectionPipeModule } from 'src/app/shared/pipes/collection/collection.module';

@NgModule({
  declarations: [HeadquartersFormComponent],
  imports: [
    CommonModule,
    DropdownFieldModule,
    ReactiveFormsModule,
    TaTooltipModule,
    TaButtonsModule,
    TaSvgIconModule,
    TaDropdownModule,
    CollectionPipeModule
  ],
  exports: [HeadquartersFormComponent]
})
export class HeadquartersFormModule {}
