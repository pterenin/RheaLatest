import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { StepContainerService } from '../step-container/step-container.service';
import { Step1Service } from './step-1.service';
import { HttpClientModule } from '@angular/common/http';
import {
  ToastService,
  TaSvgIconModule,
  TaBadgeModule
} from '@trustarc/ui-toolkit';
import { Step1Component } from './step-1.component';
import { PageFooterModule } from '../../../shared/components/page-footer-nav/page-footer-nav.module';
import { DropdownFieldModule } from '../../../shared/components/dropdown/dropdown-field.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { TagsSelectorModule } from 'src/app/shared/components/tags-selector/tags-selector.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BaseRecordFileUploadModule } from 'src/app/shared/components/base-record-file-upload/base-record-file-upload.module';
import { BaseRecordFileUploadService } from 'src/app/shared/components/base-record-file-upload/base-record-file-upload.service';
import { BusinessProcessWizardHeaderModule } from '../../business-process-wizard/shared';

describe('Step1Component', () => {
  let component: Step1Component;
  let fixture: ComponentFixture<Step1Component>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Step1Component],
      imports: [
        BusinessProcessWizardHeaderModule,
        BaseRecordFileUploadModule,
        DropdownFieldModule,
        FormsModule,
        HttpClientModule,
        HttpClientTestingModule,
        PageFooterModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{ path: '**', redirectTo: '' }]),
        TagsSelectorModule,
        TaSvgIconModule,
        TaBadgeModule
      ],
      providers: [
        {
          provide: BaseRecordFileUploadService,
          useValue: {
            update: () => of({}),
            setFileUploadFormArray: () => {},
            setSaveOnEveryChange: () => {},
            isDeletingFile: new BehaviorSubject<boolean>(false)
          }
        },
        Step1Service,
        StepContainerService,
        ToastService,
        { provide: FormBuilder, useValue: formBuilder },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              paramMap: of(convertToParamMap({ id: 'parent-Id-123' }))
            }
          }
        },
        {
          provide: Step1Service,
          useValue: {
            getBusinessProcess: () =>
              of({
                dataSubjectVolume: {
                  id: 'id'
                }
              }),
            getDataSubjectVolumes: () => of([])
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Step1Component);
    component = fixture.componentInstance;
    component.step1Form = formBuilder.group({
      id: null,
      version: null,
      name: null,
      purpose: null,
      range: null,
      description: null,
      dataSubjectVolume: { name: 'Loading...' }, // [i18n-tobeinternationalized]
      notes: null,
      files: null,
      fileForms: formBuilder.array([]),
      customField1: null,
      customField2: null
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getData method should not brake if not correct attributes provided', () => {
    expect(component.getData('test', 'getTest')).toBe(undefined);
    expect(component.getData(null, null)).toBe(undefined);
    expect(component.getData(undefined, undefined)).toBe(undefined);
  });
});
