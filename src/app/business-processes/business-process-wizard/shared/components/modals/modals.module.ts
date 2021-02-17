import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalConfirmationBasicComponent } from './modal-confirmation-basic/modal-confirmation-basic.component';
import { ModalConfirmationThreeButtonComponent } from './modal-confirmation-three-button/modal-confirmation-three-button.component';
import { ModalRevalidationDateEditComponent } from './modal-revalidation-date-edit/modal-revalidation-date-edit.component';
import {
  TaSvgIconModule,
  TaButtonsModule,
  TaTableModule,
  TaTooltipModule,
  TaDropdownModule,
  TaDatepickerModule,
  TaCheckboxModule,
  TaTagsModule
} from '@trustarc/ui-toolkit';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ModalConfirmationBasicComponent,
    ModalConfirmationThreeButtonComponent,
    ModalRevalidationDateEditComponent
  ],
  imports: [
    CommonModule,
    TaSvgIconModule,
    TaButtonsModule,
    TaTableModule,
    TaTooltipModule,
    TaDropdownModule,
    TaDatepickerModule,
    FormsModule,
    TaCheckboxModule,
    TaTagsModule
  ],
  exports: [
    ModalConfirmationBasicComponent,
    ModalConfirmationThreeButtonComponent,
    ModalRevalidationDateEditComponent
  ],
  entryComponents: [
    ModalConfirmationBasicComponent,
    ModalConfirmationThreeButtonComponent,
    ModalRevalidationDateEditComponent
  ]
})
export class ModalsModule {}
