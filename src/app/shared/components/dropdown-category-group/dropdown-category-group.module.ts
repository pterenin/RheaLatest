import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownCategoryGroupComponent } from './dropdown-category-group.component';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaSvgIconModule,
  TaTagsModule
} from '@trustarc/ui-toolkit';
import { DropdownCategoryGroupSearchFilterPipe } from './dropdown-category-group-search-filter.pipe';
import { DropdownCategoryGroupItemSelectedPipe } from './dropdown-category-group-item-selected.pipe';

@NgModule({
  declarations: [
    DropdownCategoryGroupComponent,
    DropdownCategoryGroupSearchFilterPipe,
    DropdownCategoryGroupItemSelectedPipe
  ],
  imports: [
    CommonModule,
    TaCheckboxModule,
    TaDropdownModule,
    TaButtonsModule,
    TaSvgIconModule,
    TaTagsModule
  ],
  exports: [
    DropdownCategoryGroupComponent,
    DropdownCategoryGroupSearchFilterPipe
  ]
})
export class DropdownCategoryGroupModule {}
