import { TestBed } from '@angular/core/testing';

import { ProcessingPurposeCategoryService } from './processing-purpose-category.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ProcessingPurposeCategoryService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ProcessingPurposeCategoryService = TestBed.get(
      ProcessingPurposeCategoryService
    );
    expect(service).toBeTruthy();
  });
});
