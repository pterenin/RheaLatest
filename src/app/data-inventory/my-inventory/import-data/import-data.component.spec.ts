import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { TaActiveModal, ToastService } from '@trustarc/ui-toolkit';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ImportDataComponent } from './import-data.component';
import { SimpleFileUploadModule } from 'src/app/shared/components/base-record-file-upload/simple-file-upload/simple-file-upload.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('ImportDataComponent', () => {
  let component: ImportDataComponent;
  let fixture: ComponentFixture<ImportDataComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportDataComponent],
      imports: [
        SimpleFileUploadModule,
        FormsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        TranslateService,
        TaActiveModal,
        ToastService,
        { provide: FormBuilder, useValue: formBuilder }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
