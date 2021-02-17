import { TestBed } from '@angular/core/testing';

import { ProcessingPurposeCategoriesService } from './processing-purpose-categories.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ProcessingPurposeCategoriesService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ProcessingPurposeCategoriesService = TestBed.get(
      ProcessingPurposeCategoriesService
    );
    expect(service).toBeTruthy();
  });
});
