import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFileUploadComponent } from './simple-file-upload.component';
import { CommonModule } from '@angular/common';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  TaButtonsModule,
  TaSvgIconModule,
  TaTooltipModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { MockModule } from 'ng-mocks';
import { BaseRecordFileUploadService } from '../base-record-file-upload.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('SimpleFileUploadComponent', () => {
  let component: SimpleFileUploadComponent;
  let fixture: ComponentFixture<SimpleFileUploadComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  const BP_ID = 'bp_id_123';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        MockModule(TaButtonsModule),
        MockModule(TaTooltipModule),
        MockModule(TaSvgIconModule)
      ],
      declarations: [SimpleFileUploadComponent, FileUploadComponent],
      providers: [
        BaseRecordFileUploadService,
        TranslateService,
        { provide: FormBuilder, useValue: formBuilder },
        {
          provide: ControlContainer,
          useValue: {
            // This must be a real control because the html depends on being
            // able to add the child tag controls to this.
            control: new FormGroup({})
          }
        },
        {
          provide: ToastService,
          useValue: jasmine.createSpyObj(ToastService.prototype)
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call ToastService func on download fails', () => {
    const testFileName = 'test.png';
    const service: ToastService = TestBed.get(ToastService);
    component.downloadFailed(testFileName);
    fixture.detectChanges();
    expect(service.error).toHaveBeenCalledWith(
      `Error retrieving file with filename "${testFileName}"`
    );
  });

  it('should call windows.open func on download success', () => {
    spyOn(window, 'open').and.callFake(function() {
      return true;
    });
    const testFile = {
      dateCreated: 'Aug 14 2019',
      fileUrl: 'http:\\test'
    };
    component.downloadSuccess(testFile);
    fixture.detectChanges();
    expect(window.open).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith(testFile.fileUrl, '_blank');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
