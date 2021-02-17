import { NgModule } from '@angular/core';
import { DataSubjectsComponent } from './data-subjects.component';
import { SettingsBreadcrumbModule } from '../../shared/components/settings-breadcrumb/settings-breadcrumb.module';
import { RouterModule } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { DataSubjectCategoriesComponent } from './data-subject-categories/data-subject-categories.component';
import {
  TaPaginationModule,
  TaSvgIconModule,
  TaTableModule
} from '@trustarc/ui-toolkit';
import { PageWrapperModule } from '../../shared/components/page-wrapper/page-wrapper.module';
import { DataSubjectsRoutingModule } from './data-subjects-routing.module';
import { CategoriesModule } from '../../shared/components/categories/categories.module';
import { DataElementsModule } from '../data-elements/data-elements.module';
// tslint:disable-next-line:max-line-length
import { DataSubjectCategoryComponent } from './data-subject-categories/data-subject-category/data-subject-category.component';
// tslint:disable-next-line:max-line-length
import { DataSubjectDetailsComponent } from './data-subject-categories/data-subject-category/data-subject-details/data-subject-details.component';

@NgModule({
  declarations: [
    DataSubjectsComponent,
    DataSubjectCategoriesComponent,
    DataSubjectDetailsComponent,
    DataSubjectCategoryComponent
  ],
  imports: [
    SettingsBreadcrumbModule,
    RouterModule,
    TaTableModule,
    PageWrapperModule,
    TaPaginationModule,
    TaSvgIconModule,
    DataSubjectsRoutingModule,
    DataElementsModule,
    CategoriesModule
  ]
})
export class DataSubjectsModule {}
