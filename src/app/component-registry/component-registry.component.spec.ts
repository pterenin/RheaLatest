import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponents } from 'ng-mocks';

import { AsyncCategoricalDropdownComponent } from '../shared/components/async-categorical-dropdown/async-categorical-dropdown.component';
import { CountrySelectorComponent } from 'src/app/shared/components/country-selector/country-selector.component';
import { ComponentRegistryComponent } from './component-registry.component';
import { LocationModule } from '../shared/components/location/location.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const allLocations = [
  {
    id: '04015673-1ebd-4d9b-a20e-1c55b1182fee',
    country: {
      id: 'af5bfd47-b82d-4b19-b619-0ab07c2c132b',
      name: 'Afghanistan'
    }
  },
  {
    id: '71314e64-0363-40a1-b718-8af423b77f99',
    country: {
      id: '0d1c687a-d708-4069-adf4-60750c441113',
      name: 'Bahrain'
    }
  },
  {
    id: 'dc3f8688-a623-4504-844d-e01d785c7535',
    country: {
      id: '7335309b-a9dc-4bb8-83ef-16119cc8de0c',
      name: 'Bangladesh'
    }
  },
  {
    id: 'e9c6e9d6-03ce-44eb-8311-d145dea4794d',
    country: {
      id: '56163440-8033-42d0-b38f-b0cd8d361b36',
      name: 'Bermuda'
    }
  },
  {
    id: '01d4a52b-8f3b-4c48-ad49-3fbdcc2183c2',
    country: {
      id: 'e6383fd6-730d-4cf3-aa6c-6b5ee4e82c7e',
      name: 'Canada'
    }
  },
  {
    id: 'e1a15a96-abec-4e5d-ab68-fd1fd61154d7',
    country: {
      id: '59ba15a8-8cd3-49d8-96cd-0831ac1b029d',
      name: 'Greenland'
    }
  }
];

const allGlobalRegions = [
  {
    name: 'Asia',
    countries: [
      {
        id: 'af5bfd47-b82d-4b19-b619-0ab07c2c132b',
        name: 'Afghanistan'
      },
      {
        id: '0d1c687a-d708-4069-adf4-60750c441113',
        name: 'Bahrain'
      },
      {
        id: '7335309b-a9dc-4bb8-83ef-16119cc8de0c',
        name: 'Bangladesh'
      }
    ]
  },
  {
    name: 'North America',
    countries: [
      {
        id: '56163440-8033-42d0-b38f-b0cd8d361b36',
        name: 'Bermuda'
      },
      {
        id: 'e6383fd6-730d-4cf3-aa6c-6b5ee4e82c7e',
        name: 'Canada'
      },
      {
        id: '59ba15a8-8cd3-49d8-96cd-0831ac1b029d',
        name: 'Greenland'
      }
    ]
  }
];

describe('ComponentRegistryComponent', () => {
  let component: ComponentRegistryComponent;
  let fixture: ComponentFixture<ComponentRegistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ComponentRegistryComponent,
        ...MockComponents(
          AsyncCategoricalDropdownComponent,
          CountrySelectorComponent
        )
      ],
      imports: [HttpClientTestingModule, LocationModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map locations with global countries', () => {
    const locations = [
      'dc3f8688-a623-4504-844d-e01d785c7535',
      '01d4a52b-8f3b-4c48-ad49-3fbdcc2183c2'
    ];
    component.isReadOnly = true;
    component.allLocations = allLocations;
    component.allGlobalRegions = allGlobalRegions;
    component.mapLocationsWithGlobalCountries(locations);

    expect(component.locationsForDisplay.length).toEqual(2);

    let testRegion = component.locationsForDisplay[0];
    let country = testRegion.countries[0];

    expect(testRegion.name).toEqual('Asia');
    expect(testRegion.countries.length).toEqual(1);
    expect(country.name).toEqual('Bangladesh');

    testRegion = component.locationsForDisplay[1];
    country = testRegion.countries[0];

    expect(testRegion.name).toEqual('North America');
    expect(testRegion.countries.length).toEqual(1);
    expect(country.name).toEqual('Canada');
  });

  it('should search locations', () => {
    const locations = [
      'dc3f8688-a623-4504-844d-e01d785c7535',
      '01d4a52b-8f3b-4c48-ad49-3fbdcc2183c2',
      'e1a15a96-abec-4e5d-ab68-fd1fd61154d7'
    ];
    component.isReadOnly = true;
    component.allLocations = allLocations;
    component.allGlobalRegions = allGlobalRegions;
    component.mapLocationsWithGlobalCountries(locations);

    const searchs = ['Greenland', 'Bangladesh', 'Canada', 'cannotfind'];
    searchs.map(search => {
      component.filterSearch(search);

      if (search === 'cannotfind') {
        // test case cannot find item
        expect(component.locationsForDisplay.length).toEqual(0);
        return;
      }

      expect(component.locationsForDisplay.length).toEqual(1);

      const testRegion = component.locationsForDisplay[0];
      const country = testRegion.countries[0];

      expect(testRegion.countries.length).toEqual(1);
      expect(country.name).toEqual(search);
    });
  });
});
