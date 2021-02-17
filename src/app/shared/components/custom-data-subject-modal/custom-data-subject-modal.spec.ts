import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TaActiveModal,
  TaButtonsModule,
  TaModalModule,
  TaRadioModule,
  TaSvgIconModule,
  TaTooltipModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomDataSubjectModalComponent } from './custom-data-subject-modal.component';
import { DataSubjectsService } from '../../services/data-subjects/data-subjects.service';
import { DropdownFieldModule } from '../dropdown/dropdown-field.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('CustomDataSubjectModalComponent', () => {
  let component: CustomDataSubjectModalComponent;
  let fixture: ComponentFixture<CustomDataSubjectModalComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomDataSubjectModalComponent],
      imports: [
        DropdownFieldModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TaModalModule,
        TaButtonsModule,
        TaRadioModule,
        TaTooltipModule,
        TaSvgIconModule,
        TranslateModule.forRoot()
      ],
      providers: [
        TaActiveModal,
        ToastService,
        DataSubjectsService,
        TranslateService,
        { provide: FormBuilder, useValue: formBuilder }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDataSubjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
