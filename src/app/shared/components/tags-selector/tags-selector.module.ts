import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagsSelectorComponent } from './tags-selector.component';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { DropdownFieldModule } from '../dropdown/dropdown-field.module';
import { TagsSelectorService } from './tags-selector.service';
import { DropdownCategoryMultipleModule } from '../dropdown-category-multiple/dropdown-category-multiple.module';
import { DropdownHierarchyModule } from '../dropdown-hierarchy/dropdown-hierarchy.module';

@NgModule({
  declarations: [TagsSelectorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaButtonsModule,
    TaCheckboxModule,
    TaDropdownModule,
    TaTooltipModule,
    DropdownCategoryMultipleModule,
    DropdownFieldModule,
    DropdownHierarchyModule
  ],
  exports: [TagsSelectorComponent],
  providers: [TagsSelectorService]
})
export class TagsSelectorModule {}
