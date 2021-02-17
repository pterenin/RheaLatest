import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordsRoutingModule } from './records-routing.module';
import { PageWrapperModule } from '../shared/components/page-wrapper/page-wrapper.module';
import { RecordsComponent } from './records.component';
import { AllRecordsComponent } from './all-records/all-records.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { SystemsComponent } from './systems/systems.component';
import { VendorsComponent } from './vendors/vendors.component';

@NgModule({
  declarations: [
    RecordsComponent,
    AllRecordsComponent,
    OrganizationsComponent,
    SystemsComponent,
    VendorsComponent
  ],
  imports: [CommonModule, RecordsRoutingModule, PageWrapperModule]
})
export class RecordsModule {}
