import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  TaSvgIconModule,
  TaTableModule,
  TaCheckboxModule,
  TaDropdownModule
} from '@trustarc/ui-toolkit';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SystemRecordTabTableComponent } from './system-record-tab-table.component';

describe('SystemRecordTabTableComponent', () => {
  let component: SystemRecordTabTableComponent;
  let fixture: ComponentFixture<SystemRecordTabTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemRecordTabTableComponent],
      imports: [
        TaSvgIconModule,
        TaTableModule,
        TaCheckboxModule,
        TaDropdownModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRecordTabTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
