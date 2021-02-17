import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAffiliateComponent } from './company-affiliate.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PageHeaderTitleModule } from 'src/app/shared/components/page-header-title/page-header-title.module';
import {
  TaModule,
  TaSvgIconModule,
  TaTabsetModule,
  TaTooltipModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { DetailsFormComponent } from './details-form/details-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { AssessmentsModule } from 'src/app/shared/components/assessments/assessments.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SelectedItemsContainerComponent } from 'src/app/shared/components/selected-items-container/selected-items-container.component';
import { CategoricalViewModule } from 'src/app/shared/components/categorical-view/categorical-view.module';
import { LabelBadgeModule } from 'src/app/shared/components/label-badge/label-badge.module';
import { CollaboratorModule } from 'src/app/shared/components/collaborator/collaborator.module';
import { DataInventoryFooterModule } from 'src/app/shared/components/data-inventory-footer/data-inventory-footer.module';
import { CompanyAffiliateService } from 'src/app/shared/services/company-affiliate/company-affiliate.service';
import { PageFooterModule } from 'src/app/shared/components/page-footer-nav/page-footer-nav.module';
import { SlotModule } from 'src/app/shared/directives/slot/slot.module';
import { MockComponent } from 'ng-mocks';
import { InventoryTagsComponent } from '../inventory-tags/inventory-tags.component';
import { InventoryAttachmentsComponent } from '../inventory-attachments/inventory-attachments.component';
import { DropdownCategoryMultipleModule } from 'src/app/shared/components/dropdown-category-multiple/dropdown-category-multiple.module';
import { DataInventoryService } from '../../data-inventory.service';
import { TabsetGuardedModule } from 'src/app/shared/components/tabset-guarded/tabset-guarded.module';
import { InputLocationModule } from 'src/app/shared/components/input-location/input-location.module';
import { AuditAccordionModule } from 'src/app/shared/components/audit-accordion/audit-accordion.module';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';
import { CategoryHasSearchResultPipeModule } from 'src/app/shared/pipes/category-has-search-result/category-has-search-result.module';
import { AsyncCategoricalDropdownModule } from 'src/app/shared/components/async-categorical-dropdown/async-categorical-dropdown.module';
import { HeadquartersFormModule } from 'src/app/shared/components/headquarters-form/headquarters-form.module';

describe('CompanyAffiliateComponent', () => {
  let component: CompanyAffiliateComponent;
  let fixture: ComponentFixture<CompanyAffiliateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompanyAffiliateComponent,
        DetailsFormComponent,
        MockComponent(InventoryTagsComponent),
        MockComponent(InventoryAttachmentsComponent),
        SelectedItemsContainerComponent
      ],
      imports: [
        CategoryHasSearchResultPipeModule,
        AssessmentsModule,
        CategoricalViewModule,
        CollaboratorModule,
        DataInventoryFooterModule,
        DropdownCategoryMultipleModule,
        DropdownFieldModule,
        InputLocationModule,
        HttpClientTestingModule,
        LabelBadgeModule,
        PageFooterModule,
        PageHeaderTitleModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SlotModule,
        TaSvgIconModule,
        TaTabsetModule,
        TabsetGuardedModule,
        TaTooltipModule,
        TaModule,
        AuditAccordionModule,
        AsyncCategoricalDropdownModule,
        RiskFieldIndicatorModule,
        HeadquartersFormModule
      ],
      providers: [CompanyAffiliateService, ToastService, DataInventoryService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
