import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { DetailsComponent } from './details.component';
import {
  BusinessProcessWizardHeaderComponent,
  BusinessProcessWizardFooterComponent,
  OwingOrganizationsContactsComponent
} from '../shared';
import {
  TaSvgIconModule,
  TaTableModule,
  TaTooltipModule,
  TaToastModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { RouterTestingModule } from '@angular/router/testing';
import { BusinessProcessDetailComponent } from '../shared/components/business-process-detail/business-process-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { HttpClientModule } from '@angular/common/http';
import { BusinessProcessWizardService } from '../business-process-wizard.service';
import {
  DataSubjectVolumeControllerService,
  BusinessProcessControllerService
} from 'src/app/shared/_services/rest-api';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DetailsComponent,
        BusinessProcessWizardHeaderComponent,
        BusinessProcessWizardFooterComponent,
        OwingOrganizationsContactsComponent,
        BusinessProcessDetailComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        TaToastModule,
        TaSvgIconModule,
        HttpClientModule,
        DropdownFieldModule,
        RouterTestingModule,
        TaSvgIconModule,
        RouterTestingModule,
        TaTableModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TaSvgIconModule,
        DropdownFieldModule,
        RouterTestingModule,
        TaTooltipModule
      ],
      providers: [
        ToastService,
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of(convertToParamMap({ id: 'business-process-Id-123' }))
            }
          }
        },
        DataSubjectVolumeControllerService,
        BusinessProcessControllerService,
        BusinessProcessWizardService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
