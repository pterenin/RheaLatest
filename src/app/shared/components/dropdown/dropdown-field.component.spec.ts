import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownFieldComponent } from './dropdown-field.component';
import { CommonModule } from '@angular/common';
import {
  TaButtonsModule,
  TaDatagridModule,
  TaDropdownModule,
  TaTagsModule
} from '@trustarc/ui-toolkit';
import { RouterModule } from '@angular/router';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { RiskFieldIndicatorModule } from '../risk-field-indicator/risk-field-indicator.module';

describe('DropdownFieldComponent', () => {
  let component: DropdownFieldComponent;
  let fixture: ComponentFixture<DropdownFieldComponent>;
  const PLACEHOLDER_LABEL = 'test placeholder label';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownFieldComponent],
      imports: [
        CommonModule,
        TaDatagridModule,
        TaDropdownModule,
        TaButtonsModule,
        TaTagsModule,
        VirtualScrollerModule,
        RiskFieldIndicatorModule
      ],
      providers: [RouterModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownFieldComponent);
    component = fixture.componentInstance;
    component.placeholder = PLACEHOLDER_LABEL;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the label to a placeholder when there is no selection', () => {
    component.label = 'name';
    component.selectedOption = undefined;
    expect(component.selectedOptionLabel).toEqual(PLACEHOLDER_LABEL);

    component.selectedOption = '';
    expect(component.selectedOptionLabel).toEqual(PLACEHOLDER_LABEL);

    component.selectedOption = 'test234';
    expect(component.selectedOptionLabel).toEqual('test234');
  });

  it('should use the specified child value when label is specified', () => {
    component.optionLabel = 'testName';
    component.selectedOption = { testName: 'testTextForChildElement' };
    expect(component.selectedOptionLabel).toEqual('testTextForChildElement');
  });

  describe('Multiple', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(DropdownFieldComponent);
      component = fixture.componentInstance;
      component.isMultiple = true;
      component.placeholder = PLACEHOLDER_LABEL;
      component.options = ['First', 'Second', 'Third'];
      component.registerOnChange(() => null);
      spyOn(component, 'propagateChange');
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show all options initially', () => {
      expect(component.filteredOptions).toEqual(['First', 'Second', 'Third']);
      expect(component.selectedOption).toEqual([]);
    });

    it('should removed option from the list if it is selected', () => {
      component.onSelect('First');
      expect(component.filteredOptions).toEqual(['Second', 'Third']);
      expect(component.selectedOption).toEqual(['First']);
    });

    it('should remove two options from the list if they are selected', () => {
      component.onSelect('First');
      component.onSelect('Third');
      expect(component.filteredOptions).toEqual(['Second']);
      expect(component.selectedOption).toEqual(['First', 'Third']);
    });

    it('should add an option back to the list if it is unselected', () => {
      component.onSelect('First');
      component.onSelect('Third');
      expect(component.filteredOptions).toEqual(['Second']);
      expect(component.selectedOption).toEqual(['First', 'Third']);
      component.onRemoveSelectedOption(0);
      expect(component.filteredOptions).toEqual(['First', 'Second']);
      expect(component.selectedOption).toEqual(['Third']);
    });

    it('should do a case-insensitive filter based on search words', () => {
      component.onSearch('ir');
      expect(component.filteredOptions).toEqual(['First', 'Third']);
      expect(component.selectedOption).toEqual([]);
      component.onSearch('IR');
      expect(component.filteredOptions).toEqual(['First', 'Third']);
      expect(component.selectedOption).toEqual([]);
      component.onSearch('zz');
      expect(component.filteredOptions).toEqual([]);
      expect(component.selectedOption).toEqual([]);
    });

    it('should filter by both selecftion and search terms', () => {
      component.onSelect('First');
      component.onSearch('ir');
      expect(component.filteredOptions).toEqual(['Third']);
      expect(component.selectedOption).toEqual(['First']);
    });
  });
});
