import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { forkJoin, Subject, Subscription } from 'rxjs';

import {
  debounceTime,
  distinctUntilChanged,
  flatMap,
  map,
  tap
} from 'rxjs/operators';

import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';

import { defaultTo, highlightText } from '../../utils/basic-utils';

import {
  CategoryID,
  CategoryInterface,
  CategoryLoaderInterface,
  GenericItem,
  ItemID
} from './async-categorical-dropdown.model';

import {
  SearchRequest,
  SearchResponseInterface
} from '../../models/search.model';
import { PlacementArray } from '@trustarc/ui-toolkit/util/positioning';
import { IPageInfo, VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { TaDropdown, ToastService } from '@trustarc/ui-toolkit';

declare const _: any;

const DATA_INVENTORY_LABELS = {
  COMPANY_AFFILIATE: 'Company Affiliate',
  PRIMARY_ENTITY: 'Primary Entity',
  IT_SYSTEM: 'IT System',
  VENDOR: 'Vendor',
  PARTNER: 'Partner',
  CUSTOMER: 'Customer',
  SERVICE_PROVIDER: 'Service Provider',
  BUSINESS_ASSOCIATE: 'Business Associate',
  OTHER: 'Other'
};

@AutoUnsubscribe(['_retrieveCategories$', '_searchEvent$'])
@Component({
  selector: 'ta-async-categorical-dropdown',
  templateUrl: './async-categorical-dropdown.component.html',
  styleUrls: ['./async-categorical-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AsyncCategoricalDropdownComponent),
      multi: true
    }
  ]
})
export class AsyncCategoricalDropdownComponent<T>
  implements ControlValueAccessor, OnInit, OnDestroy {
  static readonly BUFFER_SPACE = 5;

  /**
   * @Input() public isMultiSelect: boolean
   *
   * Set this input to true if more than one item should be selectable at a time.
   */
  @Input() public isMultiSelect: boolean;

  /**
   * @Input() public dropdownAlignment: PlacementArray;
   *
   * Set the location of the drop down menu in relation to the drop down button.
   */
  @Input() public dropdownAlignment: PlacementArray = [
    'bottom-left',
    'top-left'
  ];

  /**
   * @Input() public mapContentItem: (any) => GenericItem<T>
   *
   * This function should take an item of the type returned in the content array
   * of the SearchResponseInterface returned by the getRequestList function, and
   * add appropriate keys to the object so that it is also CategoryItemInterface
   */
  @Input() public mapContentItem: (T) => GenericItem<T>;

  /**
   * @Input() public categoryLoaders: CategoryLoaderInterface[]
   *
   * Each function should take a search string and return an observable the component
   * can use to retrieve a pageable list of items for, given the key that identifiers
   * the category. In other words, the observables represent network requests to make
   * for loading each separate category to be shown.
   */
  @Input()
  public categoryLoaders: CategoryLoaderInterface[];

  /**
   * @Input() set selectedItem(selectedItem: GenericItem<T>)
   *
   * Use this input to Set the selected item, which should be the item type handled by
   * this component, while also including the keys to act as CategoryItemInterface. In
   * addition to setting the selected item, the selected category is automatically set
   * using the categoryId of the given item.
   */
  @Input()
  set selectedItems(selectedItems: GenericItem<T>[]) {
    this._selectedItems = selectedItems;

    if (!this.isMultiSelect && this._selectedItems && this._selectedItems[0]) {
      this._selectedCategoryId = this._selectedItems[0].categoryId;
    }
  }

  /**
   * Input for whether or not to show Add new item link
   */
  @Input() public isAddNewItemLink = false;
  @Input() public isAddNewItemLinkAtBottom = false;

  /**
   * Input string for Add new item link label
   */
  @Input() public addNewItemLinkLabel = 'Add new Item';

  @Input() public placeholder = 'Select or Search';

  /**
   * @Output() public loadFinished
   *
   * This output emits when all of the observables given by the getRequestList function
   * have been completed, at which point all category options as given have been loaded.
   */
  @Output() public loadFinished = new EventEmitter<CategoryInterface<T>[]>();

  /**
   * @Output() public itemSelected
   *
   * This output emits when the selected item has been changed. The item emitted is the
   * newly selected item with at least the properties of the type this component handles.
   */
  @Output() public itemSelected = new EventEmitter<T>();

  /**
   * Output emitter for when Add new Item is clicked
   */
  @Output() public addNewItem = new EventEmitter<any>();
  @Output() public addNewEntity = new EventEmitter<string>();

  public propagateChange: Function;

  public categoryList: CategoryInterface<T>[] = [];
  public _selectedCategoryId: CategoryID;
  public _selectedItems: GenericItem<T>[];

  private searchEvent = new Subject<string>();
  public searchTerm = '';

  private _retrieveCategories$: Subscription;
  private _searchEvent$: Subscription;

  @ViewChild(VirtualScrollerComponent)
  private infiniteScroller: VirtualScrollerComponent;

  @ViewChild('selectorDropdown') selectorDropdown: TaDropdown;

  constructor(private toastService: ToastService) {
    this.mapPageableContent = this.mapPageableContent.bind(this);
    this._selectedItems = [];
  }

  ngOnInit() {
    this._searchEvent$ = this.startSearchHandler();

    this._retrieveCategories$ = this.retrieveCategories().subscribe(() => {
      this.loadFinished.next(this.categoryList);
    });
  }

  ngOnDestroy() {}

  writeValue(value: any) {
    this._selectedItems = defaultTo([], value);
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  // ------------ Helper Functions for Selecting Categories and Items --------------

  public getItemsFor(categoryId: CategoryID): GenericItem<T>[] {
    const category = this.findCategoryById(categoryId);

    return category ? category.items : [];
  }

  public onSelectCategory(categoryId: CategoryID): void {
    this._selectedCategoryId = categoryId;

    if (this.infiniteScroller) {
      const originalAnimation = this.infiniteScroller.scrollAnimationTime;

      this.infiniteScroller.scrollAnimationTime = 0;
      this.infiniteScroller.scrollToIndex(0);
      this.infiniteScroller.scrollAnimationTime = originalAnimation;
    }
  }

  public onSelectItem(item: GenericItem<T>): void {
    if (!this.isSelected(item.id)) {
      if (!this.isMultiSelect) {
        this._selectedItems = [item];
      } else {
        this._selectedItems.push(item);
      }

      this.itemSelected.emit(item);
    }
  }

  // --------------- Helper Functions for Display Text or Elements ----------------

  public getElementId(prefix: string, id: string): string {
    return `${prefix}-${id}`;
  }

  public getDisplayText(): string {
    if (!this.isMultiSelect) {
      return this._selectedItems && this._selectedItems[0]
        ? this._selectedItems[0].name
        : this.placeholder;
    }

    return this.placeholder;
  }

  public getItemText(itemId: ItemID): string {
    const desiredItem = this.findItemById(itemId);

    if (desiredItem) {
      return highlightText(desiredItem.name, this.searchTerm);
    }

    return '';
  }

  public getCategoryText(categoryId: CategoryID): string {
    const category = this.findCategoryById(categoryId);

    if (category) {
      return highlightText(category.name, this.searchTerm);
    }

    return '';
  }

  public isSelected(itemId: ItemID): boolean {
    return this._selectedItems.some(item => item.id === itemId);
  }

  public openDropdown() {
    this.selectorDropdown.open();
  }

  // ---------------------- Helper Functions for Searching ----------------------

  public onSearch(searchTerm: string) {
    this.searchEvent.next(searchTerm);
  }

  private findCategoryById(categoryId: CategoryID): CategoryInterface<T> {
    return this.categoryList.find(category => category.id === categoryId);
  }

  private findCategoryLoaderById(
    categoryId: CategoryID
  ): CategoryLoaderInterface {
    return this.categoryLoaders.find(
      categoryLoader => categoryLoader.categoryId === categoryId
    );
  }

  private findItemById(itemId: ItemID): GenericItem<T> {
    return _(this.categoryList)
      .flatMap(category => (category.items ? category.items : []))
      .find(item => item.id === itemId);
  }

  // ------------------  Retrieval Functions for Category List ------------------

  public onScrollEnd($event: IPageInfo) {
    const currentCategory = this.findCategoryById(this._selectedCategoryId);
    if (!currentCategory) {
      return;
    }

    const currentEndIndex = $event.endIndex;
    const isNonNegative = currentEndIndex >= 0;

    const isAfterBufferSpace =
      currentEndIndex >=
      currentCategory.items.length -
        AsyncCategoricalDropdownComponent.BUFFER_SPACE;

    const isUnvisitedIndex =
      currentEndIndex > currentCategory.metadata.prevScrollIndex;

    const isFullyLoaded =
      currentCategory.items.length >= currentCategory.metadata.totalElements;

    const needsToLoad =
      isNonNegative && isAfterBufferSpace && isUnvisitedIndex && !isFullyLoaded;

    currentCategory.metadata.prevScrollIndex = currentEndIndex;

    if (needsToLoad && !currentCategory.metadata.isLoading) {
      try {
        const categoryLoader: CategoryLoaderInterface = this.findCategoryLoaderById(
          this._selectedCategoryId
        );

        const nextPage = currentCategory.metadata.currentPage + 1;

        const searchRequest: SearchRequest = {
          searchTerm: this.searchTerm,
          page: nextPage,
          size: 100,
          sort:
            categoryLoader && categoryLoader.sort ? categoryLoader.sort : null
        };

        if (categoryLoader === undefined) {
          throw new Error('Error: "categoryLoader" is undefined');
        }

        categoryLoader.requestFunction(searchRequest).subscribe(result => {
          const genericItems = result.content.map(item =>
            this.mapContentItem(item)
          );

          const updatedList = _.uniqBy(
            [...currentCategory.items, ...genericItems],
            'id'
          );

          currentCategory.items = updatedList;
          currentCategory.metadata.isLoading = false;
          currentCategory.metadata.currentPage = nextPage;

          this.loadFinished.next(this.categoryList);
        });
      } catch (error) {
        const errorMessage = 'Unable to load more items';
        console.error(errorMessage, error.message);
        this.toastService.error(errorMessage);
      }
    }
  }

  private startSearchHandler(): Subscription {
    return this.searchEvent
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(searchTerm => {
          this.searchTerm = searchTerm.trim();
          this._selectedCategoryId = null;
          this.categoryList = [];
        }),
        flatMap(() => this.retrieveCategories())
      )
      .subscribe(() => this.loadFinished.next(this.categoryList));
  }

  private mapPageableContent(
    categoryId: CategoryID,
    pageable: SearchResponseInterface<any>
  ) {
    // If an invalid search is used, return an empty valid response.
    if (!pageable || !pageable.content) {
      pageable = {
        totalElements: 0,
        content: []
      } as SearchResponseInterface<any>;
    }

    const mappedItems = pageable.content
      .filter(item => item.name !== 'UNTITLED')
      .map(item => this.mapContentItem(item));

    const mappedResults = {
      items: mappedItems,
      name: this.getRecordTypeLabel(categoryId),
      id: categoryId,
      metadata: {
        prevScrollIndex: 0,
        totalElements: pageable.totalElements,
        currentPage: 0,
        isFullyLoaded: false,
        isLoading: false
      }
    };

    return mappedResults;
  }

  private retrieveCategories() {
    const searchTerm =
      this.searchTerm && this.searchTerm.length > 0 ? this.searchTerm : null;

    const searchRequest: SearchRequest = {
      searchTerm,
      page: 0,
      size: 100,
      sort: null
    };

    // Map the category ID into the response.
    const retrievalList = this.categoryLoaders.map(categoryLoader => {
      const searchRequestSorted = {
        ...searchRequest,
        sort: categoryLoader.sort
      };
      return categoryLoader.requestFunction(searchRequestSorted).pipe(
        map(response => ({
          categoryId: categoryLoader.categoryId,
          response: response
        }))
      );
    });

    return forkJoin(retrievalList).pipe(
      tap(
        (
          categoryLoaderResponses: {
            categoryId: CategoryID;
            response: SearchResponseInterface<T>;
          }[]
        ) => {
          const mappedPageables = categoryLoaderResponses
            .map(categoryLoaderResponse =>
              this.mapPageableContent(
                categoryLoaderResponse.categoryId,
                categoryLoaderResponse.response
              )
            )
            .filter(
              categoryLoaderResponse => categoryLoaderResponse.items.length > 0
            );

          this.categoryList = mappedPageables;
        }
      )
    );
  }

  private getRecordTypeLabel(type) {
    switch (type) {
      case 'COMPANY_AFFILIATE':
        return DATA_INVENTORY_LABELS.COMPANY_AFFILIATE;
      case 'PRIMARY_ENTITY':
        return DATA_INVENTORY_LABELS.PRIMARY_ENTITY;
      case 'IT_SYSTEM':
        return DATA_INVENTORY_LABELS.IT_SYSTEM;
      case 'VENDOR':
        return DATA_INVENTORY_LABELS.VENDOR;
      case 'PARTNER':
        return DATA_INVENTORY_LABELS.PARTNER;
      case 'CUSTOMER':
        return DATA_INVENTORY_LABELS.CUSTOMER;
      case 'SERVICE_PROVIDER':
        return DATA_INVENTORY_LABELS.SERVICE_PROVIDER;
      case 'BUSINESS_ASSOCIATE':
        return DATA_INVENTORY_LABELS.BUSINESS_ASSOCIATE;
      case 'OTHER':
        return DATA_INVENTORY_LABELS.OTHER;
      default:
        return type;
    }
  }

  public onAddNewItem() {
    this.addNewItem.emit();
  }

  public startAddingNewEntity($event, type) {
    event.preventDefault();
    this.addNewEntity.emit(type);
  }
}
