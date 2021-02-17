import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { StepContainerService } from '../step-container/step-container.service';
import { Step2Component } from './step-2.component';
import { PageFooterModule } from '../../../shared/components/page-footer-nav/page-footer-nav.module';
import { DropdownFieldModule } from '../../../shared/components/dropdown/dropdown-field.module';
import { CategoricalViewModule } from '../../../shared/components/categorical-view/categorical-view.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Step2Service } from './step-2.service';
import { TaToastModule } from '@trustarc/ui-toolkit';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Step2Component', () => {
  let component: Step2Component;
  let fixture: ComponentFixture<Step2Component>;
  let step2Service: Step2Service;
  const formBuilder: FormBuilder = new FormBuilder();
  let ownersDataMock;
  let entityDataMock;
  let departmentDataMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Step2Component],
      imports: [
        CategoricalViewModule,
        DropdownFieldModule,
        FormsModule,
        PageFooterModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{ path: '**', redirectTo: '' }]),
        HttpClientTestingModule,
        TaToastModule
      ],
      providers: [
        StepContainerService,
        Step2Service,
        {
          provide: ActivatedRoute,
          useValue: {
            paramsMap: of(convertToParamMap({ id: 'child-Id-123' })),
            parent: {
              paramMap: of(convertToParamMap({ id: 'parent-Id-123' }))
            }
          }
        },
        { provide: FormBuilder, useValue: formBuilder }
      ]
    }).compileComponents();

    step2Service = TestBed.get(Step2Service);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Step2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.step2Form = formBuilder.group({
      fullName: '',
      email: '',
      company: '',
      department: '',
      owningEntityRole: '',
      version: 0
    });

    ownersDataMock = {
      owner: {
        dimAccount: null,
        email: 'dfm-qa-auto+dfm.admin@trustarc.com',
        firstName: 'Dfm',
        id: '69c6e0e3-8967-4b01-a6d9-7346a29e410b',
        lastName: 'Autoadmin',
        name: 'Dfm Autoadmin'
      },
      owningCompanyEntity: {
        attachments: [],
        baseRecordAssessments: [],
        contact: null,
        contactType: null,
        created: 1556644017206,
        createdBy: null,
        createdByUser: null,
        description: '',
        entityRole: null,
        entityType: 'PRIMARY_ENTITY',
        id: 'b18cbb04-890b-4edc-b0e5-dc92327760cc',
        identifier: 'CS0000001',
        industrySector: null,
        internalId: null,
        lastModified: 1556644017206,
        lastModifiedBy: null,
        locations: [],
        name: 'UNTITLED',
        notes: null,
        owner: null,
        recordType: 'PrimaryEntity',
        tags: [],
        version: 0
      }
    };

    entityDataMock = {
      content: [
        {
          description: '',
          id: 'abb3191b-d6b7-4b49-b22e-81696a394147',
          identifier: 'CS0000002',
          name: 'UNTITLED',
          notes: null,
          version: 0
        },
        {
          description: '',
          id: 'b18cbb04-890b-4edc-b0e5-dc92327760cc',
          identifier: 'CS0000001',
          name: 'UNTITLED',
          notes: null,
          version: 0
        }
      ],
      first: true,
      last: true,
      number: 0,
      numberOfElements: 2,
      size: 20,
      sort: null,
      totalElements: 2,
      totalPages: 1
    };

    departmentDataMock = [
      {
        id: 'department-1',
        name: 'Department 1'
      },
      {
        id: 'department-2',
        name: 'Department 2'
      }
    ];

    spyOn(step2Service, 'getBpOwner').and.returnValue(of(ownersDataMock));
    spyOn(step2Service, 'getCompanyEntities').and.returnValue(
      of(entityDataMock)
    );
    spyOn(step2Service, 'getDepartments').and.returnValue(
      of(departmentDataMock)
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch owner data on init', () => {
    component.ngOnInit();
    expect(step2Service.getBpOwner).toHaveBeenCalled();
  });

  it('should fetch entities data on init', () => {
    component.ngOnInit();
    expect(step2Service.getCompanyEntities).toHaveBeenCalled();
  });

  it('should fetch department data on init', () => {
    component.ngOnInit();
    expect(step2Service.getDepartments).toHaveBeenCalled();
  });

  it('should save owner data on save', () => {
    const spy = spyOn(step2Service, 'saveOwner').and.callThrough();

    component.saveOwner();

    expect(spy).toHaveBeenCalled();
  });
});
