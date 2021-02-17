import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { CustomFiltersService } from './custom-filters.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TaToastModule } from '@trustarc/ui-toolkit';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('Custom filter Service', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, TaToastModule]
    })
  );

  it('should be created', () => {
    const service: CustomFiltersService = TestBed.get(CustomFiltersService);
    expect(service).toBeTruthy();
  });

  describe('call functions correctly()', () => {
    it('should call getFilterTypes - no errors', fakeAsync(
      inject(
        [HttpTestingController, CustomFiltersService],
        (httpMock: HttpTestingController, service: CustomFiltersService) => {
          const response = {
            filterOptions: {
              content: [
                {
                  name: 'name1',
                  subType: 'subType1',
                  parentType: 'parentType1'
                },
                {
                  name: 'name2',
                  subType: 'subType2',
                  parentType: 'parentType2'
                }
              ],
              pageable: 'string',
              last: false,
              totalPages: 1,
              totalElements: 1,
              sort: {
                sorted: true,
                unsorted: false,
                empty: false
              },
              numberOfElements: 1,
              first: true,
              size: 5,
              number: 1,
              empty: false
            }
          };
          service.getFilterTypes().subscribe(
            res => {
              expect(res).toEqual(jasmine.objectContaining(response));
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = 'api/hub/search/filter/types/';
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('GET');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          req.flush(response);
          tick(1000);
        }
      )
    ));
    it('should call getFilterSubTypeOptions - no errors', fakeAsync(
      inject(
        [HttpTestingController, CustomFiltersService],
        (httpMock: HttpTestingController, service: CustomFiltersService) => {
          const subType = 'subType1';
          const response = {
            filterOptions: {
              content: [
                {
                  name: 'name1',
                  subType: 'subType1',
                  parentType: 'parentType1'
                },
                {
                  name: 'name2',
                  subType: 'subType2',
                  parentType: 'parentType2'
                }
              ],
              pageable: 'string',
              last: false,
              totalPages: 1,
              totalElements: 1,
              sort: {
                sorted: true,
                unsorted: false,
                empty: false
              },
              numberOfElements: 1,
              first: true,
              size: 5,
              number: 1,
              empty: false
            }
          };
          service.getFilterSubTypeOptions(subType).subscribe(
            res => {
              expect(res).toEqual(jasmine.objectContaining(response));
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = `api/hub/search/filter/types/type/${subType}`;
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('GET');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          req.flush(response);
          tick(1000);
        }
      )
    ));
    it('should call getFilterViewList - no errors', fakeAsync(
      inject(
        [HttpTestingController, CustomFiltersService],
        (httpMock: HttpTestingController, service: CustomFiltersService) => {
          const response = {
            id: 'id',
            name: 'name'
          };
          service.getFilterViewList().subscribe(
            res => {
              expect(res).toEqual(jasmine.objectContaining(response));
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = 'api/hub/search/filter';
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('GET');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          req.flush(response);
          tick(1000);
        }
      )
    ));
    it('should call saveFilterView - no errors', fakeAsync(
      inject(
        [HttpTestingController, CustomFiltersService],
        (httpMock: HttpTestingController, service: CustomFiltersService) => {
          const body = {
            filters: {
              RISK: {
                nestedFilterValue: null,
                value: []
              },
              TAG: {
                nestedFilterValue: null,
                value: []
              },
              OWN_ORG: {
                nestedFilterValue: null,
                value: []
              },
              OWN_ROLE: {
                nestedFilterValue: null,
                value: []
              },
              OWN_NAME: {
                nestedFilterValue: null,
                value: []
              },
              OWN_DEPT: {
                nestedFilterValue: null,
                value: []
              },
              SYS_OWN: {
                nestedFilterValue: null,
                value: []
              },
              OWN_EMAIL: {
                nestedFilterValue: null,
                value: []
              },
              SYS_LOC: {
                nestedFilterValue: null,
                value: []
              },
              SEC_CRL: {
                nestedFilterValue: null,
                value: []
              },
              STATUS: {
                nestedFilterValue: null,
                value: []
              }
            },
            name: 'string',
            version: 0,
            id: 'string'
          };
          const response = {
            id: 'id',
            version: 0
          };
          service.saveFilterView(body).subscribe(
            res => {
              expect(res).toEqual(jasmine.objectContaining(response));
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = 'api/hub/search/filter';
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('POST');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          expect(req.request.body).toEqual(body);
          req.flush(response);
          tick(1000);
        }
      )
    ));
    it('should call updateFilterView - no errors', fakeAsync(
      inject(
        [HttpTestingController, CustomFiltersService],
        (httpMock: HttpTestingController, service: CustomFiltersService) => {
          const body = {
            filters: {
              RISK: {
                nestedFilterValue: null,
                value: []
              },
              TAG: {
                nestedFilterValue: null,
                value: []
              },
              OWN_ORG: {
                nestedFilterValue: null,
                value: []
              },
              OWN_ROLE: {
                nestedFilterValue: null,
                value: []
              },
              OWN_NAME: {
                nestedFilterValue: null,
                value: []
              },
              OWN_DEPT: {
                nestedFilterValue: null,
                value: []
              },
              SYS_OWN: {
                nestedFilterValue: null,
                value: []
              },
              OWN_EMAIL: {
                nestedFilterValue: null,
                value: []
              },
              SYS_LOC: {
                nestedFilterValue: null,
                value: []
              },
              SEC_CRL: {
                nestedFilterValue: null,
                value: []
              },
              STATUS: {
                nestedFilterValue: null,
                value: []
              }
            },
            name: 'string',
            version: 0,
            id: 'string'
          };
          const response = {
            id: 'id',
            version: 0
          };
          service.updateFilterView(body).subscribe(
            res => {
              expect(res).toEqual(jasmine.objectContaining(response));
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = `api/hub/search/filter/${body.id}`;
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('PUT');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          expect(req.request.body).toEqual(body);
          req.flush(response);
          tick(1000);
        }
      )
    ));
    it('should call getFullFilterView - no errors', fakeAsync(
      inject(
        [HttpTestingController, CustomFiltersService],
        (httpMock: HttpTestingController, service: CustomFiltersService) => {
          const id = 'id';
          const response = {
            filters: {
              RISK: {
                nestedFilterValue: null,
                value: []
              },
              TAG: {
                nestedFilterValue: null,
                value: []
              },
              OWN_ORG: {
                nestedFilterValue: null,
                value: []
              },
              OWN_ROLE: {
                nestedFilterValue: null,
                value: []
              },
              OWN_NAME: {
                nestedFilterValue: null,
                value: []
              },
              OWN_DEPT: {
                nestedFilterValue: null,
                value: []
              },
              SYS_OWN: {
                nestedFilterValue: null,
                value: []
              },
              OWN_EMAIL: {
                nestedFilterValue: null,
                value: []
              },
              SYS_LOC: {
                nestedFilterValue: null,
                value: []
              },
              SEC_CRL: {
                nestedFilterValue: null,
                value: []
              },
              STATUS: {
                nestedFilterValue: null,
                value: []
              }
            },
            name: 'string',
            version: 0,
            id: 'string'
          };
          service.getFullFilterView(id).subscribe(
            res => {
              expect(res).toEqual(jasmine.objectContaining(response));
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = `api/hub/search/filter/${id}`;
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('GET');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          req.flush(response);
          tick(1000);
        }
      )
    ));
    it('should call initFilterTypes - no errors', fakeAsync(
      inject(
        [HttpTestingController, CustomFiltersService],
        (httpMock: HttpTestingController, service: CustomFiltersService) => {
          const response = {
            filterOptions: {
              content: [
                {
                  name: 'name1',
                  subType: 'subType1',
                  parentType: 'parentType1'
                },
                {
                  name: 'name2',
                  subType: 'subType2',
                  parentType: 'parentType2'
                }
              ],
              pageable: 'string',
              last: false,
              totalPages: 1,
              totalElements: 1,
              sort: {
                sorted: true,
                unsorted: false,
                empty: false
              },
              numberOfElements: 1,
              first: true,
              size: 5,
              number: 1,
              empty: false
            }
          };
          spyOn(service, 'getCachedFilterTypes').and.returnValue(of([]));
          spyOn(service, 'getFilterTypes').and.returnValue(of(response));
          spyOn(service, 'emitFilterTypesUpdated');
          service.initFilterTypes();
          expect(service.getCachedFilterTypes).toHaveBeenCalledTimes(1);
          expect(service.getFilterTypes).toHaveBeenCalledTimes(1);
          expect(service.emitFilterTypesUpdated).toHaveBeenCalledTimes(1);
        }
      )
    ));
    it('should call initFilterTypes - no errors and with cached data', fakeAsync(
      inject(
        [HttpTestingController, CustomFiltersService],
        (httpMock: HttpTestingController, service: CustomFiltersService) => {
          const response = {
            filterOptions: {
              content: [
                {
                  name: 'name1',
                  subType: 'subType1',
                  parentType: 'parentType1'
                },
                {
                  name: 'name2',
                  subType: 'subType2',
                  parentType: 'parentType2'
                }
              ],
              pageable: 'string',
              last: false,
              totalPages: 1,
              totalElements: 1,
              sort: {
                sorted: true,
                unsorted: false,
                empty: false
              },
              numberOfElements: 1,
              first: true,
              size: 5,
              number: 1,
              empty: false
            }
          };
          spyOn(service, 'getCachedFilterTypes').and.returnValue(of(['some']));
          spyOn(service, 'getFilterTypes').and.returnValue(of(response));
          spyOn(service, 'emitFilterTypesUpdated');
          service.initFilterTypes();
          expect(service.getCachedFilterTypes).toHaveBeenCalledTimes(1);
          expect(service.getFilterTypes).toHaveBeenCalledTimes(0);
          expect(service.emitFilterTypesUpdated).toHaveBeenCalledTimes(0);
        }
      )
    ));
    it('should call emitFilterTypesUpdated - no errors', fakeAsync(
      inject(
        [HttpTestingController, CustomFiltersService],
        (httpMock: HttpTestingController, service: CustomFiltersService) => {
          const filterTypes = [
            {
              name: 'name1',
              subType: 'subType1',
              parentType: 'parentType1',
              selected: true,
              filterOptions: [
                {
                  name: 'name1',
                  selected: false
                }
              ]
            },
            {
              name: 'name2',
              subType: 'subType2',
              parentType: 'parentType2',
              selected: true,
              filterOptions: [
                {
                  name: 'name2',
                  selected: false
                }
              ]
            }
          ];
          spyOn(service, 'getCachedFilterTypes');
          service.emitFilterTypesUpdated(filterTypes);
          expect(service.getCachedFilterTypes).toHaveBeenCalledTimes(1);
        }
      )
    ));
    it('should call getCachedFilterTypes - no errors', fakeAsync(
      inject(
        [HttpTestingController, CustomFiltersService],
        (httpMock: HttpTestingController, service: CustomFiltersService) => {
          const filterTypes = [
            {
              name: 'name1',
              subType: 'subType1',
              parentType: 'parentType1',
              selected: true,
              filterOptions: [
                {
                  name: 'name1',
                  selected: false
                }
              ]
            },
            {
              name: 'name2',
              subType: 'subType2',
              parentType: 'parentType2',
              selected: true,
              filterOptions: [
                {
                  name: 'name2',
                  selected: false
                }
              ]
            }
          ];
          service.emitFilterTypesUpdated(filterTypes);
          const observable = service.getCachedFilterTypes();
          expect(typeof observable).toEqual('object');
        }
      )
    ));
  });
});
