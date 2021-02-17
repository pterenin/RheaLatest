import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataElementsComponent } from './data-elements.component';
import { DataElementCategoriesComponent } from './data-element-categories/data-element-categories.component';
import { DataElementsRoutingModule } from './data-elements-routing.module';
import { DataElementCategoryComponent } from './data-element-categories/data-element-category/data-element-category.component';
// tslint:disable-next-line: max-line-length
import { DataElementDetailsComponent } from './data-element-categories/data-element-category/data-element-details/data-element-details.component';
import { SettingsBreadcrumbModule } from 'src/app/shared/components/settings-breadcrumb/settings-breadcrumb.module';
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
import { PageWrapperModule } from 'src/app/shared/components/page-wrapper/page-wrapper.module';
import { FormsModule } from '@angular/forms';
import { CustomCategoryModalModule } from 'src/app/shared/components/custom-category-modal/custom-category-modal.module';
import { CustomDataElementModalModule } from 'src/app/shared/components/custom-data-element-modal/custom-data-element-modal.module';
import { EntityTypePipeModule } from 'src/app/shared/pipes/entity-type/entity-type.module';
import { CategoriesModule } from '../../shared/components/categories/categories.module';

@NgModule({
  declarations: [
    DataElementsComponent,
    DataElementCategoriesComponent,
    DataElementCategoryComponent,
    DataElementDetailsComponent
  ],
  imports: [
    CommonModule,
    CustomCategoryModalModule,
    CustomDataElementModalModule,
    DataElementsRoutingModule,
    FormsModule,
    PageWrapperModule,
    EntityTypePipeModule,
    SettingsBreadcrumbModule,
    TaBadgeModule,
    TaButtonsModule,
    TaCheckboxModule,
    TaDropdownModule,
    TaPaginationModule,
    TaSvgIconModule,
    TaTableModule,
    TaTooltipModule,
    CategoriesModule
  ]
})
export class DataElementsModule {}
