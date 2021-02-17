import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { ThirdPartyDetailsFormComponent } from './details-form.component';
import {
  TaDatepickerModule,
  TaSvgIconModule,
  TaTooltipModule,
  TaToastModule,
  TaCheckboxModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { ThirdPartyService } from '../third-party.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DropdownCategoryMultipleModule } from 'src/app/shared/components/dropdown-category-multiple/dropdown-category-multiple.module';
import { DropdownCategoryGroupModule } from 'src/app/shared/components/dropdown-category-group/dropdown-category-group.module';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';
import { InputLocationModule } from 'src/app/shared/components/input-location/input-location.module';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';

describe('ThirdPartyDetailsFormComponent', () => {
  let component: ThirdPartyDetailsFormComponent;
  let fixture: ComponentFixture<ThirdPartyDetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThirdPartyDetailsFormComponent],
      imports: [
        DropdownCategoryMultipleModule,
        DropdownCategoryGroupModule,
        DropdownFieldModule,
        InputLocationModule,
        HttpClientModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TaDatepickerModule,
        TaSvgIconModule,
        TaToastModule,
        TaTooltipModule,
        TaCheckboxModule,
        RiskFieldIndicatorModule
      ],
      providers: [ThirdPartyService, DataInventoryService, ToastService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdPartyDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
