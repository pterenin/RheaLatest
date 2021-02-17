import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateBusinessProcessesService } from '../create-business-processes.service';
import { FinishSetStatusComponent } from './finish-set-status.component';
import {
  TaActiveModal,
  ToastService,
  TaModalModule,
  TaButtonsModule,
  TaRadioModule
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { UserService } from 'src/app/shared/services/user/user.service';

describe('FinishSetStatusComponent', () => {
  let component: FinishSetStatusComponent;
  let fixture: ComponentFixture<FinishSetStatusComponent>;
  let userService: UserService;
  const formBuilder: FormBuilder = new FormBuilder();
  let reviewersMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinishSetStatusComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TaModalModule,
        TaButtonsModule,
        TaRadioModule,
        DropdownFieldModule
      ],
      providers: [
        TaActiveModal,
        ToastService,
        {
          provide: UserService,
          useValue: {
            getUsersSearch: () => of([])
          }
        },
        { provide: FormBuilder, useValue: formBuilder }
      ]
    }).compileComponents();

    userService = TestBed.get(UserService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishSetStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.bpStatusForm = formBuilder.group({
      status: 'draft',
      reviewer: '',
      message: ''
    });

    reviewersMock = [
      {
        value: 'Michael Johns',
        label: 'Michael Johns'
      },
      {
        value: 'Maria Hopkins',
        label: 'Maria Hopkins'
      },
      {
        value: 'Edward Walters',
        label: 'Edward Walters'
      }
    ];

    spyOn(userService, 'getUsersSearch').and.returnValue(of(reviewersMock));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch reviewers data on init', () => {
    component.ngOnInit();
    expect(userService.getUsersSearch).toHaveBeenCalled();
  });
});
