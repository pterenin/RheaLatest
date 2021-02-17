import { TestBed } from '@angular/core/testing';

import { BusinessProcessService } from './business-process.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('BusinessProcessService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: BusinessProcessService = TestBed.get(BusinessProcessService);
    expect(service).toBeTruthy();
  });

  it('should call the correct creation endpoint', () => {
    const service: BusinessProcessService = TestBed.get(BusinessProcessService);

    const httpClient: HttpClient = TestBed.get(HttpClient);
    const postSpy = spyOn(httpClient, 'post').and.callThrough();
    service.create();
    expect(postSpy).toHaveBeenCalledWith(`/api/hub/business-processes`, {});
  });

  it('should disable create button to prevent double clicks while new BP is being created', () => {
    const service: BusinessProcessService = TestBed.get(BusinessProcessService);
    const httpClient: HttpClient = TestBed.get(HttpClient);
    const postSpy = spyOn(httpClient, 'post').and.returnValue(
      of({ id: '123', version: 0 })
    );

    const setDisabledFlagSpy = spyOn(
      service,
      'disableCreateBusinessProcesses'
    ).and.callThrough();

    service.create().subscribe();

    // The following assertions check that the create button is disabled until the server responds.
    expect(setDisabledFlagSpy).toHaveBeenCalledTimes(2);
    expect(setDisabledFlagSpy).toHaveBeenCalledWith(true);
    expect(setDisabledFlagSpy).toHaveBeenCalledWith(false);
    const disableButtonCall = setDisabledFlagSpy.calls.all()[0];
    const enableButtonCall = setDisabledFlagSpy.calls.all()[1];
    const postCall = postSpy.calls.first();
    expect(disableButtonCall['invocationOrder']).toBeLessThan(
      postCall['invocationOrder'],
      'Button should be disabled before the server is called'
    );
    expect(postCall['invocationOrder']).toBeLessThan(
      enableButtonCall['invocationOrder'],
      'Button should be enabled after the server is called'
    );
  });
});
