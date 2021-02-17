import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AAA_NAV_LINK } from '../shared/components/header/header-aaa.constant';

export const routes: Routes = [
  {
    path: 'data-elements',
    loadChildren: './data-elements/data-elements.module#DataElementsModule',
    data: {
      title: 'Data Elements',
      breadcrumb: 'Data Elements',
      showLeftNav: true,
      leftNavType: 'SETTINGS',
      aaaNavLink: AAA_NAV_LINK.SETTINGS,
      showBreadCrumb: false,
      footer: true,
      header: true
    }
  },
  {
    path: 'data-subjects',
    loadChildren: './data-subjects/data-subjects.module#DataSubjectsModule',
    data: {
      title: 'Data Subjects',
      breadcrumb: 'Data Subjects',
      showLeftNav: true,
      leftNavType: 'SETTINGS',
      aaaNavLink: AAA_NAV_LINK.SETTINGS,
      showBreadCrumb: false,
      footer: true,
      header: true
    }
  },
  {
    path: 'processing-purposes',
    loadChildren:
      './processing-purposes/processing-purposes.module#ProcessingPurposesModule',
    data: {
      title: 'Process Purposes',
      breadcrumb: 'Processing Purposes',
      showLeftNav: true,
      leftNavType: 'SETTINGS',
      aaaNavLink: AAA_NAV_LINK.SETTINGS,
      showBreadCrumb: false,
      footer: true,
      header: true
    }
  },
  {
    path: '**',
    redirectTo: 'data-elements',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
