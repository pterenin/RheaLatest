import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AttachmentService } from './attachment.service';
import { TaToastModule } from '@trustarc/ui-toolkit';
import { RouterTestingModule } from '@angular/router/testing';

describe('AttachmentService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, TaToastModule]
    })
  );

  it('should be created', () => {
    const service: AttachmentService = TestBed.get(AttachmentService);
    expect(service).toBeTruthy();
  });

  describe('getAttachments()', () => {
    it('should call - no errors', fakeAsync(
      inject(
        [HttpTestingController, AttachmentService],
        (httpMock: HttpTestingController, service: AttachmentService) => {
          const id = 'id';
          const response = {
            comment: 'comment',
            fileName: 'fileName',
            uploadDate: new Date()
          };
          service.getAttachments(id).subscribe(
            res => {
              expect(res).toEqual(jasmine.objectContaining(response));
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = `/api/hub/records/${id}/attachments`;
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('GET');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          req.flush(response);
        }
      )
    ));
    it('should call - and handle failed request', fakeAsync(
      inject(
        [HttpTestingController, AttachmentService],
        (httpMock: HttpTestingController, service: AttachmentService) => {
          const id = '00000000-0000-0000-0000_000000000000';
          service.getAttachments(id).subscribe(
            res => {
              expect(res).toBeNull();
            },
            err => {
              expect(err).toContain(`Invalid ID: ${id}`);
            }
          );
          const expectedUrl = `/api/hub/records/${id}/attachments`;
          httpMock.expectNone(expectedUrl);
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

  describe('addAttachment()', () => {
    it('should call - no errors', fakeAsync(
      inject(
        [HttpTestingController, AttachmentService],
        (httpMock: HttpTestingController, service: AttachmentService) => {
          const id = 'id';
          const response = {
            newAttachment: {
              id: 'id',
              version: 0
            }
          };
          service.addAttachment(id, new File([], 'name'), 'comment').subscribe(
            res => {
              expect(res).toEqual(jasmine.objectContaining(response));
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = `/api/hub/records/${id}/attachments`;
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('POST');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          req.flush(response);
        }
      )
    ));
    it('should call - and handle failed request', fakeAsync(
      inject(
        [HttpTestingController, AttachmentService],
        (httpMock: HttpTestingController, service: AttachmentService) => {
          const id = '00000000-0000-0000-0000_000000000000';
          service.addAttachment(id, new File([], 'name'), 'comment').subscribe(
            res => {
              expect(res).toBeNull();
            },
            err => {
              expect(err).toContain(`Invalid ID: ${id}`);
            }
          );
          const expectedUrl = `/api/hub/records/${id}/attachments`;
          httpMock.expectNone(expectedUrl);
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

  describe('updateComment()', () => {
    it('should call - no errors', fakeAsync(
      inject(
        [HttpTestingController, AttachmentService],
        (httpMock: HttpTestingController, service: AttachmentService) => {
          const id = 'id';
          const attachmentId = 'attachmentId';
          const comment = 'comment';
          const response = {
            id: 'id',
            version: 0
          };
          service.updateComment(id, attachmentId, comment).subscribe(
            res => {
              expect(res).toEqual(jasmine.objectContaining(response));
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = `/api/hub/records/${id}/attachments/${attachmentId}`;
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('PUT');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          req.flush(response);
        }
      )
    ));
    it('should call - and handle failed request - 1', fakeAsync(
      inject(
        [HttpTestingController, AttachmentService],
        (httpMock: HttpTestingController, service: AttachmentService) => {
          const id = '00000000-0000-0000-0000_000000000001';
          const attachmentId = 'attachmentId';
          const comment = 'comment';
          service.updateComment(id, attachmentId, comment).subscribe(
            res => {
              expect(res).toBeNull();
            },
            err => {
              expect(err).toContain(`Invalid ID: ${id}`);
            }
          );
          const expectedUrl = `/api/hub/records/${id}/attachments/${attachmentId}`;
          httpMock.expectNone(expectedUrl);
        }
      )
    ));
    it('should call - and handle failed request - 2', fakeAsync(
      inject(
        [HttpTestingController, AttachmentService],
        (httpMock: HttpTestingController, service: AttachmentService) => {
          const id = 'id';
          const attachmentId = '00000000-0000-0000-0000_000000000002';
          const comment = 'comment';
          service.updateComment(id, attachmentId, comment).subscribe(
            res => {
              expect(res).toBeNull();
            },
            err => {
              expect(err).toContain(`Invalid ID: ${attachmentId}`);
            }
          );
          const expectedUrl = `/api/hub/records/${id}/attachments/${attachmentId}`;
          httpMock.expectNone(expectedUrl);
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

  describe('deleteAttachment()', () => {
    it('should call - no errors', fakeAsync(
      inject(
        [HttpTestingController, AttachmentService],
        (httpMock: HttpTestingController, service: AttachmentService) => {
          const id = 'id';
          const attachmentId = 'attachmentId';
          const response = {
            id: 'id',
            version: 0
          };
          service.deleteAttachment(id, attachmentId).subscribe(
            res => {
              expect(res).toEqual(jasmine.objectContaining(response));
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = `/api/hub/records/${id}/attachments/${attachmentId}`;
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('DELETE');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          req.flush(response);
        }
      )
    ));
    it('should call - and handle failed request', fakeAsync(
      inject(
        [HttpTestingController, AttachmentService],
        (httpMock: HttpTestingController, service: AttachmentService) => {
          const id = '00000000-0000-0000-0000_000000000001';
          const attachmentId = 'attachmentId';
          service.deleteAttachment(id, attachmentId).subscribe(
            res => {
              expect(res).toBeNull();
            },
            err => {
              expect(err).toContain(`Invalid ID: ${id}`);
            }
          );
          const expectedUrl = `/api/hub/records/${id}/attachments/${attachmentId}`;
          httpMock.expectNone(expectedUrl);
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

  describe('downloadAttachment()', () => {
    it('should call - no errors', fakeAsync(
      inject(
        [HttpTestingController, AttachmentService],
        (httpMock: HttpTestingController, service: AttachmentService) => {
          const id = 'id';
          const attachmentId = 'attachmentId';
          const response = {
            dateCreated: 'dateCreated',
            fileUrl: 'fileUrl'
          };
          service.downloadAttachment(id, attachmentId).subscribe(
            res => {
              expect(res).toEqual(jasmine.objectContaining(response));
            },
            err => {
              expect(err).toBeNull();
            }
          );
          const expectedUrl = `/api/hub/records/${id}/attachments/${attachmentId}`;
          const req = httpMock.expectOne(expectedUrl);
          expect(req.request.method).toEqual('GET');
          expect(req.request.urlWithParams).toEqual(expectedUrl);
          expect(req.request.responseType).toEqual('json');
          req.flush(response);
        }
      )
    ));
    it('should call - and handle failed request - 1', fakeAsync(
      inject(
        [HttpTestingController, AttachmentService],
        (httpMock: HttpTestingController, service: AttachmentService) => {
          const id = '00000000-0000-0000-0000_000000000001';
          const attachmentId = 'attachmentId';
          service.downloadAttachment(id, attachmentId).subscribe(
            res => {
              expect(res).toBeNull();
            },
            err => {
              expect(err).toContain(`Invalid ID: ${id}`);
            }
          );
          const expectedUrl = `/api/hub/records/${id}/attachments/${attachmentId}`;
          httpMock.expectNone(expectedUrl);
        }
      )
    ));
    it('should call - and handle failed request - 2', fakeAsync(
      inject(
        [HttpTestingController, AttachmentService],
        (httpMock: HttpTestingController, service: AttachmentService) => {
          const id = 'i';
          const attachmentId = '00000000-0000-0000-0000_000000000002';
          service.downloadAttachment(id, attachmentId).subscribe(
            res => {
              expect(res).toBeNull();
            },
            err => {
              expect(err).toContain(`Invalid ID: ${attachmentId}`);
            }
          );
          const expectedUrl = `/api/hub/records/${id}/attachments/${attachmentId}`;
          httpMock.expectNone(expectedUrl);
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
});
