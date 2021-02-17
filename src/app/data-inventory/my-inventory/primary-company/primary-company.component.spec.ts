import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryCompanyComponent } from './primary-company.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PageHeaderTitleModule } from '../../../shared/components/page-header-title/page-header-title.module';
import { TaTabsetModule, ToastService } from '@trustarc/ui-toolkit';
import { PageFooterModule } from 'src/app/shared/components/page-footer-nav/page-footer-nav.module';
import { SlotModule } from 'src/app/shared/directives/slot/slot.module';
import { PrimaryCompanyDetailsComponent } from './primary-company-details/primary-company-details';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { InventoryTagsComponent } from '../inventory-tags/inventory-tags.component';
import { InventoryAttachmentsComponent } from '../inventory-attachments/inventory-attachments.component';
import { AssessmentsModule } from 'src/app/shared/components/assessments/assessments.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataInventoryFooterModule } from 'src/app/shared/components/data-inventory-footer/data-inventory-footer.module';
import { DataInventoryService } from '../../data-inventory.service';
import { TabsetGuardedModule } from 'src/app/shared/components/tabset-guarded/tabset-guarded.module';
import { AuditAccordionModule } from '../../../shared/components/audit-accordion/audit-accordion.module';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';

describe('PrimaryCompanyComponent', () => {
  let component: PrimaryCompanyComponent;
  let fixture: ComponentFixture<PrimaryCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PrimaryCompanyComponent,
        MockComponent(InventoryTagsComponent),
        MockComponent(InventoryAttachmentsComponent),
        PrimaryCompanyDetailsComponent
      ],
      imports: [
        AssessmentsModule,
        DataInventoryFooterModule,
        HttpClientTestingModule,
        PageFooterModule,
        PageHeaderTitleModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SlotModule,
        TabsetGuardedModule,
        TaTabsetModule,
        AuditAccordionModule,
        RiskFieldIndicatorModule
      ],
      providers: [DataInventoryService, ToastService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
