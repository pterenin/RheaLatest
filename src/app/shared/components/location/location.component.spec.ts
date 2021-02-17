import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationComponent } from './location.component';
import { FormsModule } from '@angular/forms';
import {
  TaAccordionModule,
  TaButtonsModule,
  TaCheckboxModule,
  TaSvgIconModule,
  TaTabsetModule
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { SearchFieldModule } from '../../_components/search-field/search-field.module';

const locations = [
  {
    id: 'Asia',
    name: 'Asia',
    i18nKey: 'i18nKey',
    version: 0,
    countries: [
      {
        name: 'India',
        twoLetterCode: 'IN',
        selected: true,
        threeLetterCode: 'IND',
        stateOrProvinces: [],
        version: 0,
        id: 'India',
        i18nKey: 'i18nKey',
        globalRegions: []
      },
      {
        name: 'China',
        twoLetterCode: 'CN',
        selected: false,
        threeLetterCode: 'CHN',
        stateOrProvinces: [],
        version: 0,
        id: 'China',
        i18nKey: 'i18nKey',
        globalRegions: []
      },
      {
        name: 'Sri Lanka',
        twoLetterCode: 'LK',
        selected: false,
        threeLetterCode: 'LKA',
        stateOrProvinces: [],
        version: 0,
        id: 'Sri Lanka',
        i18nKey: 'i18nKey',
        globalRegions: []
      },
      {
        name: 'Vietnam',
        twoLetterCode: 'VN',
        selected: false,
        threeLetterCode: 'VNM',
        stateOrProvinces: [],
        version: 0,
        id: 'Vietnam',
        i18nKey: 'i18nKey',
        globalRegions: []
      },
      {
        name: 'Cambodia',
        twoLetterCode: 'KH',
        selected: false,
        threeLetterCode: 'KHM',
        stateOrProvinces: [],
        version: 0,
        id: 'Cambodia',
        i18nKey: 'i18nKey',
        globalRegions: []
      },
      {
        name: 'Nepal',
        twoLetterCode: 'NP',
        selected: false,
        threeLetterCode: 'NPL',
        stateOrProvinces: [],
        version: 0,
        id: 'Nepal',
        i18nKey: 'i18nKey',
        globalRegions: []
      },
      {
        name: 'Laos',
        twoLetterCode: 'LA',
        selected: false,
        threeLetterCode: 'LAO',
        stateOrProvinces: [],
        version: 0,
        id: 'Laos',
        i18nKey: 'i18nKey',
        globalRegions: []
      },
      {
        name: 'Qatar',
        twoLetterCode: 'QA',
        selected: false,
        threeLetterCode: 'QAT',
        stateOrProvinces: [],
        version: 0,
        id: 'Qatar',
        i18nKey: 'i18nKey',
        globalRegions: []
      }
    ]
  },
  {
    id: 'Europe',
    name: 'Europe',
    i18nKey: 'i18nKey',
    version: 0,
    countries: [
      {
        name: 'Germany',
        twoLetterCode: 'DE',
        selected: true,
        threeLetterCode: 'DEU',
        stateOrProvinces: [],
        version: 0,
        id: 'Germany',
        i18nKey: 'i18nKey',
        globalRegions: []
      },
      {
        name: 'France',
        twoLetterCode: 'FR',
        selected: true,
        threeLetterCode: 'FRA',
        stateOrProvinces: [],
        version: 0,
        id: 'France',
        i18nKey: 'i18nKey',
        globalRegions: []
      },
      {
        name: 'Italy',
        twoLetterCode: 'IT',
        selected: true,
        threeLetterCode: 'ITA',
        stateOrProvinces: [],
        version: 0,
        id: 'Italy',
        i18nKey: 'i18nKey',
        globalRegions: []
      },
      {
        name: 'United Kingdom',
        twoLetterCode: 'GB',
        selected: true,
        threeLetterCode: 'GBR',
        stateOrProvinces: [],
        version: 0,
        id: 'United Kingdom',
        i18nKey: 'i18nKey',
        globalRegions: []
      },
      {
        name: 'Poland',
        twoLetterCode: 'PL',
        selected: false,
        threeLetterCode: 'POL',
        stateOrProvinces: [],
        version: 0,
        id: 'Poland',
        i18nKey: 'i18nKey',
        globalRegions: []
      },
      {
        name: 'Finland',
        twoLetterCode: 'FI',
        selected: false,
        threeLetterCode: 'FIN',
        stateOrProvinces: [],
        version: 0,
        id: 'Finland',
        i18nKey: 'i18nKey',
        globalRegions: []
      }
    ]
  }
];

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationComponent],
      imports: [
        FormsModule,
        TaAccordionModule,
        TaTabsetModule,
        TaCheckboxModule,
        TaSvgIconModule,
        TaButtonsModule,
        SearchFieldModule,
        HttpClientTestingModule
      ],
      providers: [HttpClient]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
    component.locations = locations;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getSelectedItemCount() with null index should return zero', () => {
    expect(component.getSelectedItemCount(null) === 0);
  });

  it('#getSelectedItemCount() with undefined index should return zero', () => {
    expect(component.getSelectedItemCount(undefined) === 0);
  });

  it('#getSelectedItemCount() with index zero(Asia) should return one', () => {
    expect(component.getSelectedItemCount(0) === 1);
  });

  it('#isAllSelected() with null index should return false', () => {
    expect(component.isAllSelected(null) === false);
  });

  it('#isAllSelected() with undefined index should return false', () => {
    expect(component.isAllSelected(undefined) === false);
  });

  it('#isAllSelected() with index of zero(Asia) should return false', () => {
    expect(component.isAllSelected(0) === false);
  });

  it('#isAllSelected() with index of one(Europe) should return false', () => {
    expect(component.isAllSelected(1) === false);
  });

  it('#checkAllCountriesForRegion(null, null) should not change the number of selected countries', () => {
    const countSelectedAsianCountries = component.getSelectedItemCount(0);
    const countSelectedEuropeanCountries = component.getSelectedItemCount(1);

    component.checkAllCountriesForRegion(null, null);

    expect(component.getSelectedItemCount(0) === countSelectedAsianCountries);
    expect(
      component.getSelectedItemCount(0) === countSelectedEuropeanCountries
    );
  });

  it('#checkAllCountriesForRegion(null, undefined) should not change the number of selected countries', () => {
    const countSelectedAsianCountries = component.getSelectedItemCount(0);
    const countSelectedEuropeanCountries = component.getSelectedItemCount(1);

    component.checkAllCountriesForRegion(null, undefined);

    expect(component.getSelectedItemCount(0) === countSelectedAsianCountries);
    expect(
      component.getSelectedItemCount(0) === countSelectedEuropeanCountries
    );
  });

  it('#checkAllCountriesForRegion(null, 0) should select all Asian countries', () => {
    component.checkAllCountriesForRegion(null, 0);

    expect(
      component.getSelectedItemCount(0) ===
        component.locationData[0].countries.length
    );
  });
});
