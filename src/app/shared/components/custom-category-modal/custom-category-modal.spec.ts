import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TaActiveModal,
  TaButtonsModule,
  TaModalModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomCategoryModalComponent } from './custom-category-modal.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('CustomCategoryModalComponent', () => {
  let component: CustomCategoryModalComponent;
  let fixture: ComponentFixture<CustomCategoryModalComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomCategoryModalComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TaModalModule,
        TaButtonsModule,
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
    fixture = TestBed.createComponent(CustomCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.customCategoryForm = formBuilder.group({
      category: ''
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
