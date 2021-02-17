import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InventoryInlineContactsComponent } from './inventory-inline-contacts.component';
import { MultipleStringPipeModule } from 'src/app/shared/pipes/multiple-string/multiple-string.module';

import { TaPopoverModule } from '@trustarc/ui-toolkit';

describe('InventoryInlineContactsComponent', () => {
  let component: InventoryInlineContactsComponent;
  let fixture: ComponentFixture<InventoryInlineContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryInlineContactsComponent],
      imports: [TaPopoverModule, MultipleStringPipeModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryInlineContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
