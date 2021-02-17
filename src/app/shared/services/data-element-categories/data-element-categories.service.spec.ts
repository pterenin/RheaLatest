import { TestBed } from '@angular/core/testing';

import { DataElementCategoriesService } from './data-element-categories.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('DataElementsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: DataElementCategoriesService = TestBed.get(
      DataElementCategoriesService
    );
    expect(service).toBeTruthy();
  });
});
