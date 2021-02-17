import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessProcessesComponent } from './business-processes.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  TaToastModule,
  TaPaginationModule,
  TaAccordionModule,
  TaDropdownModule
} from '@trustarc/ui-toolkit';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from './business-processes-routing.module';
import { AllBusinessProcessesComponent } from './all-bp/all-business-processes.component';
import { NgModuleFactoryLoader } from '@angular/core';
import { CreateBusinessProcessesModule } from './create-bp/create-business-processes.module';
import { MockComponents, MockModule } from 'ng-mocks';
import { DatagridHeaderComponent } from '../shared/components/record-datagrid/datagrid-header/datagrid-header.component';
import { DatagridFooterComponent } from '../shared/components/record-datagrid/datagrid-footer/datagrid-footer.component';
import { PageWrapperComponent } from '../shared/components/page-wrapper/page-wrapper.component';
import { RecordDatagridComponent } from '../shared/components/record-datagrid/record-datagrid.component';
import { ViewBpComponent } from './view-bp/view-bp.component';
import { DataInventoryService } from '../data-inventory/data-inventory.service';
import { AssessmentsModule } from '../shared/components/assessments/assessments.module';
import { AuditTableModule } from '../shared/components/audit-table/audit-table.module';
import { AuditAccordionModule } from '../shared/components/audit-accordion/audit-accordion.module';
import { BusinessProcessesListModule } from 'src/app/business-processes/all-bp/business-processes-list/business-processes-list.module';
import { RecordDatagridModule } from 'src/app/shared/components/record-datagrid/record-datagrid.module';

describe('BusinessProcessesComponent', () => {
  let component: BusinessProcessesComponent;
  let fixture: ComponentFixture<BusinessProcessesComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AllBusinessProcessesComponent,
        BusinessProcessesComponent,
        ViewBpComponent,
        ...MockComponents(
          DatagridHeaderComponent,
          DatagridFooterComponent,
          PageWrapperComponent,
          RecordDatagridComponent
        )
      ],
      imports: [
        AssessmentsModule,
        AuditTableModule,
        HttpClientTestingModule,
        AuditAccordionModule,
        RouterTestingModule.withRoutes(routes),
        TranslateModule.forRoot(),
        MockModule(TaAccordionModule),
        MockModule(TaDropdownModule),
        MockModule(TaPaginationModule),
        MockModule(TaToastModule),
        BusinessProcessesListModule,
        RecordDatagridModule
      ],
      providers: [DataInventoryService]
    }).compileComponents();

    router = TestBed.get(Router);
    location = TestBed.get(Location);
    router.initialNavigation();

    const loader = TestBed.get(NgModuleFactoryLoader);
    loader.stubbedModules = { lazyModule: CreateBusinessProcessesModule };

    router.resetConfig([{ path: 'foo', loadChildren: 'lazyModule' }]);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
