import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessingPurposesComponent } from './processing-purposes.component';
// tslint:disable-next-line:max-line-length
import { ProcessingPurposeCategoriesComponent } from './processing-purpose-categories/processing-purpose-categories.component';
// tslint:disable-next-line:max-line-length
import { ProcessingPurposeCategoryComponent } from './processing-purpose-categories/processing-purpose-category/processing-purpose-category.component';
// tslint:disable-next-line:max-line-length
import { ProcessingPurposeDetailsComponent } from './processing-purpose-categories/processing-purpose-category/processing-purpose-details/processing-purpose-details.component';
import { AAA_NAV_LINK } from 'src/app/shared/components/header/header-aaa.constant';

export const routes: Routes = [
  {
    path: '',
    component: ProcessingPurposesComponent,
    children: [
      {
        path: 'categories',
        component: ProcessingPurposeCategoriesComponent,
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
        component: ProcessingPurposeCategoryComponent,
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
        path: 'categories/:categoryId/:processingPurposeId',
        component: ProcessingPurposeDetailsComponent,
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
export class ProcessingPurposesRoutingModule {}
