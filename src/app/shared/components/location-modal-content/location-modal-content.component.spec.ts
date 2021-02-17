import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateBusinessProcessesService } from 'src/app/business-processes/create-bp/create-business-processes.service';
import { LocationModalContentComponent } from './location-modal-content.component';

import {
  TaActiveModal,
  TaBadgeModule,
  TaButtonsModule,
  TaModalModule,
  TaTabsetModule,
  TaTooltipModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { CategoricalViewModule } from 'src/app/shared/components/categorical-view/categorical-view.module';
import { LocationModule } from 'src/app/shared/components/location/location.module';
import { CountryInterface } from 'src/app/shared/models/location.model';
import { Step3Service } from 'src/app/business-processes/create-bp/step-3/step-3.service';
import { of } from 'rxjs';
import { StateModule } from '../state/state.module';
import { RiskFieldIndicatorModule } from '../risk-field-indicator/risk-field-indicator.module';

const event = {
  preventDefault: () => {}
};

const mockLocations = [
  {
    countryId: '69d4e1f9-588e-498f-a548-25b50153e635',
    globalRegionId: null,
    id: 'a39e2d43-8cb3-4232-a21b-7e6fb70c72e8',
    stateOrProvinceId: null,
    version: 0
  }
];
const mockItSystemData = {
  categoryId: 'ALL',
  id: '157055e9-a98e-4b22-aef1-2ea81be20737',
  label: 'Test IT System',
  name: 'Test IT System',
  tag: 'PARTNER',
  type: 'PARTNER',
  version: 2,
  locations: []
};
const mockCountries: CountryInterface[] = [
  {
    globalRegions: [],
    i18nKey: '',
    id: '69d4e1f9-588e-498f-a548-25b50153e635',
    name: 'Antarctica',
    selected: true,
    stateOrProvinces: [],
    threeLetterCode: 'ATA',
    twoLetterCode: 'AQ',
    version: 0
  }
];

const mockDataElements = [];

const fakeCreateBusinessProcessesService = {
  getDataElements: () => of(mockDataElements),
  getProcessingPurposes: () =>
    of([
      {
        id: 'cat_1',
        label: 'Product Innovation and Development',
        items: [
          {
            id: '1bc2865f-a9ba-463b-8020-10bb3f6a1775',
            label: 'Market research and development',
            selected: false
          },
          {
            id: '77b835c3-2fe6-4137-b097-998034825d47',
            label: 'Business development',
            selected: false
          }
        ]
      }
    ])
};
const fakeStep4Service = {
  getSavedItSystemNode: (bpId, itSystem) =>
    of([
      {
        name: 'Test IT System',
        locationId: 'a39e2d43-8cb3-4232-a21b-7e6fb70c72e8',
        entityId: '157055e9-a98e-4b22-aef1-2ea81be20737',
        dataElementIds: ['2daa4622-dbfd-48dc-b0ce-434fe43ec3b8'],
        processingPurposeIds: ['1bc2865f-a9ba-463b-8020-10bb3f6a1775']
      }
    ]),
  generateLocations: (countryCodes: string[]) => of([])
};

describe('AddItSystemComponent', () => {
  let component: LocationModalContentComponent;
  let fixture: ComponentFixture<LocationModalContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationModalContentComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TaModalModule,
        TaButtonsModule,
        TaTabsetModule,
        TaBadgeModule,
        DropdownFieldModule,
        CategoricalViewModule,
        LocationModule,
        StateModule,
        RiskFieldIndicatorModule,
        TaTooltipModule
      ],
      providers: [
        TaActiveModal,
        ToastService,
        {
          provide: CreateBusinessProcessesService,
          useValue: fakeCreateBusinessProcessesService
        },
        { provide: Step3Service, useValue: fakeStep4Service }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationModalContentComponent);
    component = fixture.componentInstance;
    component.locationData = mockCountries;
    fixture.detectChanges();
  });

  // TODO: Need to fix failing unit test
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
