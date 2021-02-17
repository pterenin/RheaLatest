import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentsComponent } from './assessments.component';
import { AssessmentsService } from './assessments.service';
import { HttpClientModule } from '@angular/common/http';
import {
  TaDropdownModule,
  TaSvgIconModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';

describe('AssessmentsComponent', () => {
  let component: AssessmentsComponent;
  let fixture: ComponentFixture<AssessmentsComponent>;
  let assessmentsService: AssessmentsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentsComponent],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        TaDropdownModule,
        TaSvgIconModule
      ],
      providers: [AssessmentsService, ToastService, DataInventoryService]
    }).compileComponents();

    assessmentsService = TestBed.get(AssessmentsService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentsComponent);
    component = fixture.componentInstance;
    component.type = 'business-process';
    fixture.detectChanges();

    spyOn(assessmentsService, 'getAssessments').and.returnValue(
      Observable.create({
        buildAssessmentUrl: 'url',
        counts: []
      })
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch assessments data on init', () => {
    component.ngOnInit();
    expect(assessmentsService.getAssessments).toHaveBeenCalled();
  });
});
