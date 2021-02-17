import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoricalViewComponent } from './categorical-view.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TaBadgeModule,
  TaButtonsModule,
  TaCheckboxModule,
  TaIconSearchModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { RouterModule } from '@angular/router';
import { LocationTooltipModule } from '../location-tooltip/location-tooltip.module';
import { CustomCategoryTagModule } from '../custom-category-tag/custom-category-tag.module';

const DATA = [
  {
    label: 'Biometric & Genetic',
    id: '1',
    items: [
      {
        label: 'DNA Sequence',
        id: '11',
        selected: false,
        subItem: 'Processing Purposes'
      },
      {
        label: 'Facial recognition',
        id: '12',
        selected: false,
        subItem: 'Processing Purposes'
      },
      {
        label: 'Fingerprints',
        id: '13',
        selected: false,
        subItem: 'Processing Purposes'
      },
      {
        label: 'Retina Scan',
        id: '14',
        selected: false,
        subItem: 'Processing Purposes'
      }
    ]
  },
  {
    label: 'Contact Information',
    id: '2',
    items: [
      {
        label: 'Email',
        id: '21',
        selected: false,
        subItem: 'Processing Purposes'
      },
      {
        label: 'IP Adress',
        id: '22',
        selected: false,
        subItem: 'Processing Purposes'
      },
      {
        label: 'Device ID',
        id: '23',
        selected: false,
        subItem: 'Processing Purposes'
      },
      {
        label: 'Postal Code',
        id: '24',
        selected: false,
        subItem: 'Processing Purposes'
      }
    ]
  }
];

describe('CategoricalViewComponent', () => {
  let component: CategoricalViewComponent;
  let fixture: ComponentFixture<CategoricalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoricalViewComponent],
      imports: [
        CommonModule,
        TaCheckboxModule,
        FormsModule,
        LocationTooltipModule,
        TaButtonsModule,
        TaBadgeModule,
        TaTooltipModule,
        TaIconSearchModule,
        TaSvgIconModule,
        TaPopoverModule,
        CustomCategoryTagModule
      ],
      providers: [RouterModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoricalViewComponent);
    component = fixture.componentInstance;
    component._data = DATA;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should highlight search text', () => {
    fixture.detectChanges();
    component.searchString = 'tic';
    component.onSearch();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('strong').textContent).toContain(
      component.searchString
    );
  });
  it('should filter results on search', () => {
    fixture.detectChanges();
    const id = component.categories[0].id;
    component.searchString = 'tic';
    component.onSearch();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(
      compiled.querySelector(`#category_${id} > span`).textContent
    ).toContain(component.searchString);
  });

  it('should show selection counts', () => {
    const id = component.categories[0].id;
    component.showCounts = true;
    component.onItemClick(
      component.categories[0].items[1],
      component.categories[0]
    );
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(
      compiled.querySelector(`#category_${id}_count`).textContent
    ).toContain('(1/4)');
  });
});
