import { TestBed } from '@angular/core/testing';

import { ProcessingPurposesService } from './processing-purposes.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ProcessingPurposesService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ProcessingPurposesService = TestBed.get(
      ProcessingPurposesService
    );
    expect(service).toBeTruthy();
  });
});
