import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Step6Component } from './step-6.component';
import {
  TaSvgIconModule,
  TaTooltipModule,
  TaCheckboxModule,
  TaToastModule,
  TaBadgeModule
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectedItemsContainerModule } from 'src/app/shared/components/selected-items-container/selected-items-container.module';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';
import { BusinessProcessWizardHeaderModule } from '../../business-process-wizard/shared';

describe('Step6Component', () => {
  let component: Step6Component;
  let fixture: ComponentFixture<Step6Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Step6Component],
      imports: [
        BusinessProcessWizardHeaderModule,
        DropdownFieldModule,
        FormsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterModule,
        RouterTestingModule.withRoutes([{ path: '**', redirectTo: '' }]),
        SelectedItemsContainerModule,
        TaCheckboxModule,
        TaSvgIconModule,
        TaToastModule,
        TaTooltipModule,
        TaBadgeModule,
        RiskFieldIndicatorModule
      ],
      providers: [HttpClient]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Step6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
