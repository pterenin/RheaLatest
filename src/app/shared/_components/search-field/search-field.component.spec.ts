import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFieldComponent } from './search-field.component';
import {
  TaButtonsModule,
  TaDropdownModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { ReactiveFormsModule } from '@angular/forms';

describe('SearchFieldComponent', () => {
  let component: SearchFieldComponent;
  let fixture: ComponentFixture<SearchFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchFieldComponent],
      imports: [
        TaDropdownModule,
        TaSvgIconModule,
        TaButtonsModule,
        ReactiveFormsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFieldComponent);
    component = fixture.componentInstance;
    component.placeholder = 'Searching for anti-virus';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
