import { TestBed } from '@angular/core/testing';

import { FeatureFlagControllerService } from './feature-flag-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FeatureFlagControllerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: FeatureFlagControllerService = TestBed.get(
      FeatureFlagControllerService
    );
    expect(service).toBeTruthy();
  });
});
