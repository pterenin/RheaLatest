import { TestBed } from '@angular/core/testing';

import { PageConfigControllerService } from './page-config-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PageConfigControllerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: PageConfigControllerService = TestBed.get(
      PageConfigControllerService
    );
    expect(service).toBeTruthy();
  });
});
