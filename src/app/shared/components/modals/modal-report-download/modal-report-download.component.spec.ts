import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReportDownloadComponent } from './modal-report-download.component';
import {
  TaActiveModal,
  TaCheckboxModule,
  TaSvgIconModule,
  TaTableModule
} from '@trustarc/ui-toolkit';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ModalReportDownloadComponent', () => {
  let component: ModalReportDownloadComponent;
  let fixture: ComponentFixture<ModalReportDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalReportDownloadComponent],
      imports: [
        CommonModule,
        TaTableModule,
        TaSvgIconModule,
        TaCheckboxModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [TaActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReportDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
