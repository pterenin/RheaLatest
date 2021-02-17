import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TaActiveModal,
  TaButtonsModule,
  TaModalModule,
  TaSvgIconModule,
  TaTooltipModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomDataElementModalComponent } from './custom-data-element-modal.component';
import { DataElementsService } from '../../services/data-elements/data-elements.service';
import { DropdownFieldModule } from '../dropdown/dropdown-field.module';

describe('CustomDataElementModalComponent', () => {
  let component: CustomDataElementModalComponent;
  let fixture: ComponentFixture<CustomDataElementModalComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomDataElementModalComponent],
      imports: [
        DropdownFieldModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TaModalModule,
        TaButtonsModule,
        TaTooltipModule,
        TaSvgIconModule
      ],
      providers: [
        TaActiveModal,
        ToastService,
        DataElementsService,
        { provide: FormBuilder, useValue: formBuilder }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDataElementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.customElementForm = formBuilder.group({
      category: ''
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
