import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TaActiveModal,
  TaButtonsModule,
  TaModalModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { DropdownFieldModule } from '../dropdown/dropdown-field.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactComponent],
      imports: [
        ReactiveFormsModule,
        TaModalModule,
        TaButtonsModule,
        TaSvgIconModule,
        DropdownFieldModule,
        HttpClientTestingModule
      ],
      providers: [TaActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
