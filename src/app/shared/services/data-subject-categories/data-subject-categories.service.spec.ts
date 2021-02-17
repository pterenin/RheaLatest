import { TestBed } from '@angular/core/testing';

import { DataSubjectCategoriesService } from './data-subject-categories.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('DataSubjectCategoriesService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: DataSubjectCategoriesService = TestBed.get(
      DataSubjectCategoriesService
    );
    expect(service).toBeTruthy();
  });
});
