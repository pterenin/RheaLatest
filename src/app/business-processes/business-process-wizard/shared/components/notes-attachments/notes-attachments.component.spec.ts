import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesAttachmentsComponent } from './notes-attachments.component';
import { BaseRecordFileUploadModule } from 'src/app/shared/components/base-record-file-upload/base-record-file-upload.module';
import {
  TaBadgeModule,
  TaModalModule,
  TaActiveModal,
  ToastService
} from '@trustarc/ui-toolkit';
// tslint:disable-next-line: max-line-length
import { BaseRecordFileUploadComponent } from 'src/app/shared/components/base-record-file-upload/base-record-file-upload/base-record-file-upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BusinessProcessControllerService } from 'src/app/shared/_services/rest-api';
import { BaseRecordFileUploadService } from 'src/app/shared/components/base-record-file-upload/base-record-file-upload.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateService,
  TranslateModule,
  TranslateStore,
  TranslateLoader,
  TranslateCompiler,
  TranslateParser,
  MissingTranslationHandler
} from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

describe('DetailAttachmentsComponent', () => {
  let component: NotesAttachmentsComponent;
  let fixture: ComponentFixture<NotesAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotesAttachmentsComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BaseRecordFileUploadModule,
        TaModalModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        TaActiveModal,
        ToastService,
        TranslateService,
        BaseRecordFileUploadService,
        BusinessProcessControllerService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
