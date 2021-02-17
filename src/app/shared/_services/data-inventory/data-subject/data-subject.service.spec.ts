import { TestBed } from '@angular/core/testing';

import { DataSubjectService } from './data-subject.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('DataSubjectService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: DataSubjectService = TestBed.get(DataSubjectService);
    expect(service).toBeTruthy();
  });
});
