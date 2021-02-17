import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseRecordFileUploadComponent } from './base-record-file-upload.component';
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
import { BaseRecordFileUploadService } from '../base-record-file-upload.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('BaseRecordFileUploadComponent', () => {
  let component: BaseRecordFileUploadComponent;
  let fixture: ComponentFixture<BaseRecordFileUploadComponent>;
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
        TaButtonsModule,
        TaTooltipModule,
        TaSvgIconModule,
        TranslateModule.forRoot()
      ],
      declarations: [BaseRecordFileUploadComponent, FileUploadComponent],
      providers: [
        TranslateService,
        BaseRecordFileUploadService,
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
    fixture = TestBed.createComponent(BaseRecordFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
