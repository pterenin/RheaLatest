import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { PageWrapperModule } from 'src/app/shared/components/page-wrapper/page-wrapper.module';
import { TranslateModule } from '@ngx-translate/core';
import { RecordDatagridModule } from 'src/app/shared/components/record-datagrid/record-datagrid.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  TaToastModule,
  ToastService,
  TaPaginationModule
} from '@trustarc/ui-toolkit';

import { DatagridHeaderModule } from 'src/app/shared/components/record-datagrid/datagrid-header/datagrid-header.module';
import { DatagridFooterModule } from 'src/app/shared/components/record-datagrid/datagrid-footer/datagrid-footer.module';
import { CategoricalManagementModule } from 'src/app/shared/components/categorical-management/categorical-management.module';
import { AddDropdownModule } from 'src/app/shared/components/add-dropdown/add-dropdown.module';
import { SettingsBreadcrumbModule } from 'src/app/shared/components/settings-breadcrumb/settings-breadcrumb.module';
import { ProcessingPurposesComponent } from './processing-purposes.component';

describe('ProcessingPurposesComponent', () => {
  let component: ProcessingPurposesComponent;
  let fixture: ComponentFixture<ProcessingPurposesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessingPurposesComponent],
      imports: [
        RouterTestingModule,
        PageWrapperModule,
        TranslateModule.forRoot(),
        RecordDatagridModule,
        HttpClientTestingModule,
        DatagridHeaderModule,
        DatagridFooterModule,
        TaPaginationModule,
        TaToastModule,
        CategoricalManagementModule,
        AddDropdownModule,
        SettingsBreadcrumbModule
      ],
      providers: [ToastService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingPurposesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
