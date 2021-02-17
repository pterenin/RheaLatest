import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataInventoryCardFilterComponent } from './data-inventory-card-filter.component';
import {
  TaDropdownModule,
  TaButtonsModule,
  TaSvgIconModule,
  TaCheckboxModule,
  TaBadgeModule
} from '@trustarc/ui-toolkit';

describe('DataInventoryCardFilterComponent', () => {
  let component: DataInventoryCardFilterComponent;
  let fixture: ComponentFixture<DataInventoryCardFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataInventoryCardFilterComponent],
      imports: [
        TaBadgeModule,
        TaDropdownModule,
        TaButtonsModule,
        TaSvgIconModule,
        TaCheckboxModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataInventoryCardFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
