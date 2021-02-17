import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Category, CategoryInterface, Selection } from './category-model';
import { Item } from './item-model';
import { defaultTo, highlightText } from '../../utils/basic-utils';
import { GlobalRegionInterface } from '../../models/location.model';
import { TaPopover } from '@trustarc/ui-toolkit';

export interface DataInterface {
  id: string;
  label: string;
  isCustom?: boolean;
  categoryId?: string;
  items: Array<{
    label: string;
    id: string;
    selected: boolean;
    subItem?: string;
    isCustom?: boolean;
    isCategoryCustom?: boolean;
  }>;
}

declare const _: any;

@Component({
  selector: 'ta-categorical-view',
  templateUrl: './categorical-view.component.html',
  styleUrls: ['./categorical-view.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoricalViewComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class CategoricalViewComponent
  implements ControlValueAccessor, OnChanges, OnInit {
  public categories: CategoryInterface[] = [];
  public _data: DataInterface[];
  public result: CategoryInterface[];
  public propagateChange: Function;

  @Input() public idPrefix: string;
  @Input() public openByDefault = true;
  @Input() public openDropdown = true;
  @Input() public placeHolder = 'Search';
  @Input() public requestSearchControl = false;
  @Input() public reselectable = false;
  @Input() public searchString: string;
  @Input() public selectFirstCategory = true;
  @Input() public selectedCategory: CategoryInterface;
  @Input() public showCategoryItemCount = true;
  @Input() public showCheckboxes: boolean;
  @Input() public showCounts: boolean;
  @Input() public enableCustomCategoryTag = false;
  @Input() public showThreeLetterCountryCode = false;
  @Input() public singleSelect = false;
  @Input() public styleClass = 'categorical-view-component';
  @Input() public consolidateLocations: boolean;
  @Input() locationDatas: GlobalRegionInterface[] = [];

  @Input() set data(data: DataInterface[]) {
    this._data = data;
  }

  get data(): DataInterface[] {
    return this._data;
  }

  @Output() public selections = new EventEmitter<Selection[]>();
  @Output() public itemSelected = new EventEmitter<Item>();
  @Output() public dropdownOpenChanged = new EventEmitter<boolean>();
  @Output() public itemDeleted = new EventEmitter<Item>();
  @Output() public searchEvent = new EventEmitter<string>();

  @ViewChildren(TaPopover) locationTooltips: QueryList<TaPopover>;

  constructor(private eRef: ElementRef) {
    // default values will be overwritten when input value is provided.
    this.showCheckboxes = false;
    this.idPrefix = 'category_';
  }

  @HostListener('document:click', ['$event'])
  public clickOut($event) {
    if (
      !this.eRef.nativeElement.contains($event.target) &&
      !this.openByDefault
    ) {
      this.closeDropdown();
    }
  }

  public createCategories(selectFirstCategory) {
    if (this._data === null || this._data === undefined) {
      return;
    }

    this.categories = this._data.map(data => {
      return new Category(
        data.label,
        data.items,
        data.id || _.uniqueId(this.idPrefix),
        data.isCustom
      );
    });

    if (selectFirstCategory || !this.selectedCategory) {
      this.selectedCategory = this.categories[0];
    } else {
      // when data has changes need update item of selected category
      this.selectedCategory = this.categories.find(cat => {
        return cat.label === this.selectedCategory.label;
      });

      if (!this.selectedCategory) {
        this.selectedCategory = this.categories[0];
      }
    }
  }

  ngOnInit() {
    this.createCategories(true);
    this.openDropdown = this.openByDefault;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.data) {
      this.createCategories(this.selectFirstCategory);
    }
  }

  public componentFocused() {
    this.openDropdown = true;
    this.dropdownOpenChanged.emit(true);
  }

  public itemClicked(event: Event, item) {
    if (this.showCheckboxes) {
      event.preventDefault();
      event.stopPropagation();
      item.selected = !item.selected;
      this.onItemChange(item);
      return;
    }
    this.closeDropdown();
  }

  public closeDropdown() {
    this.openDropdown = false;
    this.dropdownOpenChanged.emit(false);
  }

  public writeValue(value: any) {
    if (value !== undefined) {
      this.result = value;
    }
  }

  public registerOnChange(fn) {
    this.propagateChange = fn;
  }

  public registerOnTouched() {}

  public onItemChange(item) {
    this.getResult();

    if (item.selected) {
      this.itemSelected.emit(item);
    } else {
      this.itemDeleted.emit(item);
    }
  }

  public getResult() {
    if (this.categories === null || this.categories === undefined) {
      return;
    }

    let resultCategories = this.categories.map(category => {
      const selectedItems = category.items.filter(item => item.selected);
      const items = selectedItems.map(item => ({
        label: item.label,
        id: item.id
      }));
      return { id: category.id, label: category.label, items };
    });

    // filter categories with no items
    resultCategories = resultCategories.filter(
      resultCategory => resultCategory.items.length > 0
    );

    if (this.propagateChange) {
      this.propagateChange(resultCategories);
    }

    // send the selected data through output
    this.selections.emit(resultCategories);
  }

  public onItemClick(item: any, selectedCategory: any) {
    if ((item.selected && !this.reselectable) || item.unReselectable) {
      return;
    }
    if (this.singleSelect) {
      this.uncheckAll();
    }
    this.findAndChangeItem(item.id, true, selectedCategory);
    this.onItemChange(item);
    this.closeDropdown();
  }

  public uncheckAll() {
    if (this.categories === null || this.categories === undefined) {
      return;
    }
    // use forEach() here. map() causes bugs in this case
    this.categories.forEach(category => {
      category.items.forEach(item => {
        item.selected = false;
      });
    });
  }

  public findAndChangeItem(
    itemId: string,
    newValue: boolean,
    selectedCategory: any
  ) {
    this.categories.find(category => {
      if (selectedCategory && category === selectedCategory) {
        const foundItem = category.items.find(item => item.id === itemId);

        if (foundItem === undefined || foundItem === null) {
          return false;
        }
        foundItem.selected = newValue;
        return true;
      }
    });
  }

  public findAndChangeItemForCheckBoxes(itemId: string, newValue: boolean) {
    this.categories.find(category => {
      const foundItem = category.items.find(item => item.id === itemId);

      if (foundItem === undefined || foundItem === null) {
        return false;
      }
      foundItem.selected = newValue;
      return true;
    });
  }

  public checkAll(event: Event, category: Category) {
    event.preventDefault();
    event.stopPropagation();
    const selectedCount = category.getSelectedItemCount();
    if (selectedCount > 0) {
      category.items.forEach(item => {
        if (!item.hidden) {
          item.selected = false;
        }
        this.itemSelected.emit(item);
      });
    } else {
      category.items.forEach(item => {
        item.selected = !item.hidden;
        this.itemSelected.emit(item);
      });
    }
    this.getResult();
  }

  private search() {
    // Search string must be at least two characters; otherwise, we clear search entirely
    const searchString =
      this.searchString.length >= 2 ? this.searchString.toLowerCase() : '';

    this.categories.forEach(category => {
      const categoryLabel = category.label.toLowerCase();

      if (searchString && categoryLabel.search(searchString) === -1) {
        category.items.forEach(item => {
          const itemLabel = item.label.toLowerCase();

          item.hidden = itemLabel.search(searchString) === -1;
        });

        // hide category if every child is hidden
        category.hidden = category.items.every(item => item.hidden);
      } else {
        // if category satisfies search or search is empty than show category and all it's children
        category.showAllItems();
      }
    });
  }

  public onSearch() {
    if (this.requestSearchControl) {
      this.searchEvent.next(this.searchString);
      return;
    }

    this.search();

    if (!this.selectedCategory || this.selectedCategory.hidden) {
      // if selected category is hidden select first visible category
      this.selectedCategory = this.categories.find(
        category => !category.hidden
      );
    }
  }

  public getSelected(category: Category) {
    return defaultTo([], category.items).filter(item => item.selected).length;
  }

  public getCategoryLabel(category: Category) {
    return highlightText(category.label, this.searchString);
  }

  public getItemLabel(item: Item) {
    return highlightText(item.label, this.searchString);
  }

  public changeSelectedCategory(event: Event, category: Category) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedCategory = category;
  }

  public triggerLocationTooltip(tip) {
    if (!this.consolidateLocations) {
      return;
    }

    this.locationTooltips.forEach(tooltip => {
      tooltip.close();
    });

    tip.open();
  }

  public getTooltipLocationList(locationIds: string[]) {
    const datas = this.locationDatas && locationIds;
    if (datas) {
      let locations = this.locationDatas.map(a => Object.assign({}, a));
      locations = locations.filter(region => {
        region.total = region.countries.length;
        region.countries = region.countries.filter(country => {
          return locationIds.find(locId => {
            return country.locationIds.includes(locId) || locId === country.id;
          });
        });
        return region.countries.length > 0;
      });
      return locations;
    }
    return [];
  }
}
