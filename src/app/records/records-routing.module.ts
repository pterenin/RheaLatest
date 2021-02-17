import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecordsComponent } from './records.component';
import { AllRecordsComponent } from './all-records/all-records.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { SystemsComponent } from './systems/systems.component';
import { VendorsComponent } from './vendors/vendors.component';

const routes: Routes = [
  {
    path: '',
    component: RecordsComponent,
    children: [
      {
        path: 'all',
        component: AllRecordsComponent,
        data: {
          title: 'All Records',
          breadcrumb: 'All',
          showLeftNav: true,
          leftNavType: 'BUSINESS_PROCESS',
          showBreadCrumb: true,
          footer: true,
          header: true
        }
      },
      {
        path: 'organizations',
        component: OrganizationsComponent,
        data: {
          title: 'Organizations',
          breadcrumb: 'Organizations',
          showLeftNav: true,
          leftNavType: 'BUSINESS_PROCESS',
          showBreadCrumb: true,
          footer: true,
          header: true
        }
      },
      {
        path: 'systems',
        component: SystemsComponent,
        data: {
          title: 'Systems',
          breadcrumb: 'Systems',
          showLeftNav: true,
          leftNavType: 'BUSINESS_PROCESS',
          showBreadCrumb: true,
          footer: true,
          header: true
        }
      },
      {
        path: 'vendors',
        component: VendorsComponent,
        data: {
          title: 'Vendors',
          breadcrumb: 'Vendors',
          showLeftNav: true,
          leftNavType: 'BUSINESS_PROCESS',
          showBreadCrumb: true,
          footer: true,
          header: true
        }
      },
      {
        path: '**',
        redirectTo: 'all',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordsRoutingModule {}
