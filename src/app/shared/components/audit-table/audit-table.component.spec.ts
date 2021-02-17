import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTableComponent } from './audit-table.component';
import {
  TaPaginationModule,
  TaTableModule,
  TaToastModule
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuditTableComponent', () => {
  let component: AuditTableComponent;
  let fixture: ComponentFixture<AuditTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditTableComponent],
      imports: [
        TaTableModule,
        TaPaginationModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TaToastModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
