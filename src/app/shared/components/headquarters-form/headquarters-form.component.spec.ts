import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadquartersFormComponent } from './headquarters-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownFieldModule } from '../dropdown/dropdown-field.module';
import { HttpClientModule } from '@angular/common/http';
import { RiskFieldIndicatorModule } from '../risk-field-indicator/risk-field-indicator.module';
import { TaDropdownModule, TaSvgIconModule } from '@trustarc/ui-toolkit';
import { CollectionPipeModule } from 'src/app/shared/pipes/collection/collection.module';

describe('HeadquartersFormComponent', () => {
  let component: HeadquartersFormComponent;
  let fixture: ComponentFixture<HeadquartersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeadquartersFormComponent],
      imports: [
        DropdownFieldModule,
        HttpClientModule,
        ReactiveFormsModule,
        RiskFieldIndicatorModule,
        TaSvgIconModule,
        TaDropdownModule,
        CollectionPipeModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadquartersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
