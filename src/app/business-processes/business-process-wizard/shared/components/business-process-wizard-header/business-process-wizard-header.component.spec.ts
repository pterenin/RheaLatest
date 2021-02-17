import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule, MockComponents } from 'ng-mocks';

import { BusinessProcessWizardHeaderComponent } from './business-process-wizard-header.component';
import {
  TaSvgIconModule,
  TaModalModule,
  TaModal,
  TaBadgeModule,
  TaDropdownModule,
  TaToastModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AttachmentService } from 'src/app/shared/components/base-record-file-upload/file-upload/attachment.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { ClipboardService, ClipboardModule } from 'ngx-clipboard';
import { FeatureFlagControllerService } from '../../../../../shared/_services/rest-api';

describe('BusinessProcessWizardHeaderComponent', () => {
  let component: BusinessProcessWizardHeaderComponent;
  let fixture: ComponentFixture<BusinessProcessWizardHeaderComponent>;

  beforeEach(async(() => {
    const mockToastService = jasmine.createSpyObj(['success']);

    TestBed.configureTestingModule({
      declarations: [BusinessProcessWizardHeaderComponent],
      imports: [
        TaSvgIconModule,
        RouterTestingModule,
        TaModalModule,
        TaBadgeModule,
        HttpClientModule,
        TaDropdownModule,
        DropdownFieldModule,
        ReactiveFormsModule,
        ClipboardModule,
        TaToastModule
      ],
      providers: [
        TaModal,
        ClipboardService,
        FeatureFlagControllerService,
        AttachmentService,
        {
          provide: Router,
          useValue: {
            url: '/business-process/business-process-Id-123/background'
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of(convertToParamMap({ id: 'business-process-Id-123' }))
            }
          }
        },
        {
          provide: ToastService,
          useValue: mockToastService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessProcessWizardHeaderComponent);
    component = fixture.componentInstance;
    // to prevent API requests and unit test fails due to API interactions
    component.getFeatureLicenses = () => {};

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
