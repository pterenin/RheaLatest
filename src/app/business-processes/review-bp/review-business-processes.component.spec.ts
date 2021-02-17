import { ReviewBusinessProcessesComponent } from './review-business-processes.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { routes } from './review-business-processes-routing.module';
import { ReviewStepContainerComponent } from './review-step-container/review-step-container.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StepFinalReviewComponent } from './step-final-review/step-final-review.component';
import { PageHeaderTitleModule } from 'src/app/shared/components/page-header-title/page-header-title.module';
import { PageFooterModule } from 'src/app/shared/components/page-footer-nav/page-footer-nav.module';
import { PageNavModule } from 'src/app/shared/components/page-nav/page-nav.module';
import {
  TaAccordionModule,
  TaStepsModule,
  TaSvgIconModule,
  TaBadgeModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { ReviewTableModule } from './step-final-review/review-table/review-table.module';
import { HttpClientModule } from '@angular/common/http';
import { BusinessProcessWizardHeaderModule } from '../business-process-wizard/shared';
import { TaToastModule } from '@trustarc/ui-toolkit';

describe('ReviewBusinessProcessesComponent', () => {
  let component: ReviewBusinessProcessesComponent;
  let fixture: ComponentFixture<ReviewBusinessProcessesComponent>;
  let reviewStepContainerComponent: ReviewStepContainerComponent;
  let reviewStepContainerFixture: ComponentFixture<ReviewStepContainerComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReviewBusinessProcessesComponent,
        ReviewStepContainerComponent,
        StepFinalReviewComponent
      ],
      imports: [
        TaToastModule,
        BusinessProcessWizardHeaderModule,
        FormsModule,
        HttpClientModule,
        HttpClientTestingModule,
        PageFooterModule,
        PageHeaderTitleModule,
        PageNavModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes),
        TaAccordionModule,
        DropdownFieldModule,
        ReviewTableModule,
        TaStepsModule,
        TaSvgIconModule,
        TaBadgeModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: convertToParamMap({ id: 'created-id-123' }),
            parent: {
              paramMap: of(convertToParamMap({ id: 'created-parent-Id-123' }))
            }
          }
        },
        ToastService
      ]
    }).compileComponents();

    router = TestBed.get(Router);
    location = TestBed.get(Location);
    router.initialNavigation();
  }));

  beforeEach(() => {
    reviewStepContainerFixture = TestBed.createComponent(
      ReviewStepContainerComponent
    );
    reviewStepContainerComponent = reviewStepContainerFixture.componentInstance;
    reviewStepContainerFixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewBusinessProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Create page', () => {
    expect(component).toBeTruthy();
  });

  it('should create Step Container', () => {
    expect(reviewStepContainerComponent).toBeTruthy();
  });
});
