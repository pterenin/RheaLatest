import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { ReviewStepContainerService } from '../review-step-container/review-step-container.service';
import { StepFinalReviewComponent } from './step-final-review.component';
import { PageFooterModule } from '../../../shared/components/page-footer-nav/page-footer-nav.module';
import { DropdownFieldModule } from '../../../shared/components/dropdown/dropdown-field.module';
import { CategoricalViewModule } from '../../../shared/components/categorical-view/categorical-view.module';
import { RouterTestingModule } from '@angular/router/testing';
import { StepFinalReviewService } from './step-final-review.service';
import { ToastService, TaAccordionModule } from '@trustarc/ui-toolkit';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import {
  HttpClientModule,
  HttpClient,
  HttpHandler
} from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClipboardModule } from 'ngx-clipboard';
import { ReviewTableModule } from './review-table/review-table.module';

describe('StepFinalReviewComponent', () => {
  let component: StepFinalReviewComponent;
  let fixture: ComponentFixture<StepFinalReviewComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  let stepFinalReviewService: StepFinalReviewService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StepFinalReviewComponent],
      imports: [
        CategoricalViewModule,
        ClipboardModule,
        DropdownFieldModule,
        FormsModule,
        PageFooterModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TaAccordionModule,
        ReviewTableModule
      ],
      providers: [
        HttpClient,
        HttpHandler,
        HttpClientModule,
        HttpClientTestingModule,
        ReviewStepContainerService,
        StepFinalReviewService,
        ToastService,
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

    stepFinalReviewService = TestBed.get(StepFinalReviewService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepFinalReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
