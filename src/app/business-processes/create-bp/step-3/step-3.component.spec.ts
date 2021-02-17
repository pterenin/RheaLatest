import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StepContainerService } from '../step-container/step-container.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Step3Component } from './step-3.component';
import { PageFooterModule } from '../../../shared/components/page-footer-nav/page-footer-nav.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SelectedItemsContainerModule } from '../../../shared/components/selected-items-container/selected-items-container.module';
import { LabelBadgeModule } from '../../../shared/components/label-badge/label-badge.module';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaToastModule
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { DataSubjectsRecipientsService } from 'src/app/shared/services/data-subjects-recipients/data-subjects-recipients.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { LocationService } from 'src/app/shared/services/location/location.service';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';

describe('Step3Component', () => {
  let component: Step3Component;
  let fixture: ComponentFixture<Step3Component>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Step3Component],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        LabelBadgeModule,
        PageFooterModule,
        RouterTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{ path: '**', redirectTo: '' }]),
        SelectedItemsContainerModule,
        TaButtonsModule,
        TaCheckboxModule,
        TaDropdownModule,
        TaToastModule,
        TranslateModule.forRoot(),
        RiskFieldIndicatorModule
      ],
      providers: [
        StepContainerService,
        {
          provide: DataSubjectsRecipientsService,
          useValue: jasmine.createSpyObj(
            DataSubjectsRecipientsService.prototype
          )
        },
        { provide: FormBuilder, useValue: formBuilder },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              paramMap: of(convertToParamMap({ id: 'parent-Id-123' }))
            }
          }
        }
      ]
    }).compileComponents();

    const dataSubjectRecipientService = TestBed.get(
      DataSubjectsRecipientsService
    );
    dataSubjectRecipientService.getDataSubjectTypeList.and.returnValue(of([]));
    dataSubjectRecipientService.getDataRecipients.and.returnValue(of([]));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Step3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.step3Form = formBuilder.group({
      subjects: [],
      recipients: []
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data subjects data on init', () => {
    const locationService = TestBed.get(LocationService);
    const spy = spyOn(locationService, 'getFullCountryList').and.callThrough();

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  it('should fetch data access types data on init', () => {
    const locationService = TestBed.get(LocationService);
    const spy = spyOn(locationService, 'getFullCountryList').and.callThrough();

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });
});
