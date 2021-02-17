import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditAccordionComponent } from './audit-accordion.component';
import { AuditTableModule } from '../audit-table/audit-table.module';
import { TaAccordionModule, ToastService } from '@trustarc/ui-toolkit';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuditAccordionComponent', () => {
  let component: AuditAccordionComponent;
  let fixture: ComponentFixture<AuditAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditAccordionComponent],
      imports: [
        AuditTableModule,
        TaAccordionModule,
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [ToastService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
