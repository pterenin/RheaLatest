import { TestBed } from '@angular/core/testing';

import { ProcessingPurposeService } from './processing-purpose.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ProcessingPurposesService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ProcessingPurposeService = TestBed.get(
      ProcessingPurposeService
    );
    expect(service).toBeTruthy();
  });
});
