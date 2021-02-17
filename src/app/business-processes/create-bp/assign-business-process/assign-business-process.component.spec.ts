import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateBusinessProcessesService } from '../create-business-processes.service';
import { AssignBusinessProcessComponent } from './assign-business-process.component';
import {
  TaActiveModal,
  ToastService,
  TaModalModule,
  TaButtonsModule,
  TaRadioModule,
  DatagridService
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { UserService } from 'src/app/shared/services/user/user.service';
import { DatagridHeaderService } from 'src/app/shared/services/record-listing/datagrid-header.service';

describe('AssignBusinessProcessComponent', () => {
  let component: AssignBusinessProcessComponent;
  let fixture: ComponentFixture<AssignBusinessProcessComponent>;
  let userService: UserService;
  let datagridHeaderService: DatagridHeaderService;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssignBusinessProcessComponent],
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
        DatagridService,
        DatagridHeaderService,
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

    datagridHeaderService = TestBed.get(DatagridHeaderService);
    spyOn(datagridHeaderService, 'viewSelectedPageItems').and.returnValue(
      of([])
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignBusinessProcessComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);

    const reviewersMock = [
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
    fixture.detectChanges();

    component.bpAssignForm = formBuilder.group({
      status: 'draft',
      reviewer: '',
      message: ''
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch reviewers data on init', () => {
    component.ngOnInit();
    expect(userService.getUsersSearch).toHaveBeenCalled();
  });
});
