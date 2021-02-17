import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDropdownComponent } from './add-dropdown.component';
import { FormsModule } from '@angular/forms';
import { TaButtonsModule, TaDropdownModule } from '@trustarc/ui-toolkit';

describe('AddDropdownComponent', () => {
  let component: AddDropdownComponent;
  let fixture: ComponentFixture<AddDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDropdownComponent],
      imports: [FormsModule, TaDropdownModule, TaButtonsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
