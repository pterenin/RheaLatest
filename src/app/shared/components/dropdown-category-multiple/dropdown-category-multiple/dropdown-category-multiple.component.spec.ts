import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownCategoryMultipleComponent } from './dropdown-category-multiple.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TaCheckboxModule,
  TaDropdownModule,
  TaSvgIconModule,
  TaTagsModule
} from '@trustarc/ui-toolkit';

describe('DropdownCategoryMultipleComponent', () => {
  let component: DropdownCategoryMultipleComponent;
  let fixture: ComponentFixture<DropdownCategoryMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownCategoryMultipleComponent],
      imports: [
        ReactiveFormsModule,
        TaCheckboxModule,
        TaDropdownModule,
        TaSvgIconModule,
        TaTagsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownCategoryMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
