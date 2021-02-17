import { NgModule } from '@angular/core';
import { ReviewTableComponent } from './review-table.component';
import {
  TaTableModule,
  TaPaginationModule,
  TaPopoverModule,
  TaButtonsModule,
  TaBadgeModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { CommonModule } from '@angular/common';
import { CategoricalViewModule } from 'src/app/shared/components/categorical-view/categorical-view.module';
import { PaginatePipeModule } from 'src/app/shared/pipes/paginate/paginate.module';

import { HttpClientModule } from '@angular/common/http';
import { DropdownCategoryMultipleModule } from 'src/app/shared/components/dropdown-category-multiple/dropdown-category-multiple.module';
import { SortByPipeModule } from 'src/app/shared/_pipes/sort-by/sort-by.module';

@NgModule({
  declarations: [ReviewTableComponent],
  exports: [ReviewTableComponent],
  imports: [
    CommonModule,
    DropdownCategoryMultipleModule,
    TaPaginationModule,
    TaTableModule,
    CategoricalViewModule,
    HttpClientModule,
    TaPopoverModule,
    TaButtonsModule,
    TaBadgeModule,
    PaginatePipeModule,
    TaTooltipModule,
    SortByPipeModule
  ]
})
export class ReviewTableModule {}
