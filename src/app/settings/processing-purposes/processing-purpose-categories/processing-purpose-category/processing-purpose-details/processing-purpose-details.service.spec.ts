import { TestBed } from '@angular/core/testing';

import { ProcessingPurposeDetailsService } from './processing-purpose-details.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProcessingPurposeDetailsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ProcessingPurposeDetailsService = TestBed.get(
      ProcessingPurposeDetailsService
    );
    expect(service).toBeTruthy();
  });
});
