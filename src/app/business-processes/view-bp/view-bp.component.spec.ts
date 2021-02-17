import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBpComponent } from './view-bp.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PageWrapperModule } from 'src/app/shared/components/page-wrapper/page-wrapper.module';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  TaAccordionModule,
  TaPaginationModule,
  TaToastModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { AssessmentsModule } from 'src/app/shared/components/assessments/assessments.module';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';
import { AuditAccordionModule } from '../../shared/components/audit-accordion/audit-accordion.module';

describe('ViewBpComponent', () => {
  let component: ViewBpComponent;
  let fixture: ComponentFixture<ViewBpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewBpComponent],
      imports: [
        RouterTestingModule,
        PageWrapperModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        TaPaginationModule,
        TaToastModule,
        TaAccordionModule,
        AssessmentsModule,
        AuditAccordionModule
      ],
      providers: [ToastService, DataInventoryService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBpComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
