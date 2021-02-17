import { TestBed, async } from '@angular/core/testing';

import { CreateBusinessProcessesModule } from '../create-business-processes.module';
import { Step1Service } from './step-1.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BusinessProcessInterface } from '../create-business-processes.model';
import { of } from 'rxjs';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';

describe('Step1Service', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CreateBusinessProcessesModule,
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [Step1Service]
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: Step1Service = TestBed.get(Step1Service);
    expect(service).toBeTruthy();
  });

  describe('updateBusinessProcess', () => {
    it('should correctly map the response', () => {
      const service: Step1Service = TestBed.get(Step1Service);

      const testRequest = {
        id: 'test-id-345',
        version: 1
      } as BusinessProcessInterface;

      const mockResponse = {
        id: 'test-id-345',
        version: 2
      } as BaseDomainInterface;

      const expectedResponse = {
        id: 'test-id-345',
        version: 2
      } as BaseDomainInterface;

      const httpClientPutSpy = spyOn(HttpClient.prototype, 'put').and.callFake(
        () => {
          return of(mockResponse);
        }
      );

      service.updateBusinessProcess(testRequest).subscribe(result => {
        expect(result).toEqual(expectedResponse);
      });
      expect(httpClientPutSpy).toHaveBeenCalled();
    });
  });

  describe('getBusinessProcess', () => {
    it('should correctly map the response', () => {
      const service: Step1Service = TestBed.get(Step1Service);

      const testRequestId = 'test-id-345';

      const testResponse = {
        id: 'test-id-345',
        version: 2,
        name: 'test name',
        description: 'd1',
        identifier: 'TEST0001',
        tags: [
          {
            id: 'group-id-test-432',
            tagGroupName: 'BP Multi Selectable Tag Group',
            tagGroupType: 'SELECTABLE',
            multipleValuesAllowed: true,
            values: [
              {
                id: 'tag-id-test-111',
                tag: 'BP Multi 1',
                externalId: null
              },
              {
                id: 'tag-id-test-222',
                tag: 'BP Multi 2',
                externalId: null
              }
            ]
          }
        ]
      } as BusinessProcessInterface;

      const httpClientGetSpy = spyOn(HttpClient.prototype, 'get').and.callFake(
        endpointPath => {
          expect(endpointPath).toContain(testRequestId);
          return of(testResponse);
        }
      );

      service.getBusinessProcess(testRequestId).subscribe(result => {
        expect(result.id).toEqual(testResponse.id);
        expect(result.version).toEqual(testResponse.version);
      });
      expect(httpClientGetSpy).toHaveBeenCalled();
    });
  });
});
