import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { DropdownCategoryGroupComponent } from './dropdown-category-group.component';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaSvgIconModule,
  TaTagsModule
} from '@trustarc/ui-toolkit';
import { DropdownCategoryGroupSearchFilterPipe } from './dropdown-category-group-search-filter.pipe';
import { DropdownCategoryGroupItemSelectedPipe } from './dropdown-category-group-item-selected.pipe';

describe('DropdownCategoryGroupComponent', () => {
  let component: DropdownCategoryGroupComponent;
  let fixture: ComponentFixture<DropdownCategoryGroupComponent>;

  const categories = [
    // default to render component without any data during development
    {
      group: 'Default Category 1',
      items: [
        { selected: false, value: 1, text: 'Category 1 Item 1' },
        { selected: false, value: 2, text: 'Category 2 Item 2' }
      ]
    },
    {
      group: 'Default Category 2',
      items: [
        { selected: true, value: 9, text: 'Category 2 Item 1' },
        { selected: false, value: 10, text: 'Category 2 Item 2' }
      ]
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DropdownCategoryGroupComponent,
        DropdownCategoryGroupSearchFilterPipe,
        DropdownCategoryGroupItemSelectedPipe
      ],
      imports: [
        CommonModule,
        TaCheckboxModule,
        TaDropdownModule,
        TaButtonsModule,
        TaSvgIconModule,
        TaTagsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownCategoryGroupComponent);
    component = fixture.componentInstance;
    component.categories = categories;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('a selection should exist', () => {
    component.checkSelectionExists();
    expect(component.selectionExists).toBe(true);
  });

  it('should make a selection', () => {
    component.makeSelection(true, 1);
    const item = component.items[0];
    expect(item.selected).toBe(true);
  });

  it('should select all items', () => {
    const items = categories[1].items;
    component.toggleSelectAll({ target: { checked: true } }, items);
    const selection = items.filter(item => item.selected);
    expect(selection.length).toEqual(items.length);
  });

  it('shouldSelectAll should be false', () => {
    const items = categories[0].items;
    expect(component.shouldSelectAll(items)).toBe(false);
  });

  it('isIndeterminate should return true', () => {
    const items = categories[0].items;
    expect(component.isIndeterminate(items)).toBe(true);
  });
});
