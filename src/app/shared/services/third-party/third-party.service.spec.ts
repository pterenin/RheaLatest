import { TestBed } from '@angular/core/testing';

import { ThirdPartyService } from './third-party.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('ThirdPartyService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ThirdPartyService = TestBed.get(ThirdPartyService);
    expect(service).toBeTruthy();
  });

  it('should call the correct creation endpoint', () => {
    const service: ThirdPartyService = TestBed.get(ThirdPartyService);

    const httpClient: HttpClient = TestBed.get(HttpClient);
    const postSpy = spyOn(httpClient, 'post');
    service.create();
    expect(postSpy).toHaveBeenCalledWith(`/api/hub/third-parties`, {});
  });
});
