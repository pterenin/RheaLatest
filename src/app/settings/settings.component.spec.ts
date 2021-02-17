import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordDatagridModule } from '../shared/components/record-datagrid/record-datagrid.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatagridHeaderModule } from '../shared/components/record-datagrid/datagrid-header/datagrid-header.module';
import { TaToastModule, TaPaginationModule } from '@trustarc/ui-toolkit';
import { DatagridFooterModule } from '../shared/components/record-datagrid/datagrid-footer/datagrid-footer.module';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from './settings-routing.module';
import { PageWrapperModule } from '../shared/components/page-wrapper/page-wrapper.module';
import { NgModuleFactoryLoader } from '@angular/core';
import { CategoricalManagementModule } from '../shared/components/categorical-management/categorical-management.module';
import { AddDropdownModule } from '../shared/components/add-dropdown/add-dropdown.module';
import { SettingsBreadcrumbModule } from '../shared/components/settings-breadcrumb/settings-breadcrumb.module';
import { DataElementsModule } from './data-elements/data-elements.module';
import { DataSubjectsModule } from './data-subjects/data-subjects.module';

class LoadedModuleStub {}

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [
        DatagridHeaderModule,
        DatagridFooterModule,
        HttpClientTestingModule,
        PageWrapperModule,
        RecordDatagridModule,
        RouterTestingModule.withRoutes(routes),
        TaPaginationModule,
        TaToastModule,
        TranslateModule.forRoot(),
        CategoricalManagementModule,
        AddDropdownModule,
        SettingsBreadcrumbModule,
        DataElementsModule,
        DataSubjectsModule
      ]
    }).compileComponents();

    router = TestBed.get(Router);
    location = TestBed.get(Location);
    router.initialNavigation();

    const loader = TestBed.get(NgModuleFactoryLoader);

    router.resetConfig([{ path: 'foo', loadChildren: 'lazyModule' }]);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
