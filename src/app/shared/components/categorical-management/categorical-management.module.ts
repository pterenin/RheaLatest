import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoricalManagementComponent } from './categorical-management.component';
import {
  TaBadgeModule,
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule
} from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [CategoricalManagementComponent],
  imports: [
    CommonModule,
    FormsModule,
    TaCheckboxModule,
    TaBadgeModule,
    TaDropdownModule,
    TaButtonsModule
  ],
  exports: [CategoricalManagementComponent]
})
export class CategoricalManagementModule {}
