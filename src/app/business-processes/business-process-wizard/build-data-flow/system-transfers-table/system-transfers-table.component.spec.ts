import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SystemTransfersTableComponent } from './system-transfers-table.component';
import {
  TaAccordionModule,
  TaButtonsModule,
  TaDropdownModule,
  TaModalModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaTableModule,
  TaTabsetModule,
  TaCheckboxModule,
  TaToastModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { LocationPipeModule } from 'src/app/shared/pipes/location/location.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataFlowPipeModule } from 'src/app/shared/pipes/data-flow/data-flow.module';
import { PopoverFilterBodyComponent } from 'src/app/business-processes/business-process-wizard/shared';
import { RouterTestingModule } from '@angular/router/testing';

describe('SystemTransfersTableComponent', () => {
  let component: SystemTransfersTableComponent;
  let fixture: ComponentFixture<SystemTransfersTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemTransfersTableComponent, PopoverFilterBodyComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        LocationPipeModule,
        TaDropdownModule,
        TaSvgIconModule,
        TaPopoverModule,
        TaButtonsModule,
        TaAccordionModule,
        TaTableModule,
        TaTabsetModule,
        TaCheckboxModule,
        TaModalModule,
        TaToastModule,
        DataFlowPipeModule
      ],
      providers: [ToastService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemTransfersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
