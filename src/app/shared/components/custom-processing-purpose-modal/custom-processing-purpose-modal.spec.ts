import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TaActiveModal,
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaModalModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomProcessingPurposeModalComponent } from './custom-processing-purpose-modal.component';
import { CommonModule } from '@angular/common';
import { DropdownFieldModule } from '../dropdown/dropdown-field.module';
import { DropdownCategoryMultipleModule } from '../dropdown-category-multiple/dropdown-category-multiple.module';
import { DropdownCheckboxMultipleModule } from '../dropdown-checkbox-multiple/dropdown-checkbox-multiple.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('CustomProcessingPurposeModalComponent', () => {
  let component: CustomProcessingPurposeModalComponent;
  let fixture: ComponentFixture<CustomProcessingPurposeModalComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomProcessingPurposeModalComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TaModalModule,
        TaButtonsModule,
        TaCheckboxModule,
        TaDropdownModule,
        DropdownFieldModule,
        DropdownCategoryMultipleModule,
        DropdownCheckboxMultipleModule,
        TranslateModule.forRoot()
      ],
      providers: [
        TaActiveModal,
        ToastService,
        TranslateService,
        { provide: FormBuilder, useValue: formBuilder }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomProcessingPurposeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.customProcessingPurposeForm = formBuilder.group({
      ppName: '',
      ppCategory: '',
      ppInvolves: ''
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
