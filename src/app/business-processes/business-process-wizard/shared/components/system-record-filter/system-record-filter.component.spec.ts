import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TaCheckboxModule,
  TaDropdownModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';
import { SystemRecordFilterComponent } from './system-record-filter.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('SystemRecordFilterComponent', () => {
  let component: SystemRecordFilterComponent;
  let fixture: ComponentFixture<SystemRecordFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SystemRecordFilterComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        TaDropdownModule,
        TaCheckboxModule,
        TaSvgIconModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of(convertToParamMap({ id: 'business-process-Id-123' }))
            }
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRecordFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
