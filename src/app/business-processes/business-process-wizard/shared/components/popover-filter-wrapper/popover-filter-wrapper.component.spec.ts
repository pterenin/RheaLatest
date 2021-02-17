import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverFilterWrapperComponent } from './popover-filter-wrapper.component';
import {
  TaDropdownModule,
  TaButtonsModule,
  TaSvgIconModule,
  TaCheckboxModule,
  TaBadgeModule
} from '@trustarc/ui-toolkit';

describe('PopoverFilterWrapperComponent', () => {
  let component: PopoverFilterWrapperComponent;
  let fixture: ComponentFixture<PopoverFilterWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PopoverFilterWrapperComponent],
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
    fixture = TestBed.createComponent(PopoverFilterWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
