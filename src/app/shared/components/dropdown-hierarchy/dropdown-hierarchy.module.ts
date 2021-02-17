import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownHierarchyComponent } from './dropdown-hierarchy.component';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaSvgIconModule,
  TaTagsModule
} from '@trustarc/ui-toolkit';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { SearchFilterPipeModule } from '../../pipes/filter/search-filter.module';
import { NonselectedPipeModule } from '../../pipes/filter/nonselected.module';

@NgModule({
  declarations: [DropdownHierarchyComponent],
  imports: [
    CommonModule,
    TaDropdownModule,
    TaButtonsModule,
    TaTagsModule,
    VirtualScrollerModule,
    TaSvgIconModule,
    SearchFilterPipeModule,
    NonselectedPipeModule,
    TaCheckboxModule
  ],
  exports: [DropdownHierarchyComponent]
})
export class DropdownHierarchyModule {}
