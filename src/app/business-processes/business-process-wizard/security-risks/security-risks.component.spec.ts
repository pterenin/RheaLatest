import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { SecurityRisksComponent } from './security-risks.component';
import {
  BusinessProcessWizardHeaderComponent,
  BusinessProcessWizardFooterComponent
} from '../shared';
import {
  TaSvgIconModule,
  TaTableModule,
  TaTooltipModule,
  TaToastModule,
  ToastService,
  TaCheckboxModule,
  TaBadgeModule,
  TaDropdownModule
} from '@trustarc/ui-toolkit';
import { RouterTestingModule } from '@angular/router/testing';
import { BusinessProcessDetailComponent } from '../shared/components/business-process-detail/business-process-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { HttpClientModule } from '@angular/common/http';
import { BusinessProcessWizardService } from '../business-process-wizard.service';
import { BusinessProcessControllerService } from 'src/app/shared/_services/rest-api';
import { DataInventoryCardComponent } from '../shared/components/data-inventory-card/data-inventory-card.component';
import { DataInventoryCardFilterComponent } from '../shared/components/data-inventory-card-filter/data-inventory-card-filter.component';
import { DataInventoryCardAddComponent } from '../shared/components/data-inventory-card-add/data-inventory-card-add.component';
// tslint:disable-next-line:max-line-length
import { CategoryFormSearchFilterPipeModule } from 'src/app/shared/_pipes/category-form-search-filter/category-form-search-filter.pipe.module';
import { TableSearchFilterPipeModule } from 'src/app/shared/_pipes/table-search-filter/table-search-filter.pipe.module';
import { FilterByArrayPipeModule } from 'src/app/shared/_pipes/filter-by-array-pipe/filter-by-array-pipe.module';
import { MapPipeModule } from 'src/app/shared/pipes/map/map.module';
// tslint:disable-next-line:max-line-length
import { DataInventoryCardTableBodyComponent } from 'src/app/business-processes/business-process-wizard/shared/components/data-inventory-card-table-body/data-inventory-card-table-body.component';
// tslint:disable-next-line:max-line-length
import { RetentionPeriodComponent } from 'src/app/business-processes/business-process-wizard/shared/components/retention-period/retention-period.component';

describe('SecurityRisksComponent', () => {
  let component: SecurityRisksComponent;
  let fixture: ComponentFixture<SecurityRisksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SecurityRisksComponent,
        BusinessProcessWizardHeaderComponent,
        BusinessProcessWizardFooterComponent,
        BusinessProcessDetailComponent,
        DataInventoryCardComponent,
        DataInventoryCardAddComponent,
        DataInventoryCardFilterComponent,
        DataInventoryCardTableBodyComponent,
        RetentionPeriodComponent
      ],
      imports: [
        TaToastModule,
        TaSvgIconModule,
        HttpClientModule,
        DropdownFieldModule,
        RouterTestingModule,
        TaTableModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TaTooltipModule,
        TaCheckboxModule,
        TaBadgeModule,
        TaDropdownModule,
        CategoryFormSearchFilterPipeModule,
        TableSearchFilterPipeModule,
        MapPipeModule,
        FilterByArrayPipeModule
      ],
      providers: [
        ToastService,
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of(convertToParamMap({ id: 'business-process-Id-123' }))
            }
          }
        },
        BusinessProcessControllerService,
        BusinessProcessWizardService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityRisksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
