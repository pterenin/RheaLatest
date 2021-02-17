import { TestBed } from '@angular/core/testing';

import { ThirdPartyControllerService } from './third-party-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ThirdPartyControllerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ThirdPartyControllerService = TestBed.get(
      ThirdPartyControllerService
    );
    expect(service).toBeTruthy();
  });
});
