import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatagridHeaderComponent } from './datagrid-header.component';
import { CommonModule } from '@angular/common';
import {
  TaButtonsModule,
  TaDatagridModule,
  TaDropdownModule,
  TaPagination,
  TaSvgIconModule,
  TaToastModule
} from '@trustarc/ui-toolkit';
import { RouterModule } from '@angular/router';
import { ViewRowsDropdownModule } from './view-rows-dropdown/view-rows-dropdown.module';
import { DatagridAddBpButtonModule } from './datagrid-add-bp-button/datagrid-add-bp-button.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BpFilterViewModule } from './bp-filter-view/bp-filter-view.module';
import { DatagridDeleteButtonModule } from './datagrid-delete-button/datagrid-delete-button.module';
import { DatagridHeaderService } from 'src/app/shared/services/record-listing/datagrid-header.service';
import { MockDatagridHeaderService } from 'src/mocks/mock-datagrid-header.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { DatagridEditButtonModule } from './datagrid-edit-button/datagrid-edit-button.module';
import { DatagridSearchBoxModule } from './datagrid-search-box/datagrid-search-box.module';
import { CustomFiltersModule } from '../../custom-filters/custom-filters.module';

describe('DatagridHeaderComponent', () => {
  let component: DatagridHeaderComponent;
  let fixture: ComponentFixture<DatagridHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatagridHeaderComponent, TaPagination],
      imports: [
        CommonModule,
        TaDatagridModule,
        TaDropdownModule,
        TaButtonsModule,
        ViewRowsDropdownModule,
        CustomFiltersModule,
        DatagridAddBpButtonModule,
        DatagridDeleteButtonModule,
        DatagridEditButtonModule,
        DatagridSearchBoxModule,
        RouterTestingModule,
        BpFilterViewModule,
        HttpClientModule,
        TaToastModule,
        TaSvgIconModule,
        TranslateModule.forRoot()
      ],
      providers: [
        RouterModule,
        {
          provide: DatagridHeaderService,
          useClass: MockDatagridHeaderService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatagridHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
