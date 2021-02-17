import { TestBed } from '@angular/core/testing';

import { DataSubjectDetailsService } from './data-subject-details.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DataSubjectDetailsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: DataSubjectDetailsService = TestBed.get(
      DataSubjectDetailsService
    );
    expect(service).toBeTruthy();
  });
});
