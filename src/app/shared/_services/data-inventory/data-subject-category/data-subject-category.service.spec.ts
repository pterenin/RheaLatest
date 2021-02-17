import { TestBed } from '@angular/core/testing';

import { DataSubjectCategoryService } from './data-subject-category.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('DataSubjectCategoryService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: DataSubjectCategoryService = TestBed.get(
      DataSubjectCategoryService
    );
    expect(service).toBeTruthy();
  });
});
