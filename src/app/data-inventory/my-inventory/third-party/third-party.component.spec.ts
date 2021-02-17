import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyComponent } from './third-party.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PageHeaderTitleModule } from '../../../shared/components/page-header-title/page-header-title.module';
import {
  TaDatepickerModule,
  TaModal,
  TaSvgIconModule,
  TaTabsetModule,
  TaToastModule,
  TaTooltipModule,
  TaCheckboxModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { ThirdPartyDetailsFormComponent } from './details-form/details-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { CollaboratorModule } from 'src/app/shared/components/collaborator/collaborator.module';
import { ThirdPartyService } from './third-party.service';
import { DataInventoryFooterModule } from 'src/app/shared/components/data-inventory-footer/data-inventory-footer.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InventoryAttachmentsComponent } from '../inventory-attachments/inventory-attachments.component';
import { MockComponent } from 'ng-mocks';
import { InventoryTagsComponent } from '../inventory-tags/inventory-tags.component';
import { AssessmentsModule } from 'src/app/shared/components/assessments/assessments.module';
import { ContactService } from 'src/app/shared/components/contact/contact.service';
import { ContactModule } from 'src/app/shared/components/contact/contact.module';
import { DropdownCategoryMultipleModule } from 'src/app/shared/components/dropdown-category-multiple/dropdown-category-multiple.module';
import { DropdownCategoryGroupModule } from 'src/app/shared/components/dropdown-category-group/dropdown-category-group.module';
import { DataInventoryService } from '../../data-inventory.service';
import { TabsetGuardedModule } from 'src/app/shared/components/tabset-guarded/tabset-guarded.module';
import { InputLocationModule } from 'src/app/shared/components/input-location/input-location.module';
import { AuditAccordionModule } from '../../../shared/components/audit-accordion/audit-accordion.module';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';

describe('ThirdPartyComponent', () => {
  let component: ThirdPartyComponent;
  let fixture: ComponentFixture<ThirdPartyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ThirdPartyComponent,
        MockComponent(InventoryTagsComponent),
        MockComponent(InventoryAttachmentsComponent),
        ThirdPartyDetailsFormComponent
      ],
      imports: [
        AssessmentsModule,
        CollaboratorModule,
        ContactModule,
        DataInventoryFooterModule,
        DropdownCategoryMultipleModule,
        DropdownCategoryGroupModule,
        DropdownFieldModule,
        InputLocationModule,
        HttpClientModule,
        HttpClientTestingModule,
        PageHeaderTitleModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TabsetGuardedModule,
        TaDatepickerModule,
        TaSvgIconModule,
        TaTabsetModule,
        TaToastModule,
        TaTooltipModule,
        TaCheckboxModule,
        AuditAccordionModule,
        RiskFieldIndicatorModule
      ],
      providers: [
        ThirdPartyService,
        ToastService,
        ContactService,
        TaModal,
        DataInventoryService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
