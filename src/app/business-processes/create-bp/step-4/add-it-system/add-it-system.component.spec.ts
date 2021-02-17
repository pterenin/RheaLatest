import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateBusinessProcessesService } from '../../create-business-processes.service';
import { AddItSystemComponent } from './add-it-system.component';
import {
  TaActiveModal,
  TaBadgeModule,
  TaButtonsModule,
  TaModalModule,
  TaSvgIconModule,
  TaTabsetModule,
  TaTagsModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { CategoricalViewModule } from 'src/app/shared/components/categorical-view/categorical-view.module';
import { LocationModule } from 'src/app/shared/components/location/location.module';
import { ItSystemInterface } from '../../create-business-processes.model';
import { GlobalRegionInterface } from 'src/app/shared/models/location.model';
import { Step4Service } from '../step-4.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { EntityTypePipeModule } from 'src/app/shared/pipes/entity-type/entity-type.module';
import { MockModule } from 'ng-mocks';
import { DataElementsService } from 'src/app/shared/services/data-elements/data-elements.service';
import { DataElementsModule } from 'src/app/settings/data-elements/data-elements.module';
import { ProcessingPurposesService } from 'src/app/shared/services/processing-purposes/processing-purposes.service';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';

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
const mockCountries: GlobalRegionInterface[] = [
  {
    id: '69d4e1f9-588e-558f-a548-25b50153e635',
    i18nKey: '',
    name: 'Other',
    version: 2,
    countries: [
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
    ]
  }
];

const mockITSystemPropties = {
  contact: null,
  contactType: null,
  created: null,
  dataElements: [
    {
      id: '2daa4622-dbfd-48dc-b0ce-434fe43ec3b8',
      dataElement: 'Survey responses'
    },
    {
      id: '1de4acc3-3f82-43fc-b2bb-8003952eec83',
      dataElement: 'Criminal convictions'
    }
  ],
  description: '',
  externalDataSource: null,
  externalId: null,
  id: '157055e9-a98e-4b22-aef1-2ea81be20737',
  identifier: 'SYS0000003',
  locations: [
    {
      countryId: '69d4e1f9-588e-498f-a548-25b50153e635',
      globalRegionId: null,
      id: 'a39e2d43-8cb3-4232-a21b-7e6fb70c72e8',
      stateOrProvinceId: null,
      version: 0
    }
  ],
  name: 'Test IT System',
  notes: null,
  ownerId: null,
  ownerName: null,
  processingPurpose: [
    {
      id: '1bc2865f-a9ba-463b-8020-10bb3f6a1775',
      processingPurpose: 'Market research and development'
    },
    {
      id: '77b835c3-2fe6-4137-b097-998034825d47',
      processingPurpose: 'Business development'
    }
  ],
  version: 4
};


const deContent = [
  {
    id: 'Additional_1',
    label: 'Additional',
    categoryId: 'categoryId',
    items: [
      {
        id: '2daa4622-dbfd-48dc-b0ce-434fe43ec3b8',
        label: 'Survey responses',
        selected: false,
        subItem: 'Confidential'
      },
      {
        id: '1de4acc3-3f82-43fc-b2bb-8003952eec83',
        label: 'Criminal convictions',
        selected: false,
        subItem: 'Sensitive'
      }
    ]
  }
];

const ppContent = [
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
];

const mockDataElements = {last: true, content: deContent };
const mockProcessingPurposes = {last: true, content: ppContent };


const fakeDataElementsService = {
  getAllDataElementsPaged: () => of(mockDataElements)
};

const fakeProcessingPurposeService = {
  getAllProcessingPurposesPaged: () =>
    of(mockProcessingPurposes),
  addOtherElementToTheEndOfProcessingPurposeCategories: data => {}
};

const fakeCreateBusinessProcessesService = {
  getDataElements: () => of(mockDataElements),
  getProcessingPurposes: () =>
    of({ last: true, content: [
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
    ]}),
  getItSystemProperties: itSystem => of(mockITSystemPropties)
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
  generateLocations: (countryCodes: string[]) => of([]),
  getLocations: () => mockLocations
};

describe('AddItSystemComponent', () => {
  let component: AddItSystemComponent;
  let fixture: ComponentFixture<AddItSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddItSystemComponent],
      imports: [
        MockModule(EntityTypePipeModule),
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TaModalModule,
        TaButtonsModule,
        TaTabsetModule,
        TaBadgeModule,
        TaSvgIconModule,
        TaTagsModule,
        DropdownFieldModule,
        CategoricalViewModule,
        LocationModule,
        DataElementsModule,
        RiskFieldIndicatorModule
      ],
      providers: [
        TaActiveModal,
        ToastService,
        {
          provide: CreateBusinessProcessesService,
          useValue: fakeCreateBusinessProcessesService
        },
        { provide: Step4Service, useValue: fakeStep4Service },
        { provide: DataElementsService, useValue: fakeDataElementsService },
        {
          provide: ProcessingPurposesService,
          useValue: fakeProcessingPurposeService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItSystemComponent);
    component = fixture.componentInstance;
    mockItSystemData.locations = mockLocations;
    component.itSystemData = <ItSystemInterface>mockItSystemData;
    component.locationData = mockCountries;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match title label with mock data', fakeAsync(() => {
    const header = fixture.debugElement.query(By.css('#it-system-header'));
    expect(header.nativeElement.textContent).toContain(
      mockITSystemPropties.name
    );
  }));

  it('should hide location tab when IT System Data does not have a locationId', fakeAsync(() => {
    const taLocation = fixture.debugElement.query(By.css('#locationSelector'));
    expect(taLocation).toBeTruthy();
  }));

  it('should show data element list when active this tab', fakeAsync(() => {
    fixture.detectChanges();
    // active data element tab
    const activeDataElementTab = fixture.debugElement.query(
      By.css('ta-tabset .nav-item:nth-child(2) .nav-link')
    );
    activeDataElementTab.triggerEventHandler('click', event);

    tick();
    fixture.detectChanges();
    const dataElementList = fixture.debugElement.query(
      By.css('#dataElementsList')
    );
    expect(dataElementList).toBeTruthy();
  }));

  it('should show processing purpose list when active this tab', fakeAsync(() => {
    fixture.detectChanges();
    // active processing purpose tab
    const activeProcessingPurposeTab = fixture.debugElement.query(
      By.css('ta-tabset .nav-item:nth-child(3) .nav-link')
    );
    activeProcessingPurposeTab.triggerEventHandler('click', event);
    tick();
    fixture.detectChanges();

    const purposeList = fixture.debugElement.query(
      By.css('#processingPurposeList')
    );
    expect(purposeList).toBeTruthy();
  }));

  it('should disable save button when no location is selected', fakeAsync(() => {
    fixture.componentInstance.countSelectedCountries = 0;
    fixture.detectChanges();
    const saveBtn = fixture.debugElement.query(By.css('#modal-submit'));
    expect(saveBtn.nativeElement.disabled).toBeTruthy();
  }));

  it('should enable save button when a location is selected', fakeAsync(() => {
    fixture.componentInstance.countSelectedCountries = 1;
    fixture.detectChanges();
    const saveBtn = fixture.debugElement.query(By.css('#modal-submit'));
    expect(saveBtn.nativeElement.disabled).toBeFalsy();
  }));

  it('should return selected element', fakeAsync(() => {
    const selected = component.getSelectedElementsFrom(
      component.dataElementsData
    );
    selected.map(select => {
      const selectedItem = mockITSystemPropties.dataElements.find(
        item => item.id === select
      );
      expect(selectedItem).toBeTruthy();
    });
    expect(selected.length).toEqual(mockITSystemPropties.dataElements.length);
  }));

  it('should call generateLocations function with the country codes, when the Save button is clicked', fakeAsync(() => {
    const step4Service: Step4Service = fixture.debugElement.injector.get(
      Step4Service
    );
    fixture.componentInstance.selectedCountries = [
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
    const generateLocationsSpy = spyOn(
      step4Service,
      'generateLocations'
    ).and.returnValue(of([]));
    tick();
    fixture.detectChanges();
    const submitBtn = fixture.debugElement.query(By.css('#modal-submit'));
    submitBtn.triggerEventHandler('click', event);
    fixture.detectChanges();
    expect(generateLocationsSpy).toHaveBeenCalledWith([
      mockCountries[0].countries[0].threeLetterCode
    ]);
  }));

  it('should not call generateLocations when the Cancel button is clicked', fakeAsync(() => {
    const step4Service: Step4Service = fixture.debugElement.injector.get(
      Step4Service
    );
    const generateLocationsSpy = spyOn(step4Service, 'generateLocations');
    tick();
    fixture.detectChanges();
    const cancelBtn = fixture.debugElement.query(By.css('#modal-cancel'));
    cancelBtn.triggerEventHandler('click', event);
    fixture.detectChanges();
    expect(generateLocationsSpy).not.toHaveBeenCalled();
  }));

  it('should not call generateLocations when the modal exits in other ways', fakeAsync(() => {
    const step4Service: Step4Service = fixture.debugElement.injector.get(
      Step4Service
    );
    const generateLocationsSpy = spyOn(step4Service, 'generateLocations');
    tick();
    fixture.detectChanges();
    const closeBtn = fixture.debugElement.query(By.css('#modal-close'));
    closeBtn.triggerEventHandler('click', event);
    fixture.detectChanges();
    expect(generateLocationsSpy).not.toHaveBeenCalled();
  }));

  it('should add selected countries to the component countries list', fakeAsync(() => {
    const testCountries = [
      {
        globalRegions: [],
        i18nKey: '',
        id: '655b6118-ee3b-4035-9df3-5d29725bd05b',
        name: 'France',
        selected: true,
        stateOrProvinces: [],
        threeLetterCode: 'FRA',
        twoLetterCode: 'FR',
        version: 0
      },
      {
        globalRegions: [],
        i18nKey: '',
        id: '5d5d700c-8f52-4cf6-a9b1-dd549ca1e643',
        name: 'Algeria',
        selected: true,
        stateOrProvinces: [],
        threeLetterCode: 'DZA',
        twoLetterCode: 'DZ',
        version: 0
      }
    ];
    const firstSelectedCountries = component.selectedCountries;
    component.editSelectedCountries(testCountries);
    // should still includes first selected countries after adding testCountries
    firstSelectedCountries.map(country => {
      const selected = component.selectedCountries.find(
        item => item.id === country.id
      );
      expect(selected).toBeTruthy();
    });
    // should include testCountries
    testCountries.map(country => {
      const selected = component.selectedCountries.find(
        item => item.id === country.id
      );
      expect(selected).toBeTruthy();
    });
  }));

  it('should remove deselected countries from the component countries list', fakeAsync(() => {
    const firstCountries = [
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
      },
      {
        globalRegions: [],
        i18nKey: '',
        id: '5d5d700c-8f52-4cf6-a9b1-dd549ca1e643',
        name: 'Algeria',
        selected: true,
        stateOrProvinces: [],
        threeLetterCode: 'DZA',
        twoLetterCode: 'DZ',
        version: 0
      }
    ];
    component.editSelectedCountries(firstCountries);

    const secondCountries = [
      {
        globalRegions: [],
        i18nKey: '',
        id: '69d4e1f9-588e-498f-a548-25b50153e635',
        name: 'Antarctica',
        selected: false,
        stateOrProvinces: [],
        threeLetterCode: 'ATA',
        twoLetterCode: 'AQ',
        version: 0
      }
    ];
    component.editSelectedCountries(secondCountries);
    component.selectedCountries.map(country => {
      expect(country.id).toEqual(firstCountries[1].id);
    });
  }));

  it('should update selected list when select data elements/processing purpose', fakeAsync(() => {
    const selections = [
      {
        id: 'Additional_1',
        label: 'Additional',
        items: [
          {
            id: '2daa4622-dbfd-48dc-b0ce-434fe43ec3b8',
            label: 'Survey responses',
            subItem: 'Confidential'
          }
        ]
      }
    ];
    let [data, selected] = component.onSelection(selections, mockDataElements.content);
    const mockSelect = selections[0].items[0];
    data.map(category => {
      category.items
        .filter(item => item.selected)
        .map(item => {
          expect(item.id).toEqual(mockSelect.id);
        });
    });
    fixture.detectChanges();
    expect(selected).toEqual(1);

    // case selection is null
    [data, selected] = component.onSelection(null, mockDataElements.content);
    data.map(category => {
      category.items.map(item => {
        expect(item.selected).toBeFalsy();
      });
    });
    // case selection is undefined
    [data, selected] = component.onSelection(undefined, mockDataElements.content);
    data.map(category => {
      category.items.map(item => {
        expect(item.selected).toBeFalsy();
      });
    });
  }));

  describe('With IT System Data includes a locationId ', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AddItSystemComponent);
      component = fixture.componentInstance;
      mockItSystemData.locations = mockLocations;
      component.itSystemData = <ItSystemInterface>mockItSystemData;
      component.locationData = mockCountries;
      component.itSystemData['locationId'] =
        'a39e2d43-8cb3-4232-a21b-7e6fb70c72e8';
      fixture.detectChanges();
    });

    it('should hide location tab', fakeAsync(() => {
      fixture.detectChanges();
      const locationSelector = fixture.debugElement.query(
        By.css('#locationSelector')
      );
      expect(locationSelector).toBeFalsy();
    }));

    it('should enable save button', fakeAsync(() => {
      fixture.detectChanges();
      const saveBtn = fixture.debugElement.query(By.css('#modal-submit'));
      expect(saveBtn.nativeElement.disabled).toBeFalsy();
    }));
  });
});
