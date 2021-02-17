import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatagridAddBpButtonComponent } from './datagrid-add-bp-button.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TaModal, TaToastModule, ToastService } from '@trustarc/ui-toolkit';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CreateBusinessProcessesService } from 'src/app/business-processes/create-bp/create-business-processes.service';
import { CollaboratorsService } from 'src/app/shared/services/collaborators/collaborators.service';
import { Step1Service } from 'src/app/business-processes/create-bp/step-1/step-1.service';
import { BusinessProcessService } from 'src/app/shared/services/business-process/business-process.service';
import { FeatureFlagAllInterface } from 'src/app/shared/_interfaces';

describe('DatagridAddBpButtonComponent', () => {
  let component: DatagridAddBpButtonComponent;
  let fixture: ComponentFixture<DatagridAddBpButtonComponent>;
  let router: Router;
  let toastService: ToastService;
  let mockBusinessProcess;
  const mockBehaviorSubjectObservable = new BehaviorSubject(
    false
  ).asObservable();

  class MockCreateBusinessProcessesService {
    createBusinessProcessesDisabledObservable: Observable<
      boolean
    > = mockBehaviorSubjectObservable;
    createBusinessProcess() {
      return from([mockBusinessProcess]);
    }
    disableCreateBusinessProcesses() {}
  }

  beforeEach(async(() => {
    mockBusinessProcess = {
      id: 'test-id-123'
    };

    TestBed.configureTestingModule({
      declarations: [DatagridAddBpButtonComponent],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        TaToastModule
      ],
      providers: [
        {
          provide: CollaboratorsService,
          useValue: jasmine.createSpyObj(CollaboratorsService.prototype)
        },
        CreateBusinessProcessesService,
        BusinessProcessService,
        ToastService,
        {
          provide: TaModal,
          useValue: {
            open: () => {
              return {
                componentInstance: {},
                result: { then: () => {} }
              };
            }
          }
        },
        {
          provide: Step1Service,
          useValue: {
            updateBusinessProcess: bp => of({ id: bp.id, version: bp.version })
          }
        },
        {
          provide: CreateBusinessProcessesService,
          useClass: MockCreateBusinessProcessesService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatagridAddBpButtonComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    toastService = TestBed.get(ToastService);

    spyOn(BusinessProcessService.prototype, 'create').and.callFake(() => {
      return from([mockBusinessProcess]);
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call service to create new business process', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const mockLicense: FeatureFlagAllInterface = {
      RHEA_NEW_UI_STEPS_12_LICENSE: false
    };
    component['_featureLicenses'] = mockLicense;
    const onClickCreateBusinessProcessSpy = spyOn(
      component,
      'onClickCreateBusinessProcess'
    ).and.callThrough();
    fixture.detectChanges();
    expect(component.onClickCreateBusinessProcess).toBeTruthy();
    component.onClickCreateBusinessProcess();
    expect(navigateSpy).toHaveBeenCalledWith([
      'business-process/test-id-123/background'
    ]);
  });

  it('should show the user an error message in a toast when the server triggers an error ', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const toastServiceErrorSpy = spyOn(toastService, 'error');

    BusinessProcessService.prototype.create = jasmine
      .createSpy()
      .and.callFake(() => {
        return throwError('test error 789');
      });

    /*
    spyOn(BusinessProcessService.prototype, 'create').and.callFake(() => {
      return throwError('test error 789');
    });
    */

    expect(component.onClickCreateBusinessProcess).toBeTruthy();
    component.onClickCreateBusinessProcess();
    expect(navigateSpy).toHaveBeenCalledTimes(0);
    expect(toastServiceErrorSpy).toHaveBeenCalledTimes(1);
    expect(component.createBusinessProcessButtonDisabledFlag).toBeFalsy();
  });
});
