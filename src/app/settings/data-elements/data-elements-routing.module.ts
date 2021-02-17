import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataElementsComponent } from './data-elements.component';
import { DataElementCategoriesComponent } from './data-element-categories/data-element-categories.component';
import { DataElementCategoryComponent } from './data-element-categories/data-element-category/data-element-category.component';
// tslint:disable-next-line: max-line-length
import { DataElementDetailsComponent } from './data-element-categories/data-element-category/data-element-details/data-element-details.component';
import { AAA_NAV_LINK } from 'src/app/shared/components/header/header-aaa.constant';

export const routes: Routes = [
  {
    path: '',
    component: DataElementsComponent,
    children: [
      {
        path: 'categories',
        component: DataElementCategoriesComponent,
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
        component: DataElementCategoryComponent,
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
        path: 'categories/:categoryId/:dataElementId',
        component: DataElementDetailsComponent,
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
export class DataElementsRoutingModule { }
