import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  BaseRecordFileUploadService,
  FileUploadStatus
} from './base-record-file-upload.service';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder } from '@angular/forms';
import { ToastService } from '@trustarc/ui-toolkit';
import { AttachmentService } from './file-upload/attachment.service';
import { BusinessProcessInterface } from 'src/app/business-processes/create-bp/create-business-processes.model';
import { of } from 'rxjs';
import {
  AddAttachmentResponse,
  AttachmentInterface
} from './file-upload/attachment.model';
import { BaseDomainInterface } from '../../models/base-domain-model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('BaseRecordFileUploadService', () => {
  const formBuilder: FormBuilder = new FormBuilder();
  let baseRecordFileUploadService: BaseRecordFileUploadService;
  let attachmentService: AttachmentService;
  let fileUploadFormArray: FormArray;

  let bp: BusinessProcessInterface;
  const BP_ID = 'bp_id_123';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        BaseRecordFileUploadService,
        TranslateService,
        {
          provide: ToastService,
          useValue: jasmine.createSpyObj(ToastService.prototype)
        },
        {
          provide: AttachmentService,
          useValue: jasmine.createSpyObj(AttachmentService.prototype)
        },
        { provide: FormBuilder, useValue: formBuilder },
        HttpClient
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    baseRecordFileUploadService = TestBed.get(BaseRecordFileUploadService);
    attachmentService = TestBed.get(AttachmentService);
    const attachmentServiceSpy = TestBed.get(AttachmentService);
    fileUploadFormArray = formBuilder.array([]);

    baseRecordFileUploadService.setFileUploadFormArray(fileUploadFormArray);

    const testFile: AttachmentInterface = {
      id: 'test_file_id:123',
      version: 0,
      comment: 'old comment',
      fileName: 'test file name 123',
      uploadDate: 1234567
    };
    attachmentServiceSpy.getAttachments.and.returnValue(of([testFile]));

    const addAttachmentResponse: AddAttachmentResponse = {
      newAttachment: {
        id: 'new_file_id_123',
        version: 0
      },
      id: BP_ID,
      version: 1
    };
    attachmentServiceSpy.addAttachment.and.returnValue(
      of(addAttachmentResponse)
    );

    const deleteAttachmentResponse: BaseDomainInterface = {
      id: BP_ID,
      version: 1
    };
    attachmentServiceSpy.deleteAttachment.and.returnValue(
      of(deleteAttachmentResponse)
    );

    const updateCommentResponse: BaseDomainInterface = {
      id: BP_ID,
      version: 1
    };
    attachmentServiceSpy.updateComment.and.returnValue(
      of(updateCommentResponse)
    );

    bp = {
      id: '123',
      description: 'desc123',
      identifier: 'BP000123',
      name: 'name123',
      version: 0,
      dataSubjectVolumeId: null,
      dataSubjectVolume: null,
      owningCompany: null,
      dataRecipientTypes: [],
      dataSubjectTypes: [],
      itSystems: [],
      tags: []
    };
    // // TODO: TIMF-4423 TIMF-4434 TIMF-4478 TIMF-4650 Find a better way to communicate between the model and form.
    bp['tagFormsGroup'] = { tagGroupForms: [] };
  });

  it('should be created', () => {
    const service: BaseRecordFileUploadService = TestBed.get(
      BaseRecordFileUploadService
    );
    expect(service).toBeTruthy();
  });

  it('should get attachments files but not make any calls to update the server if there are no file changes.', () => {
    baseRecordFileUploadService.update('test-bp-id').subscribe();
    baseRecordFileUploadService.save(bp).subscribe();
    expect(attachmentService.getAttachments).toHaveBeenCalledTimes(1);
    expect(attachmentService.addAttachment).toHaveBeenCalledTimes(0);
    expect(attachmentService.deleteAttachment).toHaveBeenCalledTimes(0);
    expect(attachmentService.updateComment).toHaveBeenCalledTimes(0);
  });

  it('should call service to add file', () => {
    const file: File = new File([], 'testfile.txt');
    baseRecordFileUploadService.addFileForm(file);

    // baseRecordFileUploadService.save(of(bp)).subscribe();

    baseRecordFileUploadService.save(bp).subscribe(result => {
      expect(attachmentService.addAttachment).toHaveBeenCalledTimes(1);
      expect(attachmentService.deleteAttachment).toHaveBeenCalledTimes(0);
      expect(attachmentService.updateComment).toHaveBeenCalledTimes(0);
    });
  });

  it('should call service to delete file', () => {
    const file: File = new File([], 'testfile.txt');
    baseRecordFileUploadService.addFileForm(file);
    baseRecordFileUploadService.removeFile(0);

    baseRecordFileUploadService.save(bp).subscribe(result => {
      expect(attachmentService.addAttachment).toHaveBeenCalledTimes(0);
      expect(attachmentService.deleteAttachment).toHaveBeenCalledTimes(1);
      expect(attachmentService.updateComment).toHaveBeenCalledTimes(0);
    });
  });

  it('should call service to update file comment', () => {
    const file: File = new File([], 'testfile.txt');

    baseRecordFileUploadService.addFileForm(file);

    fileUploadFormArray.at(0).patchValue({
      comment: 'new comment 123',
      uploadStatus: FileUploadStatus.UPLOADED
    });

    fileUploadFormArray
      .at(0)
      .get('comment')
      .markAsDirty();

    baseRecordFileUploadService.save(bp).subscribe(result => {
      expect(attachmentService.addAttachment).toHaveBeenCalledTimes(0);
      expect(attachmentService.deleteAttachment).toHaveBeenCalledTimes(0);
      expect(attachmentService.updateComment).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call save on removeFileWithoutSave call', () => {
    const service: BaseRecordFileUploadService = TestBed.get(
      BaseRecordFileUploadService
    );
    const spy = spyOn(service, 'save');
    baseRecordFileUploadService.removeFileWithoutSave(1);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not call save on addFileFormWithoutSave call', () => {
    const service: BaseRecordFileUploadService = TestBed.get(
      BaseRecordFileUploadService
    );
    const spy = spyOn(service, 'save');
    baseRecordFileUploadService.addFileFormWithoutSave(1);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should chain calls to add, update, and delete', () => {
    // Test update
    // Note: We mark this file ad uploaded so it won't trigger another upload.
    const file: File = new File([], 'testfile.txt');
    baseRecordFileUploadService.addFileForm(file);
    fileUploadFormArray.at(0).patchValue({
      comment: 'new comment 456',
      uploadStatus: FileUploadStatus.UPLOADED
    });
    fileUploadFormArray
      .at(0)
      .get('comment')
      .markAsDirty();

    // Test add
    baseRecordFileUploadService.addFileForm(file);

    // Test delete
    baseRecordFileUploadService.addFileForm(file);
    baseRecordFileUploadService.removeFile(2);

    baseRecordFileUploadService.save(bp).subscribe(result => {
      expect(attachmentService.addAttachment).toHaveBeenCalledTimes(1);
      expect(attachmentService.deleteAttachment).toHaveBeenCalledTimes(1);
      expect(attachmentService.updateComment).toHaveBeenCalledTimes(1);
    });
  });
});
