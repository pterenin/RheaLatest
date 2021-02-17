import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFormComponent } from './details-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CategoricalViewModule } from 'src/app/shared/components/categorical-view/categorical-view.module';
import { SlotModule } from 'src/app/shared/directives/slot/slot.module';
import {
  TaSvgIconModule,
  TaTooltipModule,
  TaToastModule,
  TaDropdownModule
} from '@trustarc/ui-toolkit';
import { DropdownCategoryMultipleModule } from 'src/app/shared/components/dropdown-category-multiple/dropdown-category-multiple.module';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';
import { InputLocationModule } from 'src/app/shared/components/input-location/input-location.module';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';
import { CategoryHasSearchResultPipeModule } from 'src/app/shared/pipes/category-has-search-result/category-has-search-result.module';
import { AsyncCategoricalDropdownModule } from 'src/app/shared/components/async-categorical-dropdown/async-categorical-dropdown.module';
import { HeadquartersFormModule } from 'src/app/shared/components/headquarters-form/headquarters-form.module';

describe('DetailsFormComponent', () => {
  let component: DetailsFormComponent;
  let fixture: ComponentFixture<DetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsFormComponent],
      imports: [
        TaDropdownModule,
        CategoryHasSearchResultPipeModule,
        CategoricalViewModule,
        DropdownCategoryMultipleModule,
        DropdownFieldModule,
        InputLocationModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SlotModule,
        TaSvgIconModule,
        TaToastModule,
        TaTooltipModule,
        AsyncCategoricalDropdownModule,
        RiskFieldIndicatorModule,
        HeadquartersFormModule
      ],
      providers: [DataInventoryService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsFormComponent);
    component = fixture.componentInstance;
    component.allCountries = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
