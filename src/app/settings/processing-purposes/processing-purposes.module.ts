import { NgModule } from '@angular/core';
import { ProcessingPurposesComponent } from './processing-purposes.component';
import { SettingsBreadcrumbModule } from '../../shared/components/settings-breadcrumb/settings-breadcrumb.module';
import { RouterModule } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { ProcessingPurposeCategoriesComponent } from './processing-purpose-categories/processing-purpose-categories.component';
import {
  TaPaginationModule,
  TaSvgIconModule,
  TaTableModule
} from '@trustarc/ui-toolkit';
import { PageWrapperModule } from '../../shared/components/page-wrapper/page-wrapper.module';
import { ProcessingPurposesRoutingModule } from './processing-purposes-routing.module';
import { CategoriesModule } from '../../shared/components/categories/categories.module';
import { DataElementsModule } from '../data-elements/data-elements.module';
// tslint:disable-next-line:max-line-length
import { ProcessingPurposeCategoryComponent } from './processing-purpose-categories/processing-purpose-category/processing-purpose-category.component';
// tslint:disable-next-line:max-line-length
import { ProcessingPurposeDetailsComponent } from './processing-purpose-categories/processing-purpose-category/processing-purpose-details/processing-purpose-details.component';

@NgModule({
  declarations: [
    ProcessingPurposesComponent,
    ProcessingPurposeCategoriesComponent,
    ProcessingPurposeCategoryComponent,
    ProcessingPurposeDetailsComponent
  ],
  imports: [
    SettingsBreadcrumbModule,
    RouterModule,
    TaTableModule,
    PageWrapperModule,
    TaPaginationModule,
    TaSvgIconModule,
    ProcessingPurposesRoutingModule,
    DataElementsModule,
    CategoriesModule
  ]
})
export class ProcessingPurposesModule {}
