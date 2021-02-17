import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataInventoryCardTableBodyComponent } from './data-inventory-card-table-body.component';
import {
  TaCheckboxModule,
  TaSvgIconModule,
  TaTableModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DataInventoryCardTableBodyComponent', () => {
  let component: DataInventoryCardTableBodyComponent;
  let fixture: ComponentFixture<DataInventoryCardTableBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataInventoryCardTableBodyComponent],
      imports: [
        CommonModule,
        TaSvgIconModule,
        TaTableModule,
        TaCheckboxModule,
        TaTooltipModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataInventoryCardTableBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
