import { TestBed } from '@angular/core/testing';

import { CompanyAffiliateControllerService } from './company-affiliate-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CompanyAffiliateControllerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: CompanyAffiliateControllerService = TestBed.get(
      CompanyAffiliateControllerService
    );
    expect(service).toBeTruthy();
  });
});
