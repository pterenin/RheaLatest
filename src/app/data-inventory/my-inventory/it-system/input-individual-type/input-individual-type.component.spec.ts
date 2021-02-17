import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputIndividualTypeComponent } from './input-individual-type.component';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { RegionDisplayFieldModule } from '../region-display-field/region-display-field.module';
import { TaSvgIconModule, TaTooltipModule } from '@trustarc/ui-toolkit';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';

describe('InputIndividualTypeComponent', () => {
  let component: InputIndividualTypeComponent;
  let fixture: ComponentFixture<InputIndividualTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputIndividualTypeComponent],
      imports: [
        DropdownFieldModule,
        HttpClientModule,
        ReactiveFormsModule,
        RegionDisplayFieldModule,
        TaSvgIconModule,
        TaTooltipModule,
        RiskFieldIndicatorModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputIndividualTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
