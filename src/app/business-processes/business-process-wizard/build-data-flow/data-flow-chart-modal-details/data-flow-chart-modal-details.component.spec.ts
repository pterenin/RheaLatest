import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TableService, TaTooltipModule } from '@trustarc/ui-toolkit';
import { DataFlowChartModalDetailsComponent } from './data-flow-chart-modal-details.component';
import {
  PopoverFilterBodySimpleListComponent,
  PopoverFilterWrapperComponent
} from 'src/app/business-processes/business-process-wizard/shared';
import { CollectionPipeModule } from 'src/app/shared/pipes/collection/collection.module';
import { FilterByArrayPipeModule } from 'src/app/shared/_pipes/filter-by-array-pipe/filter-by-array-pipe.module';
import { ReactiveFormsModule } from '@angular/forms';

describe('DataFlowChartModalDetailsComponent', () => {
  let component: DataFlowChartModalDetailsComponent;
  let fixture: ComponentFixture<DataFlowChartModalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataFlowChartModalDetailsComponent,
        PopoverFilterWrapperComponent,
        PopoverFilterBodySimpleListComponent
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TaTooltipModule,
        CollectionPipeModule,
        FilterByArrayPipeModule
      ],
      providers: [TableService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFlowChartModalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
