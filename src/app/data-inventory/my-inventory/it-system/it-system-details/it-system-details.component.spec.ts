import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItSystemDetailsComponent } from './it-system-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CategoricalViewModule } from 'src/app/shared/components/categorical-view/categorical-view.module';
import { SlotModule } from 'src/app/shared/directives/slot/slot.module';
import {
  TaSvgIconModule,
  TaTooltipModule,
  TaToastModule
} from '@trustarc/ui-toolkit';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';
import { AsyncCategoricalDropdownModule } from 'src/app/shared/components/async-categorical-dropdown/async-categorical-dropdown.module';
import { InputLocationModule } from 'src/app/shared/components/input-location/input-location.module';
import { InputIndividualTypeModule } from '../input-individual-type/input-individual-type.module';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';
// tslint:disable-next-line:max-line-length
import { RetentionPeriodComponent } from 'src/app/business-processes/business-process-wizard/shared/components/retention-period/retention-period.component';

describe('ItSystemDetailsComponent', () => {
  let component: ItSystemDetailsComponent;
  let fixture: ComponentFixture<ItSystemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItSystemDetailsComponent, RetentionPeriodComponent],
      imports: [
        AsyncCategoricalDropdownModule,
        CategoricalViewModule,
        DropdownFieldModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SlotModule,
        TaSvgIconModule,
        TaToastModule,
        TaTooltipModule,
        InputLocationModule,
        InputIndividualTypeModule,
        RiskFieldIndicatorModule
      ],
      providers: [DataInventoryService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItSystemDetailsComponent);
    component = fixture.componentInstance;
    component.allCountries = [];
    component.isAddNewItemLinkAtBottom = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
