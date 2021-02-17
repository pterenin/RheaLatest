import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { BaseRecordService } from './base-record.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TaToastModule, ToastService } from '@trustarc/ui-toolkit';
import { RouterTestingModule } from '@angular/router/testing';
import { AuditCollectionInterface } from '../../models/audit.model';
import { Observable } from 'rxjs';

describe('Base Record Service', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, TaToastModule]
    })
  );

  it('should be created', () => {
    const service: BaseRecordService = TestBed.get(BaseRecordService);
    expect(service).toBeTruthy();
  });

  describe('deleteRecordsByIdList()', () => {
    it('should call - no errors', fakeAsync(
      inject(
        [HttpTestingController, BaseRecordService, ToastService],
        (
          httpMock: HttpTestingController,
          service: BaseRecordService,
          toastService: ToastService
        ) => {
          spyOn(toastService, 'error');
          spyOn(toastService, 'success');
          const idList = [
            {
              id: 'id1',
              version: 0,
              name: 'name1',
              entityType: 'entityType1',
              dataTransferRisk: false
            },
            {
              id: 'id2',
              version: 0,
              name: 'name2',
              entityType: 'entityType2',
              dataTransferRisk: false
            }
          ];
          const data = {
            body: {
              records: idList.map(item => ({
                id: item.id,
                entityType: item.entityType
              }))
            }
          };
          service.deleteRecordsByIdList(idList).subscribe(
            res => {
              expect(toastService.error).toHaveBeenCalledTimes(0);
              expect(toastService.success).toHaveBeenCalledTimes(1);
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = '/api/hub/base-records/records';
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('DELETE');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          expect(req.request.body).toEqual(data.body);
          const response = {
            hasErrors: null,
            errors: [],
            dbConflicts: [
              {
                record: {
                  id: 'id1',
                  version: 0,
                  recordType: 'recordType',
                  name: 'name'
                },
                status: 'status',
                message: 'message',
                conflictingRecords: [
                  {
                    id: 'id2',
                    version: 0,
                    recordType: 'recordType',
                    name: 'name',
                    identifier: 'identifier'
                  }
                ]
              }
            ]
          };
          req.flush(response);
          tick(1000);
        }
      )
    ));
    it('should call - has errors in response', fakeAsync(
      inject(
        [HttpTestingController, BaseRecordService, ToastService],
        (
          httpMock: HttpTestingController,
          service: BaseRecordService,
          toastService: ToastService
        ) => {
          spyOn(toastService, 'error');
          spyOn(toastService, 'success');
          const idList = [
            {
              id: 'id1',
              version: 0,
              name: 'name1',
              entityType: 'entityType1',
              dataTransferRisk: false
            },
            {
              id: 'id2',
              version: 0,
              name: 'name2',
              entityType: 'entityType2',
              dataTransferRisk: false
            }
          ];
          const data = {
            body: {
              records: idList.map(item => ({
                id: item.id,
                entityType: item.entityType
              }))
            }
          };
          service.deleteRecordsByIdList(idList).subscribe(
            res => {
              expect(toastService.error).toHaveBeenCalledTimes(1);
              expect(toastService.success).toHaveBeenCalledTimes(0);
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = '/api/hub/base-records/records';
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('DELETE');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          expect(req.request.body).toEqual(data.body);
          const response = {
            hasErrors: true,
            errors: [],
            dbConflicts: [
              {
                record: {
                  id: 'id1',
                  version: 0,
                  recordType: 'recordType',
                  name: 'name'
                },
                status: 'status',
                message: 'message',
                conflictingRecords: [
                  {
                    id: 'id2',
                    version: 0,
                    recordType: 'RheaBusinessProcess',
                    name: 'name',
                    identifier: 'identifier'
                  }
                ]
              }
            ]
          };
          req.flush(response);
          tick(1000);
        }
      )
    ));
    it('should call - and handle failed request', fakeAsync(
      inject(
        [HttpTestingController, BaseRecordService, ToastService],
        (
          httpMock: HttpTestingController,
          service: BaseRecordService,
          toastService: ToastService
        ) => {
          spyOn(toastService, 'error');
          spyOn(toastService, 'success');
          const idList = [
            {
              id: 'id1',
              version: 0,
              name: 'name1',
              entityType: 'entityType1',
              dataTransferRisk: false
            },
            {
              id: 'id2',
              version: 0,
              name: 'name2',
              entityType: 'entityType2',
              dataTransferRisk: false
            }
          ];
          const data = {
            body: {
              records: idList.map(item => ({
                id: item.id,
                entityType: item.entityType
              }))
            }
          };
          service.deleteRecordsByIdList(idList).subscribe(
            res => {
              expect(res).toBeNull();
            },
            err => {
              expect(err.url).toEqual('/api/hub/base-records/records');
              expect(err.name).toEqual('HttpErrorResponse');
              expect(toastService.error).toHaveBeenCalledTimes(1);
              expect(toastService.success).toHaveBeenCalledTimes(0);
            }
          );
          const expectedUrl = '/api/hub/base-records/records';
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('DELETE');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          expect(req.request.body).toEqual(data.body);
          req.error(new ErrorEvent('Error', { message: 'Error' }));
          tick(1000);
        }
      )
    ));
    it('should call - has errors in response', fakeAsync(
      inject(
        [HttpTestingController, BaseRecordService, ToastService],
        (
          httpMock: HttpTestingController,
          service: BaseRecordService,
          toastService: ToastService
        ) => {
          spyOn(toastService, 'error');
          spyOn(toastService, 'success');
          const idList = [
            {
              id: 'id1',
              version: 0,
              name: 'name1',
              entityType: 'entityType1',
              dataTransferRisk: false
            },
            {
              id: 'id2',
              version: 0,
              name: 'name2',
              entityType: 'entityType2',
              dataTransferRisk: false
            }
          ];
          const data = {
            body: {
              records: idList.map(item => ({
                id: item.id,
                entityType: item.entityType
              }))
            }
          };
          service.deleteRecordsByIdList(idList).subscribe(
            res => {
              expect(toastService.error).toHaveBeenCalledTimes(1);
              expect(toastService.success).toHaveBeenCalledTimes(0);
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = '/api/hub/base-records/records';
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('DELETE');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          expect(req.request.body).toEqual(data.body);
          const response = {
            hasErrors: true,
            errors: [],
            dbConflicts: [
              {
                record: {
                  id: 'id1',
                  version: 0,
                  recordType: 'recordType',
                  name: 'name'
                },
                status: 'status',
                message: 'message',
                conflictingRecords: [
                  {
                    id: 'id2',
                    version: 0,
                    recordType: 'recordType',
                    name: 'name',
                    identifier: 'identifier'
                  }
                ]
              }
            ]
          };
          req.flush(response);
          tick(1000);
        }
      )
    ));
    it('should call - with errors but zero conflicts', fakeAsync(
      inject(
        [HttpTestingController, BaseRecordService, ToastService],
        (
          httpMock: HttpTestingController,
          service: BaseRecordService,
          toastService: ToastService
        ) => {
          spyOn(toastService, 'error');
          spyOn(toastService, 'success');
          const idList = [
            {
              id: 'id1',
              version: 0,
              name: 'name1',
              entityType: 'entityType1',
              dataTransferRisk: false
            },
            {
              id: 'id2',
              version: 0,
              name: 'name2',
              entityType: 'entityType2',
              dataTransferRisk: false
            }
          ];
          const data = {
            body: {
              records: idList.map(item => ({
                id: item.id,
                entityType: item.entityType
              }))
            }
          };
          service.deleteRecordsByIdList(idList).subscribe(
            res => {
              const [error] = res.errors;
              expect(res.hasErrors).toBeTruthy();
              expect(res.dbConflicts.length).toEqual(0);
              expect(error.message).toEqual('message');
              expect(toastService.error).toHaveBeenCalledTimes(1);
              expect(toastService.success).toHaveBeenCalledTimes(0);
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = '/api/hub/base-records/records';
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('DELETE');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          expect(req.request.body).toEqual(data.body);
          const response = {
            hasErrors: true,
            errors: [
              {
                message: 'message'
              }
            ],
            dbConflicts: []
          };
          req.flush(response);
          tick(1000);
        }
      )
    ));
    it('should call - with errors and zero conflicts and default error message', fakeAsync(
      inject(
        [HttpTestingController, BaseRecordService, ToastService],
        (
          httpMock: HttpTestingController,
          service: BaseRecordService,
          toastService: ToastService
        ) => {
          spyOn(toastService, 'error');
          spyOn(toastService, 'success');
          const idList = [
            {
              id: 'id1',
              version: 0,
              name: 'name1',
              entityType: 'entityType1',
              dataTransferRisk: false
            },
            {
              id: 'id2',
              version: 0,
              name: 'name2',
              entityType: 'entityType2',
              dataTransferRisk: false
            }
          ];
          const data = {
            body: {
              records: idList.map(item => ({
                id: item.id,
                entityType: item.entityType
              }))
            }
          };
          service.deleteRecordsByIdList(idList).subscribe(
            res => {
              const [error] = res.errors;
              expect(res.hasErrors).toBeTruthy();
              expect(res.dbConflicts.length).toEqual(0);
              expect(error._message).toEqual('message');
              expect(toastService.error).toHaveBeenCalledTimes(1);
              expect(toastService.success).toHaveBeenCalledTimes(0);
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = '/api/hub/base-records/records';
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('DELETE');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          expect(req.request.body).toEqual(data.body);
          const response = {
            hasErrors: true,
            errors: [
              {
                _message: 'message'
              }
            ],
            dbConflicts: []
          };
          req.flush(response);
          tick(1000);
        }
      )
    ));
    it('should call - with errors and conflicts qty greater than 1', fakeAsync(
      inject(
        [HttpTestingController, BaseRecordService, ToastService],
        (
          httpMock: HttpTestingController,
          service: BaseRecordService,
          toastService: ToastService
        ) => {
          spyOn(toastService, 'error');
          spyOn(toastService, 'success');
          const idList = [
            {
              id: 'id1',
              version: 0,
              name: 'name1',
              entityType: 'entityType1',
              dataTransferRisk: false
            },
            {
              id: 'id2',
              version: 0,
              name: 'name2',
              entityType: 'entityType2',
              dataTransferRisk: false
            }
          ];
          const data = {
            body: {
              records: idList.map(item => ({
                id: item.id,
                entityType: item.entityType
              }))
            }
          };
          service.deleteRecordsByIdList(idList).subscribe(
            res => {
              const [error] = res.errors;
              expect(res.hasErrors).toBeTruthy();
              expect(res.dbConflicts.length).toEqual(2);
              expect(error.message).toEqual('message');
              expect(toastService.error).toHaveBeenCalledTimes(1);
              expect(toastService.success).toHaveBeenCalledTimes(0);
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = '/api/hub/base-records/records';
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('DELETE');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          expect(req.request.body).toEqual(data.body);
          const response = {
            hasErrors: true,
            errors: [
              {
                message: 'message'
              }
            ],
            dbConflicts: [
              {
                record: {
                  id: 'id1',
                  version: 0,
                  recordType: 'recordType',
                  name: 'name'
                },
                status: 'status',
                message: 'message',
                conflictingRecords: [
                  {
                    id: 'id2',
                    version: 0,
                    recordType: 'RheaBusinessProcess',
                    name: 'name',
                    identifier: 'identifier'
                  }
                ]
              },
              {
                record: {
                  id: 'id1',
                  version: 0,
                  recordType: 'recordType',
                  name: 'name'
                },
                status: 'status',
                message: 'message',
                conflictingRecords: [
                  {
                    id: 'id2',
                    version: 0,
                    recordType: 'recordType',
                    name: 'name',
                    identifier: 'identifier'
                  }
                ]
              }
            ]
          };
          req.flush(response);
          tick(1000);
        }
      )
    ));

    afterEach(inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        httpMock.verify();
      }
    ));
  });

  describe('getAuditsById()', () => {
    it('should call - no errors', inject(
      [HttpTestingController, BaseRecordService],
      (httpMock: HttpTestingController, service: BaseRecordService) => {
        const id = 'id';
        const size = 10;
        const page = 0;
        const sort = 'ASC';
        const data: AuditCollectionInterface = {
          changes: [
            {
              author: 'author',
              commitDate: 1234567890,
              change: 'change',
              auditIndex: 'auditIndex'
            }
          ],
          totalPages: 0,
          totalElements: 10,
          page: 0,
          size: 10,
          numberOfElements: 120
        };
        service.getAuditsById(id, size, page, sort).subscribe(
          res => {
            expect(res).toEqual(jasmine.objectContaining(data));
          },
          err => {
            expect(err).toBeNull();
          }
        );
        const expectedUrl = `/api/hub/base-records/${id}/audits?size=${size}&page=${page}&sort=${sort}`;
        const req = httpMock.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        expect(req.request.urlWithParams).toEqual(expectedUrl);
        expect(req.request.responseType).toEqual('json');
        expect(req.request.body).toEqual(null);
        req.flush(data);
      }
    ));

    afterEach(inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        httpMock.verify();
      }
    ));
  });

  describe('getRecordsDeleted()', () => {
    it('should call and return observable', inject(
      [HttpTestingController, BaseRecordService],
      (httpMock: HttpTestingController, service: BaseRecordService) => {
        const observable = service.getRecordsDeleted();
        expect(observable instanceof Observable).toBeTruthy();
      }
    ));
  });
});
