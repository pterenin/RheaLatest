import { TestBed } from '@angular/core/testing';

import { DataElementDetailsService } from './data-element-details.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DataElementDetailsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: DataElementDetailsService = TestBed.get(
      DataElementDetailsService
    );
    expect(service).toBeTruthy();
  });
});
