import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessProcessWizardComponent } from './business-process-wizard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BusinessProcessWizardHeaderComponent } from './shared';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TaSvgIconModule,
  TaCheckboxModule,
  TaBadgeModule,
  TaModalModule
} from '@trustarc/ui-toolkit';
import { HttpClientModule } from '@angular/common/http';

describe('BusinessProcessWizardComponent', () => {
  let component: BusinessProcessWizardComponent;
  let fixture: ComponentFixture<BusinessProcessWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BusinessProcessWizardComponent,
        BusinessProcessWizardHeaderComponent
      ],
      imports: [
        RouterTestingModule,
        TaSvgIconModule,
        TaCheckboxModule,
        TaSvgIconModule,
        RouterTestingModule,
        TaModalModule,
        TaBadgeModule,
        HttpClientModule,
        ReactiveFormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessProcessWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
