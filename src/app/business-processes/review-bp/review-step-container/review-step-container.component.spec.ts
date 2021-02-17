import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewStepContainerService } from './review-step-container.service';

import { ReviewStepContainerComponent } from './review-step-container.component';
import { PageFooterModule } from '../../../shared/components/page-footer-nav/page-footer-nav.module';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';

describe('StepContainerComponent', () => {
  let component: ReviewStepContainerComponent;
  let fixture: ComponentFixture<ReviewStepContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewStepContainerComponent],
      imports: [PageFooterModule, RouterModule, RouterTestingModule],
      providers: [ReviewStepContainerService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewStepContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
