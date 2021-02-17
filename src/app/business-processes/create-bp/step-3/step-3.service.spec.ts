import { TestBed } from '@angular/core/testing';

import { Step3Service } from './step-3.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Step3Service', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: Step3Service = TestBed.get(Step3Service);
    expect(service).toBeTruthy();
  });
});
