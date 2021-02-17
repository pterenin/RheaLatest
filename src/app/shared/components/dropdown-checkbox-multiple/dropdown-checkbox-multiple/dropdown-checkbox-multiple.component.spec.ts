import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownCheckboxMultipleComponent } from './dropdown-checkbox-multiple.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TaCheckboxModule,
  TaDropdownModule,
  TaTagsModule
} from '@trustarc/ui-toolkit';

describe('DropdownCheckboxMultipleComponent', () => {
  let component: DropdownCheckboxMultipleComponent;
  let fixture: ComponentFixture<DropdownCheckboxMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownCheckboxMultipleComponent],
      imports: [
        ReactiveFormsModule,
        TaCheckboxModule,
        TaDropdownModule,
        TaTagsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownCheckboxMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
