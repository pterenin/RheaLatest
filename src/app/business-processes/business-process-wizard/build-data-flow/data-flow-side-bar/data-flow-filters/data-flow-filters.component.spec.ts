import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { DataFlowFiltersComponent } from './data-flow-filters.component';
import {
  TaDropdownModule,
  TaPopoverModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { SystemRecordFilterComponent } from '../../../shared';
import { ReactiveFormsModule } from '@angular/forms';

describe('DataFlowFiltersComponent', () => {
  let component: DataFlowFiltersComponent;
  let fixture: ComponentFixture<DataFlowFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataFlowFiltersComponent, SystemRecordFilterComponent],
      imports: [
        TaPopoverModule,
        ReactiveFormsModule,
        TaSvgIconModule,
        TaDropdownModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFlowFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
