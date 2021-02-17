import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAttachmentsComponent } from './inventory-attachments.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BaseRecordFileUploadModule } from 'src/app/shared/components/base-record-file-upload/base-record-file-upload.module';
import { TaToastModule } from '@trustarc/ui-toolkit';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataInventoryService } from '../../data-inventory.service';

describe('InventoryAttachmentsComponent', () => {
  let component: InventoryAttachmentsComponent;
  let fixture: ComponentFixture<InventoryAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryAttachmentsComponent],
      imports: [
        BaseRecordFileUploadModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TaToastModule,
        TranslateModule.forRoot()
      ],
      providers: [DataInventoryService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
