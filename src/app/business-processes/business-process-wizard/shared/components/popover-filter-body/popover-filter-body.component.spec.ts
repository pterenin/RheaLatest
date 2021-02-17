import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverFilterBodyComponent } from './popover-filter-body.component';
import {
  TaDropdownModule,
  TaButtonsModule,
  TaSvgIconModule,
  TaCheckboxModule,
  TaBadgeModule
} from '@trustarc/ui-toolkit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('PopoverFilterBodyComponent', () => {
  let component: PopoverFilterBodyComponent;
  let fixture: ComponentFixture<PopoverFilterBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PopoverFilterBodyComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        TaBadgeModule,
        TaDropdownModule,
        TaButtonsModule,
        TaSvgIconModule,
        TaCheckboxModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverFilterBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
