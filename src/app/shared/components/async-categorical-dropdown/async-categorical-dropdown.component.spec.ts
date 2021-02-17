import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TaButtonsModule,
  TaDropdownModule,
  TaSvgIconModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { By } from '@angular/platform-browser';

import { getRegistryCategoryLoaders } from 'src/app/component-registry/component-registry-data';
import { AsyncCategoricalDropdownComponent } from './async-categorical-dropdown.component';
import { Component, Input, OnInit } from '@angular/core';
import { SearchRequest } from '../../models/search.model';
import { IPageInfo } from 'ngx-virtual-scroller';
import { ScrollMetadata } from './async-categorical-dropdown.model';

declare const _: any;

@Component({
  // tslint:disable-next-line
  selector: 'virtual-scroller',
  template: '<ng-content></ng-content>'
})
export class FakeVirtualScrollerComponent implements OnInit {
  @Input() items: any[];

  viewPortItems;

  ngOnInit(): void {
    this.viewPortItems = this.items;
  }
}

describe('AsyncCategoricalDropdownComponent', () => {
  let component: AsyncCategoricalDropdownComponent<any>;
  let fixture: ComponentFixture<AsyncCategoricalDropdownComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AsyncCategoricalDropdownComponent,
        FakeVirtualScrollerComponent
      ],
      imports: [TaButtonsModule, TaDropdownModule, TaSvgIconModule],
      providers: [
        {
          provide: ToastService,
          useValue: jasmine.createSpyObj(ToastService.prototype)
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsyncCategoricalDropdownComponent);

    component = fixture.componentInstance;
    component.categoryLoaders = getRegistryCategoryLoaders({
      isDelayed: false
    });
    component.mapContentItem = item => item;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select the clicked category', () => {
    expect(component._selectedCategoryId).toBeUndefined();

    const selection = fixture.debugElement.query(
      By.css('#async-category-selection-fgh')
    );
    expect(selection).toBeTruthy();

    selection.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(component._selectedCategoryId).toEqual('fgh');
  });

  it('should show items for the selected category', () => {
    fixture.detectChanges();

    const selection = fixture.debugElement.query(
      By.css('#async-category-selection-fgh')
    );

    let itemInCategory = fixture.debugElement.query(
      By.css('#async-item-selection-cat-fgh-item-5')
    );

    expect(selection).toBeTruthy();
    expect(itemInCategory).toBeNull();

    selection.triggerEventHandler('click', {});
    fixture.detectChanges();

    itemInCategory = fixture.debugElement.query(
      By.css('#async-item-selection-cat-fgh-item-5')
    );

    expect(itemInCategory).toBeTruthy();
  });

  it('should select the clicked item', () => {
    const selection = fixture.debugElement.query(
      By.css('#async-category-selection-fgh')
    );
    expect(selection).toBeTruthy();

    selection.triggerEventHandler('click', {});
    fixture.detectChanges();

    const itemInCategory = fixture.debugElement.query(
      By.css('#async-item-selection-cat-fgh-item-5')
    );
    expect(itemInCategory).toBeTruthy();

    itemInCategory.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(component._selectedCategoryId).toEqual('fgh');
    expect(component._selectedItems[0].id).toEqual('cat-fgh-item-5');
  });

  it('should call retrieval function with non-empty search term on search', done => {
    const searchBar = fixture.debugElement.query(
      By.css('#async-category-search-field')
    );

    const searchTerm = 'test-search';
    const loaders = getRegistryCategoryLoaders({ isDelayed: false });

    const spies = loaders.map(loader => ({
      ...loader,
      requestFunction: jasmine
        .createSpy(`spyFor-${loader.categoryId}`, loader.requestFunction)
        .and.callThrough()
    }));

    component.loadFinished.subscribe(() => {
      const expectedSearch: SearchRequest = {
        searchTerm,
        page: 0,
        size: 100,
        sort: 'name,ASC'
      };

      expect(spies[0].requestFunction).toHaveBeenCalled();
      expect(spies[0].requestFunction).toHaveBeenCalledWith(expectedSearch);
      done();
    });

    component.categoryLoaders = spies;

    searchBar.triggerEventHandler('onSearch', searchTerm);
  });

  it('should call retrieval function with null when search string is emptied', done => {
    const searchBar = fixture.debugElement.query(
      By.css('#async-category-search-field')
    );

    const loaders = getRegistryCategoryLoaders({ isDelayed: false });

    const spies = loaders.map(loader => ({
      ...loader,
      requestFunction: jasmine
        .createSpy(`spyFor-${loader.categoryId}`, loader.requestFunction)
        .and.callThrough()
    }));

    component.categoryLoaders = spies;

    component.loadFinished.subscribe(() => {
      const expectedSearch: SearchRequest = {
        searchTerm: null,
        page: 0,
        size: 100,
        sort: 'name,ASC'
      };

      expect(spies[0].requestFunction).toHaveBeenCalled();
      expect(spies[0].requestFunction).toHaveBeenCalledWith(expectedSearch);
      done();
    });

    searchBar.triggerEventHandler('onSearch', '');
  });

  it('should return an empty list of items for an unknown category', () => {
    const itemList = component.getItemsFor('some-invalid-id');

    expect(itemList).toEqual([]);
  });

  it('should return empty display string for unknown item', () => {
    const itemText = component.getItemText('some-invalid-id');

    expect(itemText).toEqual('');
  });

  it('should return empty display string for unknown category', () => {
    const categoryText = component.getCategoryText('some-invalid-id');

    expect(categoryText).toEqual('');
  });

  it('should toast an error if there was a server failure', () => {
    const service: ToastService = TestBed.get(ToastService);

    // Attempt to scroll through a category that does not exist.
    component.categoryList.push({
      id: 'categoryWithNoLoader-id',
      name: 'categoryWithNoLoader-name',
      items: [],
      metadata: { prevScrollIndex: 0 } as ScrollMetadata
    });
    component._selectedCategoryId = 'categoryWithNoLoader-id';
    component.onScrollEnd({ endIndex: 100 } as IPageInfo);
    fixture.detectChanges();
    expect(service.error).toHaveBeenCalledWith('Unable to load more items');
  });
});
