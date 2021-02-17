import { NgModule } from '@angular/core';
import { CategoriesComponent } from './categories.component';
import { CommonModule } from '@angular/common';
import {
  TaBadgeModule,
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaPaginationModule,
  TaSvgIconModule,
  TaTableModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { RouterModule } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { CustomItemDetailsComponent } from './category/custom-item-details/custom-item-details.component';
import { FormsModule } from '@angular/forms';
import { EntityTypePipeModule } from '../../pipes/entity-type/entity-type.module';
import { CustomCategoryTagModule } from '../custom-category-tag/custom-category-tag.module';

@NgModule({
  declarations: [
    CategoriesComponent,
    CategoryComponent,
    CustomItemDetailsComponent
  ],
  exports: [CategoriesComponent, CategoryComponent, CustomItemDetailsComponent],
  imports: [
    CommonModule,
    PageWrapperModule,
    TaTableModule,
    TaTooltipModule,
    RouterModule,
    TaSvgIconModule,
    TaBadgeModule,
    TaPaginationModule,
    TaDropdownModule,
    TaButtonsModule,
    TaCheckboxModule,
    TaSvgIconModule,
    FormsModule,
    EntityTypePipeModule,
    CustomCategoryTagModule
  ]
})
export class CategoriesModule {}
