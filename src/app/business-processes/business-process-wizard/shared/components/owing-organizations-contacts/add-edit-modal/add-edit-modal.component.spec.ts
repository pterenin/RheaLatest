import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddEditOwningOrganizationContactsModalComponent } from './add-edit-modal.component';
import {
  TaActiveModal,
  TaModalModule,
  TaButtonsModule,
  TaRadioModule,
  TaDropdownModule,
  TaTagsModule,
  TaCheckboxModule
} from '@trustarc/ui-toolkit';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { of } from 'rxjs';

describe('AddEditOwningOrganizationContactsModalComponent', () => {
  let component: AddEditOwningOrganizationContactsModalComponent;
  let fixture: ComponentFixture<AddEditOwningOrganizationContactsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditOwningOrganizationContactsModalComponent],
      imports: [
        ReactiveFormsModule,
        TaModalModule,
        TaButtonsModule,
        TaRadioModule,
        TaDropdownModule,
        HttpClientTestingModule,
        DropdownFieldModule,
        TaTagsModule,
        TaCheckboxModule
      ],
      providers: [TaActiveModal],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      AddEditOwningOrganizationContactsModalComponent
    );
    component = fixture.componentInstance;
    component.showSpinner = of(null);
    component.ownersCount = of(0);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close modal event', () => {
    const spyClose = spyOn(component, 'closeModal');
    component.closeModal('test');
    expect(spyClose).toHaveBeenCalledWith('test');
  });
});
