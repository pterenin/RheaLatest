import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  DropdownCategoryGroup,
  DropdownCategoryItem
} from './dropdown-category-group.model';
import { TaDropdown } from '@trustarc/ui-toolkit';

@Component({
  selector: 'ta-dropdown-category-group',
  templateUrl: './dropdown-category-group.component.html',
  styleUrls: ['./dropdown-category-group.component.scss']
})
export class DropdownCategoryGroupComponent implements OnInit {
  @ViewChild('dropdown') dropdown: TaDropdown;

  @Output() selection = new EventEmitter();
  @Output() deselection = new EventEmitter();
  @Input() categories: DropdownCategoryGroup[] = [];

  public filterTerm = '';
  public selectedGroup: DropdownCategoryGroup;
  public selectedItem: DropdownCategoryItem;
  public selectionExists: boolean;
  public groups = [];
  public items = [];
  public allItems = [];
  public searchValue = '';

  constructor() {}

  ngOnInit() {
    this.groups = Object.assign([], this.categories);
    this.items = Object.assign([], this.categories[0].items);
    this.selectedGroup = this.groups[0];
    this.createFullItemListReference();
    this.checkSelectionExists();
  }

  createFullItemListReference() {
    this.groups.forEach(group => this.allItems.push(...group.items));
  }

  checkSelectionExists() {
    const selection = [];
    this.groups.forEach(group =>
      group.items.forEach(item => {
        if (item.selected) {
          selection.push(item);
        }
      })
    );
    this.selectionExists = selection.length ? true : false;
  }

  makeSelection(bool: boolean, valueId) {
    this.items.forEach(listItem => {
      if (listItem.value === valueId) {
        listItem.selected = bool;
      }
    });
  }

  onSelectedItem(event, item: DropdownCategoryItem) {
    event.target.checked
      ? this.makeSelection(true, item.value)
      : this.makeSelection(false, item.value);
    this.checkSelectionExists();
    this.selection.emit(this.groups);
  }

  selectedItemsCount(items: DropdownCategoryItem[]) {
    const selection = items.filter(item => item.selected);
    return selection.length;
  }

  onSelectedGroup(group: DropdownCategoryGroup) {
    this.selectedGroup = group;
    this.items = group.items;
    // auto search after selected another group
    if (this.searchValue) {
      this.onSearch(this.searchValue);
    }
  }

  toggleSelectAll($event, items: DropdownCategoryItem[]) {
    items.forEach(item => (item.selected = $event.target.checked));
    this.checkSelectionExists();
    this.selection.emit(this.groups);
  }

  shouldSelectAll(items: DropdownCategoryItem[]) {
    const selection = items.filter(item => item.selected);
    return selection.length === items.length;
  }
  isIndeterminate(items: DropdownCategoryItem[]) {
    const selection = items.filter(item => item.selected);
    return selection.length && selection.length !== items.length;
  }

  onSearch(search: string) {
    this.filterTerm = search;
  }

  onClose(item) {
    this.dropdown.close();
    this.updateItemInGroup(false, item.value);
    this.checkSelectionExists();
    this.deselection.emit(item);
    this.selection.emit(this.groups);
  }

  updateItemInGroup(bool: boolean, valueId) {
    this.groups.forEach(group => {
      const relatedGroupItem = group.items.filter(
        item => item.value === valueId
      );
      if (relatedGroupItem.length > 0) {
        relatedGroupItem.map(x => {
          x.selected = bool;
          return x;
        });
      }
    });
  }
}
