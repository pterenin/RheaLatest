import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryCompanyDetailsComponent } from './primary-company-details';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';
import { TaToastModule, ToastService } from '@trustarc/ui-toolkit';

describe('PrimaryCompanyDetailsComponent', () => {
  let component: PrimaryCompanyDetailsComponent;
  let fixture: ComponentFixture<PrimaryCompanyDetailsComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrimaryCompanyDetailsComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        RiskFieldIndicatorModule,
        TaToastModule
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        DataInventoryService,
        ToastService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryCompanyDetailsComponent);
    component = fixture.componentInstance;
    component.detailsForm = formBuilder.group({
      notes: ''
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
