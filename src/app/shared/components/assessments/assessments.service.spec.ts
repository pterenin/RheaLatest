import { async, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ToastService } from '@trustarc/ui-toolkit';
import { AssessmentsModule } from './assessments.module';
import { AssessmentsService } from './assessments.service';
import { Observable } from 'rxjs';

describe('AssessmentsService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AssessmentsModule, HttpClientModule, HttpClientTestingModule],
      providers: [AssessmentsService, ToastService]
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: AssessmentsService = TestBed.get(AssessmentsService);
    expect(service).toBeTruthy();
  });

  describe('getAssessments', () => {
    it('should call getAssessments on request', () => {
      const service: AssessmentsService = TestBed.get(AssessmentsService);
      const httpClient: HttpClient = TestBed.get(HttpClient);
      const getSpy = spyOn(httpClient, 'get').and.returnValue(
        Observable.create({
          buildAssessmentUrl: 'url',
          counts: [
            {
              count: 1,
              ref: 'url/open',
              status: 'Open'
            },
            {
              count: 2,
              ref: 'url/approved',
              status: 'Approved'
            }
          ]
        })
      );

      service.getAssessments('id');
      expect(getSpy).toHaveBeenCalledWith(
        '/api/hub/base-records/id/assessments'
      );
    });
  });
});
