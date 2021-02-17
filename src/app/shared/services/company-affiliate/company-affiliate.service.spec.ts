import { TestBed } from '@angular/core/testing';

import { CompanyAffiliateService } from './company-affiliate.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('CompanyAffiliateService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: CompanyAffiliateService = TestBed.get(
      CompanyAffiliateService
    );
    expect(service).toBeTruthy();
  });

  it('should call the correct creation endpoint', () => {
    const service: CompanyAffiliateService = TestBed.get(
      CompanyAffiliateService
    );

    const httpClient: HttpClient = TestBed.get(HttpClient);
    const postSpy = spyOn(httpClient, 'post');
    service.create();
    expect(postSpy).toHaveBeenCalledWith(`/api/hub/company-affiliates`, {});
  });
});
