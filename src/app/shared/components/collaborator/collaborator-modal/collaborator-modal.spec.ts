import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CollaboratorModalComponent } from './collaborator-modal.component';
import {
  TaActiveModal,
  TaButtonsModule,
  TaDropdownModule,
  TaModalModule,
  TaRadioModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CollaboratorsService } from 'src/app/shared/services/collaborators/collaborators.service';
import { DropdownFieldModule } from '../../dropdown/dropdown-field.module';

describe('CollaboratorModalComponent', () => {
  let component: CollaboratorModalComponent;
  let fixture: ComponentFixture<CollaboratorModalComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollaboratorModalComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TaModalModule,
        TaButtonsModule,
        TaRadioModule,
        TaDropdownModule,
        DropdownFieldModule
      ],
      providers: [
        TaActiveModal,
        ToastService,
        CollaboratorsService,
        { provide: FormBuilder, useValue: formBuilder }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.collaboratorForm = formBuilder.group({
      email: '',
      message: ''
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
