import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AllBusinessProcessesComponent } from './all-business-processes.component';
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
import { CreateBusinessProcessesService } from '../create-bp/create-business-processes.service';
import { DatagridHeaderModule } from 'src/app/shared/components/record-datagrid/datagrid-header/datagrid-header.module';
import { DatagridFooterModule } from 'src/app/shared/components/record-datagrid/datagrid-footer/datagrid-footer.module';
import { FeatureFlagControllerService } from '../../shared/_services/rest-api';
import { BusinessProcessesListModule } from 'src/app/business-processes/all-bp/business-processes-list/business-processes-list.module';

describe('AllBusinessProcessesComponent', () => {
  let component: AllBusinessProcessesComponent;
  let fixture: ComponentFixture<AllBusinessProcessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllBusinessProcessesComponent],
      imports: [
        RouterTestingModule,
        PageWrapperModule,
        TranslateModule.forRoot(),
        RecordDatagridModule,
        BusinessProcessesListModule,
        HttpClientTestingModule,
        DatagridHeaderModule,
        DatagridFooterModule,
        TaPaginationModule,
        TaToastModule
      ],
      providers: [
        CreateBusinessProcessesService,
        ToastService,
        FeatureFlagControllerService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBusinessProcessesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
