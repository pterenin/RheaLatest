import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoricalManagementComponent } from './categorical-management.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TaBadgeModule,
  TaButtonsModule,
  TaCheckboxModule
} from '@trustarc/ui-toolkit';
import { RouterModule } from '@angular/router';

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

describe('CategoricalManagementComponent', () => {
  let component: CategoricalManagementComponent;
  let fixture: ComponentFixture<CategoricalManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoricalManagementComponent],
      imports: [
        CommonModule,
        TaCheckboxModule,
        FormsModule,
        TaButtonsModule,
        TaBadgeModule
      ],
      providers: [RouterModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoricalManagementComponent);
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
});
