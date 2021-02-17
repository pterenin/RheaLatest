import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  Category,
  CategoryInterface
} from '../categorical-view/category-model';
import { Item } from '../categorical-view/item-model';
import { highlightText } from '../../utils/basic-utils';

export interface DataInterface {
  id: string;
  label: string;
  isCustom?: boolean;
  items: Array<{
    label: string;
    id: string;
    selected: boolean;
    subItem?: string;
  }>;
}

declare const _: any;

@Component({
  selector: 'ta-categorical-management',
  templateUrl: './categorical-management.component.html',
  styleUrls: ['./categorical-management.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoricalManagementComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class CategoricalManagementComponent
  implements ControlValueAccessor, OnChanges, OnInit {
  public categories: CategoryInterface[] = [];
  public selectedCategory: CategoryInterface;
  public _data: DataInterface[];
  public result: CategoryInterface[];
  public propagateChange: Function;

  @Input() public styleClass = 'categorical-management-component';
  @Input() public searchString: string;
  @Input() public placeHolder = 'Search';
  @Input() public idPrefix: string;
  @Input() public selectFirstCategory = true;
  @Input() public type: 'data-elements' | 'processing-purpose' =
    'data-elements';
  @Input() set data(data: DataInterface[]) {
    this._data = data;
  }

  get data(): DataInterface[] {
    return this._data;
  }

  @Output() public editCategory = new EventEmitter<Category>();
  @Output() public deleteCategory = new EventEmitter<Category>();
  @Output() public editItem = new EventEmitter<Item>();
  @Output() public deleteItem = new EventEmitter<Item>();

  constructor(private eRef: ElementRef) {
    // default values will be overwritten when input value is provided.
    this.idPrefix = 'category_';
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
      this.selectedCategory = this.categories.find(cate => {
        return cate.label === this.selectedCategory.label;
      });
      if (!this.selectedCategory) {
        this.selectedCategory = this.categories[0];
      }
    }
  }

  ngOnInit() {
    this.createCategories(true);
  }

  ngOnChanges() {
    this.createCategories(this.selectFirstCategory);
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

  private search() {
    const searchString = this.searchString.toLowerCase();

    this.categories.forEach(category => {
      const label = category.label.toLowerCase();

      if (searchString && label.search(searchString) === -1) {
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
    this.search();
    if (!this.selectedCategory || this.selectedCategory.hidden) {
      // if selected category is hidden select first visible category
      this.selectedCategory = this.categories.find(
        category => !category.hidden
      );
    }
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

  public onEditCategory(category: Category) {
    this.editCategory.emit(category);
  }

  public onDeleteCategory(category: Category) {
    this.deleteCategory.emit(category);
  }

  public onEditItem(item: Item, selectedCategory: Category) {
    this.editItem.emit(item);
  }

  public onDeleteItem(item: Item, selectedCategory: Category) {
    this.deleteItem.emit(item);
  }
}
