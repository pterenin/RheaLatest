import { CreateBusinessProcessesComponent } from './create-business-processes.component';
import { CreateBusinessProcessesService } from './create-business-processes.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HighchartsContainerModule } from '../../shared/components/highcharts-container/highcharts-container.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from './create-business-processes-routing.module';
import { Step1Component } from './step-1/step-1.component';
import { Step1Service } from './step-1/step-1.service';
import { Step2Component } from './step-2/step-2.component';
import { Step2Service } from './step-2/step-2.service';
import { Step3Component } from './step-3/step-3.component';
import { Step4Component } from './step-4/step-4.component';
import { BuildDataFlowComponent } from './build-data-flow/build-data-flow.component';
import { DataFlowService } from './build-data-flow/buld-data-flow.service';
import { Step6Component } from './step-6/step-6.component';
import { StepContainerComponent } from './step-container/step-container.component';
import { StepContainerService } from './step-container/step-container.service';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaProgressbarModule,
  TaTabsetModule,
  TaToastModule,
  TaTooltipModule,
  TaSvgIconModule,
  TaPopoverModule,
  ToastService,
  TaStepsModule,
  TaBadgeModule,
  TaTagsModule
} from '@trustarc/ui-toolkit';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseRecordFileUploadModule } from 'src/app/shared/components/base-record-file-upload/base-record-file-upload.module';

import { MockModule, MockComponents } from 'ng-mocks';
import { TagsSelectorComponent } from 'src/app/shared/components/tags-selector/tags-selector.component';
import { Step4ItemsComponent } from 'src/app/shared/components/step-4-selected-items-container/step-4-selected-items-container.component';
import { SelectedItemsContainerComponent } from 'src/app/shared/components/selected-items-container/selected-items-container.component';
import { PageNavComponent } from 'src/app/shared/components/page-nav/page-nav.component';
import { PageHeaderTitleComponent } from 'src/app/shared/components/page-header-title/page-header-title.component';
import { PageFooterNavComponent } from 'src/app/shared/components/page-footer-nav/page-footer-nav.component';
import { LabelBadgeComponent } from 'src/app/shared/components/label-badge/label-badge.component';
import { InfoModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';
import { DropdownFieldComponent } from 'src/app/shared/components/dropdown/dropdown-field.component';
import { CategoricalViewComponent } from 'src/app/shared/components/categorical-view/categorical-view.component';

/* Do NOT remove these imports; there is something really weird in how they work; removing them breaks the tests */
import { ReplacePipeModule } from 'src/app/shared/pipes/replace/replace.module';
import { DataFlowPopoverComponent } from './build-data-flow/data-flow-popover/data-flow-popover.component';
import { DataFlowSelectedItemsComponent } from './build-data-flow/data-flow-selected-items/data-flow-selected-items.component';
import { DataFlowDropdownComponent } from './build-data-flow/data-flow-dropdown/data-flow-dropdown.component';
import { DataFlowDropdownLabelComponent } from './build-data-flow/data-flow-dropdown-label/data-flow-dropdown-label.component';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';

// import { LocationModule } from 'src/app/shared/components/location/location.module';

describe('CreateBusinessProcessesComponent', () => {
  let component: CreateBusinessProcessesComponent;
  let fixture: ComponentFixture<CreateBusinessProcessesComponent>;
  let step1Component: Step1Component;
  let step1Fixture: ComponentFixture<Step1Component>;
  let step2Component: Step2Component;
  let step2Fixture: ComponentFixture<Step2Component>;
  let step3Component: Step3Component;
  let step3Fixture: ComponentFixture<Step3Component>;
  let step4Component: Step4Component;
  let step4Fixture: ComponentFixture<Step4Component>;
  let buildDataFlowComponent: BuildDataFlowComponent;
  let buildDataFlowFixture: ComponentFixture<BuildDataFlowComponent>;
  let stepContainerComponent: StepContainerComponent;
  let stepContainerFixture: ComponentFixture<StepContainerComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateBusinessProcessesComponent,
        Step1Component,
        Step2Component,
        Step3Component,
        Step4Component,
        BuildDataFlowComponent,
        DataFlowPopoverComponent,
        DataFlowSelectedItemsComponent,
        DataFlowDropdownComponent,
        DataFlowDropdownLabelComponent,
        Step6Component,
        StepContainerComponent,
        ...MockComponents(
          CategoricalViewComponent,
          DropdownFieldComponent,
          InfoModalComponent,
          LabelBadgeComponent,
          PageFooterNavComponent,
          PageHeaderTitleComponent,
          PageNavComponent,
          SelectedItemsContainerComponent,
          Step4ItemsComponent,
          TagsSelectorComponent
        )
      ],
      imports: [
        BaseRecordFileUploadModule,
        FormsModule,
        HighchartsContainerModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes),
        MockModule(ReplacePipeModule),
        MockModule(TaButtonsModule),
        MockModule(TaCheckboxModule),
        MockModule(TaDropdownModule),
        MockModule(TaProgressbarModule),
        MockModule(TaSvgIconModule),
        MockModule(TaTabsetModule),
        MockModule(TaToastModule),
        MockModule(TaTooltipModule),
        MockModule(TaPopoverModule),
        MockModule(TaStepsModule),
        MockModule(TranslateModule),
        MockModule(TaTagsModule),
        MockModule(TaBadgeModule),
        TranslateModule.forRoot(),
        RiskFieldIndicatorModule
      ],
      providers: [
        CreateBusinessProcessesService,
        StepContainerService,
        Step1Service,
        DataFlowService,
        Step2Service,
        ToastService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: convertToParamMap({ id: 'created-id-123' }),
            parent: {
              paramMap: of(convertToParamMap({ id: 'created-parent-Id-123' }))
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    router = TestBed.get(Router);
    location = TestBed.get(Location);
    router.initialNavigation();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBusinessProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    step1Fixture = TestBed.createComponent(Step1Component);
    step1Component = step1Fixture.componentInstance;
    step1Fixture.detectChanges();
  });

  beforeEach(() => {
    step2Fixture = TestBed.createComponent(Step2Component);
    step2Component = step2Fixture.componentInstance;
    step2Fixture.detectChanges();
  });

  beforeEach(() => {
    step3Fixture = TestBed.createComponent(Step3Component);
    step3Component = step3Fixture.componentInstance;
    step3Fixture.detectChanges();
  });

  beforeEach(() => {
    step4Fixture = TestBed.createComponent(Step4Component);
    step4Component = step4Fixture.componentInstance;
    step4Fixture.detectChanges();
  });

  beforeEach(() => {
    buildDataFlowFixture = TestBed.createComponent(BuildDataFlowComponent);
    buildDataFlowComponent = buildDataFlowFixture.componentInstance;
    buildDataFlowFixture.detectChanges();
  });

  beforeEach(() => {
    stepContainerFixture = TestBed.createComponent(StepContainerComponent);
    stepContainerComponent = stepContainerFixture.componentInstance;
    stepContainerFixture.detectChanges();
  });

  it('should create Create page', () => {
    expect(component).toBeTruthy();
  });

  it('should create Step 1 page', () => {
    expect(step1Component).toBeTruthy();
  });

  it('should create Step 2 page', () => {
    expect(step2Component).toBeTruthy();
  });

  it('should create Step 3 page', () => {
    expect(step3Component).toBeTruthy();
  });

  it('should create Step 4 page', () => {
    expect(step4Component).toBeTruthy();
  });

  it('should create Data Flow page', () => {
    expect(buildDataFlowComponent).toBeTruthy();
  });

  it('should create Step Container', () => {
    expect(stepContainerComponent).toBeTruthy();
  });
});
