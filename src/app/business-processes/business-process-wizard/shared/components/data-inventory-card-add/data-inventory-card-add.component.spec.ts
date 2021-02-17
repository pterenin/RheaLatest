import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataInventoryCardAddComponent } from './data-inventory-card-add.component';
import {
  TaDropdownModule,
  TaButtonsModule,
  TaSvgIconModule,
  TaCheckboxModule
} from '@trustarc/ui-toolkit';

describe('DataInventoryCardAddComponent', () => {
  let component: DataInventoryCardAddComponent;
  let fixture: ComponentFixture<DataInventoryCardAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataInventoryCardAddComponent],
      imports: [
        TaDropdownModule,
        TaButtonsModule,
        TaSvgIconModule,
        TaCheckboxModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataInventoryCardAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
