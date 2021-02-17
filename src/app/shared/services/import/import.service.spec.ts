import { TestBed } from '@angular/core/testing';

import { ImportService } from './import.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ImportService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ImportService = TestBed.get(ImportService);
    expect(service).toBeTruthy();
  });
});
