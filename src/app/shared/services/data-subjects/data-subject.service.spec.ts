import { TestBed } from '@angular/core/testing';

import { DataSubjectsService } from './data-subjects.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('DataSubjectsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: DataSubjectsService = TestBed.get(DataSubjectsService);
    expect(service).toBeTruthy();
  });
});
