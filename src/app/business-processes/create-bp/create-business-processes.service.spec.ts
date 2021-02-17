import { TestBed, async } from '@angular/core/testing';

import { CreateBusinessProcessesModule } from './create-business-processes.module';
import { CreateBusinessProcessesService } from './create-business-processes.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Subject } from 'rxjs';
import { BusinessProcessInterface } from './create-business-processes.model';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { LocationModule } from 'src/app/shared/components/location/location.module';
import { routes } from './create-business-processes-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MockModule } from 'ng-mocks';
import { TaToastModule } from '@trustarc/ui-toolkit';

describe('CreateBusinessProcessesService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CreateBusinessProcessesModule,
        HttpClientModule,
        HttpClientTestingModule,
        LocationModule,
        RouterTestingModule.withRoutes(routes),
        MockModule(TaToastModule)
      ],
      providers: [CreateBusinessProcessesService]
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: CreateBusinessProcessesService = TestBed.get(
      CreateBusinessProcessesService
    );
    expect(service).toBeTruthy();
  });

  describe('getItSystems', () => {
    it('should call getItSystems on request', () => {
      const service: CreateBusinessProcessesService = TestBed.get(
        CreateBusinessProcessesService
      );
      const spy = spyOn(service, 'getItSystems');
      service.getItSystems();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('createBusinessProcess', () => {
    it('should call post and cache the default name', () => {
      const service: CreateBusinessProcessesService = TestBed.get(
        CreateBusinessProcessesService
      );
      const testResponse = {
        id: 'test id 345',
        name: 'test name 567'
      } as BusinessProcessInterface;

      expect(service.isNewlyCreated(testResponse.id)).toBeFalsy();
      expect(service.getDefaultName(testResponse.id)).toBeNull();

      const httpClientPostSpy = spyOn(
        HttpClient.prototype,
        'post'
      ).and.callFake(() => {
        return of(testResponse);
      });

      service.createBusinessProcess().subscribe(result => {
        expect(result).toEqual(testResponse);
      });
      expect(httpClientPostSpy).toHaveBeenCalled();

      expect(service.isNewlyCreated(testResponse.id)).toBeTruthy();
      expect(service.getDefaultName(testResponse.id)).toEqual(
        testResponse.name
      );
    });
  });

  describe('save', () => {
    let service: CreateBusinessProcessesService;

    const VERSION = 123;
    const ID = '456';
    const UPDATED_VERSION = 124;

    let serverResponseSubject: Subject<BaseDomainInterface>;
    let isAutosaveActive;
    let valueChanges: Subject<boolean>;
    let componentSave;
    let updateVersionInComponent: (baseDomain: BaseDomainInterface) => any;
    let handleSaveError;
    beforeEach(() => {
      serverResponseSubject = new Subject<BaseDomainInterface>();
      isAutosaveActive = jasmine.createSpy('isAutosaveActiveSpy', () => true);
      valueChanges = new Subject<boolean>();
      componentSave = jasmine
        .createSpy('spy', () => serverResponseSubject)
        .and.callThrough();
      updateVersionInComponent = jasmine
        .createSpy('spy', baseDomain => {})
        .and.callThrough();
      handleSaveError = jasmine.createSpy(
        'handleSaveErrorSpy',
        ({ error }) => {}
      );

      service = new CreateBusinessProcessesService(null, null, null, null);
      service.setAutosaveTarget(
        VERSION,
        ID,
        isAutosaveActive,
        valueChanges,
        componentSave,
        updateVersionInComponent,
        handleSaveError
      );
    });

    it('should init version and id', () => {
      expect(service.currentBaseDomain.version).toBe(VERSION);
      expect(service.currentBaseDomain.id).toBe(ID);
      expect(service.getIsDataChanged()).toBe(false);
    });

    it('should confirm that autoSave is active in the component', () => {
      service.autoSave();
      expect(isAutosaveActive).toHaveBeenCalledTimes(1);
    });

    it('should be sucessful without checking autosave', () => {
      service.save().subscribe(result => {
        expect(result).toBe(true);
      });
      expect(isAutosaveActive).toHaveBeenCalledTimes(0);
    });

    it('should mark data as unchanged after saving successfully', () => {
      service.dataChanged();
      expect(service.getIsDataChanged()).toBe(true);
      service.save().subscribe();
      expect(service.getIsDataChanged()).toBe(false);
    });

    it('should delegate to the component to perform the save', () => {
      service.dataChanged();
      expect(componentSave).toHaveBeenCalledTimes(0);
      service.save().subscribe();
      expect(componentSave).toHaveBeenCalledTimes(1);
    });

    it('should update the version on success', () => {
      service.dataChanged();
      service.save().subscribe();
      // NOTE: Send success data AFTER subscribing so that the subscription sees it.
      serverResponseSubject.next({ id: ID, version: UPDATED_VERSION });
      expect(service.currentBaseDomain.version).toBe(UPDATED_VERSION);
      expect(service.currentBaseDomain.id).toBe(ID);
    });

    it('should forward server success to the suscribers', done => {
      service.dataChanged();
      service.save().subscribe(
        result => {
          expect(result).toBe(true);
          done();
        },
        error => {
          fail();
          done();
        }
      );
      // NOTE: Send success data AFTER subscribing so that the subscription sees it.
      serverResponseSubject.next({ id: ID, version: UPDATED_VERSION });
    });

    it('should forward server failures to the suscribers', done => {
      service.dataChanged();
      service.save().subscribe(
        result => {
          expect(result).toBe(false);
          done();
        },
        error => {
          fail();
          done();
        }
      );
      // NOTE: Send error  AFTER subscribing so that the subscription sees it.
      serverResponseSubject.error(new Error('Test Server Error 123'));
    });

    it('should ignore server failures if ignore flag is set', done => {
      service.dataChanged();
      service.save(true).subscribe(
        result => {
          expect(result).toBe(true);
          done();
        },
        error => {
          fail();
          done();
        }
      );
      // NOTE: Send error AFTER subscribing so that the subscription sees it.
      serverResponseSubject.error(new Error('Test  Server Error 123'));
    });

    it('should toggle the updating flag', done => {
      const spy = spyOn(service.isUpdatingSubject, 'next').and.callThrough();

      service.dataChanged();
      service.save().subscribe(() => {
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith(true);
        expect(spy).toHaveBeenCalledWith(false);
        expect(service.isUpdatingSubject.getValue()).toBe(false);
        done();
      });
      // NOTE: Send success data AFTER subscribing so that the subscription sees it.
      serverResponseSubject.next({ id: ID, version: UPDATED_VERSION });
    });
  });
});
