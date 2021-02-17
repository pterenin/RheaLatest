import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StepContainerService } from '../step-container/step-container.service';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { Step4Component } from './step-4.component';
import { PageFooterModule } from '../../../shared/components/page-footer-nav/page-footer-nav.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateBusinessProcessesService } from '../create-business-processes.service';
import { SelectedItemsContainerModule } from '../../../shared/components/selected-items-container/selected-items-container.module';
import { LabelBadgeModule } from '../../../shared/components/label-badge/label-badge.module';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaToastModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Step4Service } from './step-4.service';

// tsline:disable-next-line
import { Step4ItemsModule } from 'src/app/shared/components/step-4-selected-items-container/step-4-selected-items-container.module';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';

describe('Step4Component', () => {
  let component: Step4Component;
  let fixture: ComponentFixture<Step4Component>;
  let createBusinessProcessesService: CreateBusinessProcessesService;
  const formBuilder: FormBuilder = new FormBuilder();
  let dataItemsCategoryMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Step4Component],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        LabelBadgeModule,
        PageFooterModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{ path: '**', redirectTo: '' }]),
        SelectedItemsContainerModule,
        Step4ItemsModule,
        TaButtonsModule,
        TaCheckboxModule,
        TaDropdownModule,
        TaToastModule,
        RiskFieldIndicatorModule,
        TaSvgIconModule
      ],
      providers: [
        StepContainerService,
        CreateBusinessProcessesService,
        Step4Service,
        { provide: FormBuilder, useValue: formBuilder },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              paramMap: of(convertToParamMap({ id: 'parent-Id-123' }))
            }
          }
        },
        CreateBusinessProcessesService,
        { provide: FormBuilder, useValue: formBuilder },
        StepContainerService
      ]
    }).compileComponents();

    createBusinessProcessesService = TestBed.get(
      CreateBusinessProcessesService
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Step4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dataItemsCategoryMock = [
      {
        id: '00001',
        label: 'Company Owned',
        items: [
          {
            id: '001',
            label: 'AM',
            tag: 'internal',
            isSelected: false
          },
          {
            id: '002',
            label: 'DFM',
            tag: 'internal',
            isSelected: false
          }
        ]
      },
      {
        id: '00002',
        label: 'Affiliates',
        items: [
          {
            id: '001',
            label: 'Dell',
            tag: 'affiliate',
            isSelected: false
          },
          {
            id: '002',
            label: 'IBM',
            tag: 'affiliate',
            isSelected: false
          }
        ]
      }
    ];

    spyOn(createBusinessProcessesService, 'getItSystems').and.returnValue(
      of(dataItemsCategoryMock)
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
