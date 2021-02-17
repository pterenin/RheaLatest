import { TestBed } from '@angular/core/testing';

import { DataElementCategoryService } from './data-element-category.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('DataElementCategoryService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: DataElementCategoryService = TestBed.get(
      DataElementCategoryService
    );
    expect(service).toBeTruthy();
  });
});
