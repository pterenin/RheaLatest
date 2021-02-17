import { TestBed } from '@angular/core/testing';

import { Step6Service } from './step-6.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('Step6Service', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClient]
    })
  );

  it('should be created', () => {
    const service: Step6Service = TestBed.get(Step6Service);
    expect(service).toBeTruthy();
  });
});
