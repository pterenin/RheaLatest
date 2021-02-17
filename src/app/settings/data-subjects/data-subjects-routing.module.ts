import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataSubjectsComponent } from './data-subjects.component';
// tslint:disable-next-line:max-line-length
import { DataSubjectCategoriesComponent } from './data-subject-categories/data-subject-categories.component';
// tslint:disable-next-line:max-line-length
import { DataSubjectCategoryComponent } from './data-subject-categories/data-subject-category/data-subject-category.component';
// tslint:disable-next-line:max-line-length
import { DataSubjectDetailsComponent } from './data-subject-categories/data-subject-category/data-subject-details/data-subject-details.component';

import { AAA_NAV_LINK } from 'src/app/shared/components/header/header-aaa.constant';

export const routes: Routes = [
  {
    path: '',
    component: DataSubjectsComponent,
    children: [
      {
        path: 'categories',
        component: DataSubjectCategoriesComponent,
        data: {
          title: 'Categories',
          showLeftNav: true,
          leftNavType: 'SETTINGS',
          aaaNavLink: AAA_NAV_LINK.SETTINGS,
          showBreadCrumb: false,
          header: true,
          footer: true
        }
      },
      {
        path: 'categories/:categoryId',
        component: DataSubjectCategoryComponent,
        data: {
          title: 'Category',
          showLeftNav: true,
          leftNavType: 'SETTINGS',
          aaaNavLink: AAA_NAV_LINK.SETTINGS,
          showBreadCrumb: false,
          header: true,
          footer: true
        }
      },
      {
        path: 'categories/:categoryId/:dataSubjectId',
        component: DataSubjectDetailsComponent,
        data: {
          title: 'Details',
          showLeftNav: true,
          leftNavType: 'SETTINGS',
          aaaNavLink: AAA_NAV_LINK.SETTINGS,
          showBreadCrumb: false,
          header: true,
          footer: true
        }
      },
      {
        path: '**',
        redirectTo: 'categories',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'categories',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataSubjectsRoutingModule {}
