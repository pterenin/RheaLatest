import { TestBed } from '@angular/core/testing';

import { HighRiskService } from './high-risk.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ProcessingPurposeCategoriesService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: HighRiskService = TestBed.get(HighRiskService);
    expect(service).toBeTruthy();
  });
});
