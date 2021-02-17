import { TestBed, async } from '@angular/core/testing';
import { StepFinalReviewService } from './step-final-review.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ToastService } from '@trustarc/ui-toolkit';

describe('StepFinalReviewService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [StepFinalReviewService, ToastService]
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: StepFinalReviewService = TestBed.get(StepFinalReviewService);
    expect(service).toBeTruthy();
  });
});
