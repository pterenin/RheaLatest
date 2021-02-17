import { TestBed } from '@angular/core/testing';

import { ItSystemService } from './it-system.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('ItSystemService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ItSystemService = TestBed.get(ItSystemService);
    expect(service).toBeTruthy();
  });

  it('should call the correct creation endpoint', () => {
    const service: ItSystemService = TestBed.get(ItSystemService);

    const httpClient: HttpClient = TestBed.get(HttpClient);
    const postSpy = spyOn(httpClient, 'post');
    service.create();
    expect(postSpy).toHaveBeenCalledWith(`/api/hub/it-systems`, {});
  });
});
