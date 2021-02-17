import { TestBed, async } from '@angular/core/testing';
import { CreateBusinessProcessesModule } from '../create-business-processes.module';
import { Step2Service } from './step-2.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ToastService } from '@trustarc/ui-toolkit';

describe('Step2Service', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CreateBusinessProcessesModule,
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [Step2Service, ToastService]
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: Step2Service = TestBed.get(Step2Service);
    expect(service).toBeTruthy();
  });

  describe('getBpOwner', () => {
    it('should call getBpOwner on request', () => {
      const service: Step2Service = TestBed.get(Step2Service);
      const spy = spyOn(service, 'getBpOwner');
      service.getBpOwner('id');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getCompanyEntities', () => {
    it('should call getCompanyEntities on request', () => {
      const service: Step2Service = TestBed.get(Step2Service);
      const spy = spyOn(service, 'getCompanyEntities');
      service.getCompanyEntities();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('saveOwner', () => {
    const owner = {
      id: 'ae102-ti825',
      companyId: 'fj3492-fn4k2',
      fullName: 'John Smith',
      email: 'test@testing.test',
      version: 0
    };
    it('should call saveOwner on request', () => {
      const service: Step2Service = TestBed.get(Step2Service);
      const spy = spyOn(service, 'saveOwner');
      service.saveOwner(owner);
      expect(spy).toHaveBeenCalled();
    });
  });
});
