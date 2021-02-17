import { TestBed } from '@angular/core/testing';

import { BusinessProcessControllerService } from './business-process-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BusinessProcessControllerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: BusinessProcessControllerService = TestBed.get(
      BusinessProcessControllerService
    );
    expect(service).toBeTruthy();
  });
});
