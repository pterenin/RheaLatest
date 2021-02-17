import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedFilterTypeComponent } from './selected-filter-type.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaToastModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';

describe('SelectedFilterTypeComponent', () => {
  let component: SelectedFilterTypeComponent;
  let fixture: ComponentFixture<SelectedFilterTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedFilterTypeComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        TaButtonsModule,
        TaDropdownModule,
        TaCheckboxModule,
        TaSvgIconModule,
        TaToastModule,
        TaPopoverModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TaTooltipModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedFilterTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearch()', () => {
    it('should call onSearch correctly - for empty search value', () => {
      const filterType = {
        name: 'name1',
        subType: 'subType1',
        parentType: 'parentType1',
        selected: true,
        filterOptions: [
          {
            name: 'name1',
            selected: true,
            hidden: undefined
          }
        ]
      };
      component.filterType = filterType;
      component.selectedFilterType = filterType;
      component.onSearch('');
      expect(filterType.filterOptions[0].hidden).toBeFalsy();
    });
    it('should call onSearch correctly - for non-empty search value', () => {
      const filterType = {
        name: 'name1',
        subType: 'subType1',
        parentType: 'parentType1',
        selected: true,
        filterOptions: [
          {
            name: 'name1',
            selected: true,
            hidden: undefined
          }
        ]
      };
      component.filterType = filterType;
      component.selectedFilterType = filterType;
      component.onSearch('name1');
      expect(filterType.filterOptions[0].hidden).toBeFalsy();
    });
  });

  describe('getSelectedOptionsNumber()', () => {
    it('should call getSelectedOptionsNumber correctly - return "all"', () => {
      const filterType = {
        name: 'name1',
        subType: 'subType1',
        parentType: 'parentType1',
        selected: false,
        filterOptions: [
          {
            name: 'name1',
            selected: true
          },
          {
            name: 'name2',
            selected: true
          }
        ]
      };
      component.filterType = filterType;
      const value = component.getSelectedOptionsNumber();
      expect(value).toEqual('(All)');
    });
    it('should call getSelectedOptionsNumber correctly - no options', () => {
      const filterType = {
        name: 'name1',
        subType: 'subType1',
        parentType: 'parentType1',
        selected: false,
        filterOptions: null
      };
      component.filterType = filterType;
      component.selectedFilterType = filterType;
      const value = component.getSelectedOptionsNumber();
      expect(value).toEqual('');
    });
    it('should call getSelectedOptionsNumber correctly - none selected', () => {
      const filterType = {
        name: 'name1',
        subType: 'subType1',
        parentType: 'parentType1',
        selected: false,
        filterOptions: [
          {
            name: 'name1',
            selected: false
          },
          {
            name: 'name2',
            selected: false
          }
        ]
      };
      component.filterType = filterType;
      component.selectedFilterType = filterType;
      const value = component.getSelectedOptionsNumber();
      expect(value).toEqual('');
    });
    it('should call getSelectedOptionsNumber correctly - one selected', () => {
      const filterType = {
        name: 'name1',
        subType: 'subType1',
        parentType: 'parentType1',
        selected: false,
        filterOptions: [
          {
            name: 'name1',
            selected: true
          },
          {
            name: 'name2',
            selected: false
          }
        ]
      };
      component.filterType = filterType;
      const value = component.getSelectedOptionsNumber();
      expect(value).toEqual('(1)');
    });
  });
});
