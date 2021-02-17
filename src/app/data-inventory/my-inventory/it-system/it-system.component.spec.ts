import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItSystemComponent } from './it-system.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PageHeaderTitleModule } from '../../../shared/components/page-header-title/page-header-title.module';
import {
  TaSvgIconModule,
  TaTabsetModule,
  TaTooltipModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { TagsSelectorModule } from 'src/app/shared/components/tags-selector/tags-selector.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { CategoricalViewModule } from 'src/app/shared/components/categorical-view/categorical-view.module';
import { ItSystemDetailsComponent } from './it-system-details/it-system-details.component';
import { CollaboratorModule } from 'src/app/shared/components/collaborator/collaborator.module';
import { ItSystemService } from 'src/app/shared/services/it-system/it-system.service';
import { DataInventoryFooterModule } from 'src/app/shared/components/data-inventory-footer/data-inventory-footer.module';
import { MockComponent } from 'ng-mocks';
import { InventoryTagsComponent } from '../inventory-tags/inventory-tags.component';
import { InventoryAttachmentsComponent } from '../inventory-attachments/inventory-attachments.component';
import { ItSystemDataElementsComponent } from './it-system-data-elements/it-system-data-elements.component';
import { ItSystemProcessingPurposesComponent } from './it-system-processing-purposes/it-system-processing-purposes.component';
import { AssessmentsModule } from 'src/app/shared/components/assessments/assessments.module';
import { DataInventoryService } from '../../data-inventory.service';
import { TabsetGuardedModule } from 'src/app/shared/components/tabset-guarded/tabset-guarded.module';
// tslint:disable-next-line:max-line-length
import { AsyncCategoricalDropdownComponent } from 'src/app/shared/components/async-categorical-dropdown/async-categorical-dropdown.component';
import { InputIndividualTypeModule } from './input-individual-type/input-individual-type.module';
import { InputLocationModule } from '../../../shared/components/input-location/input-location.module';
import { AuditAccordionModule } from '../../../shared/components/audit-accordion/audit-accordion.module';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';
// tslint:disable-next-line:max-line-length
import { RetentionPeriodComponent } from 'src/app/business-processes/business-process-wizard/shared/components/retention-period/retention-period.component';

describe('ItSystemComponent', () => {
  let component: ItSystemComponent;
  let fixture: ComponentFixture<ItSystemComponent>;
  // let itSystemDetailsComponent: ItSystemDetailsComponent;

  beforeEach(async(() => {
    // itSystemDetailsFixture = TestBed.createComponent(Step1Component);
    // step1Component = itSystemDetailsFixture.componentInstance;
    // itSystemDetailsFixture.detectChanges();

    TestBed.configureTestingModule({
      declarations: [
        ItSystemComponent,
        MockComponent(InventoryTagsComponent),
        MockComponent(InventoryAttachmentsComponent),
        MockComponent(ItSystemDataElementsComponent),
        MockComponent(ItSystemProcessingPurposesComponent),
        MockComponent(AsyncCategoricalDropdownComponent),
        ItSystemDetailsComponent,
        RetentionPeriodComponent
      ],
      imports: [
        CategoricalViewModule,
        FormsModule,
        HttpClientModule,
        HttpClientTestingModule,
        PageHeaderTitleModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TabsetGuardedModule,
        TagsSelectorModule,
        TaTabsetModule,
        DropdownFieldModule,
        CollaboratorModule,
        TaTooltipModule,
        TaSvgIconModule,
        RouterTestingModule,
        DataInventoryFooterModule,
        AssessmentsModule,
        AuditAccordionModule,
        InputIndividualTypeModule,
        InputLocationModule,
        RiskFieldIndicatorModule
      ],
      providers: [
        ItSystemService,
        ToastService,
        DataInventoryService,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: 'child-Id-123' })),
            queryParams: of({ action: 'Add' })
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
