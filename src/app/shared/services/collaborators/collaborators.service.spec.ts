import { TestBed } from '@angular/core/testing';

import { CollaboratorsService } from './collaborators.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('CollaboratorsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: CollaboratorsService = TestBed.get(CollaboratorsService);
    expect(service).toBeTruthy();
  });

  it('should call the correct creation endpoint', () => {
    const id = 'test-id-5432';
    const service: CollaboratorsService = TestBed.get(CollaboratorsService);

    const httpClient: HttpClient = TestBed.get(HttpClient);
    const postSpy = spyOn(httpClient, 'post');
    const request = {
      message: 'test message abc',
      userIds: ['user-id-999']
    };
    service.add(id, request);
    expect(postSpy).toHaveBeenCalledWith(
      `/api/hub/base-records/${id}/collaborators`,
      request
    );
  });
});
