import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Step4SelectedItemsContainerService } from './step-4-selected-items-container.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CreateBusinessProcessesService } from 'src/app/business-processes/create-bp/create-business-processes.service';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { Subscription } from 'rxjs';
import { LocationService } from '../../services/location/location.service';
import {
  CategoryItemInterface,
  CategoryLoaderInterface
} from '../async-categorical-dropdown/async-categorical-dropdown.model';
import { AsyncCategoricalDropdownComponent } from '../async-categorical-dropdown/async-categorical-dropdown.component';
import { ItSystemWithLocationId } from 'src/app/business-processes/create-bp/step-4/step-4.model';

declare const _: any;

@AutoUnsubscribe(['_itSystems$'])
@Component({
  selector: 'ta-step-4-selected-items-container',
  templateUrl: './step-4-selected-items-container.component.html',
  styleUrls: ['./step-4-selected-items-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    Step4SelectedItemsContainerService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Step4ItemsComponent),
      multi: true
    }
  ]
})
export class Step4ItemsComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  public clearAllTooltip: string;
  public dropdownId: string;
  public selectorHeight: string;

  @Input() height: string;
  @Input() close: boolean;

  @Output() allItemsDeleted = new EventEmitter<any>();
  @Output() dataChange = new EventEmitter<any>();
  @Output() itemAdded = new EventEmitter<any>();
  @Output() itemClicked = new EventEmitter<any>();
  @Output() itemDeleted = new EventEmitter<any>();
  @Output() addNewSystem = new EventEmitter<any>();

  public categoryLoaders: CategoryLoaderInterface[] = [
    {
      categoryId: 'PRIMARY_ENTITY',
      requestFunction: searchRequest =>
        this.createBusinessProcessesService.searchItSystems(
          'PRIMARY_ENTITY',
          searchRequest
        ),
      sort: 'name,ASC'
    },
    {
      categoryId: 'VENDOR',
      requestFunction: searchRequest =>
        this.createBusinessProcessesService.searchItSystems(
          'VENDOR',
          searchRequest
        ),
      sort: 'name,ASC'
    },
    {
      categoryId: 'PARTNER',
      requestFunction: searchRequest =>
        this.createBusinessProcessesService.searchItSystems(
          'PARTNER',
          searchRequest
        ),
      sort: 'name,ASC'
    },
    {
      categoryId: 'CUSTOMER',
      requestFunction: searchRequest =>
        this.createBusinessProcessesService.searchItSystems(
          'CUSTOMER',
          searchRequest
        ),
      sort: 'name,ASC'
    },
    {
      categoryId: 'SERVICE_PROVIDER',
      requestFunction: searchRequest =>
        this.createBusinessProcessesService.searchItSystems(
          'SERVICE_PROVIDER',
          searchRequest
        ),
      sort: 'name,ASC'
    },
    {
      categoryId: 'BUSINESS_ASSOCIATE',
      requestFunction: searchRequest =>
        this.createBusinessProcessesService.searchItSystems(
          'BUSINESS_ASSOCIATE',
          searchRequest
        ),
      sort: 'name,ASC'
    },
    {
      categoryId: 'COMPANY_AFFILIATE',
      requestFunction: searchRequest =>
        this.createBusinessProcessesService.searchItSystems(
          'COMPANY_AFFILIATE',
          searchRequest
        ),
      sort: 'name,ASC'
    },
    {
      categoryId: 'ALL',
      requestFunction: searchRequest =>
        this.createBusinessProcessesService.searchAllItSystems(searchRequest),
      sort: 'name,ASC'
    }
  ];

  public onChange: Function;
  public onTouched: Function;

  @ViewChild(AsyncCategoricalDropdownComponent)
  private dropdown: AsyncCategoricalDropdownComponent<any>;
  private possibleItems = [];
  public disallowedItems = [];

  private _itSystems$: Subscription;

  constructor(
    private selectedItemsContainerService: Step4SelectedItemsContainerService,
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private locationService: LocationService
  ) {
    this.mapContentItem = this.mapContentItem.bind(this);

    this.selectorHeight = this.height;
    this.clearAllTooltip = 'Clear all items'; // [i18n-tobeinternationalized]
    this.dropdownId = _.uniqueId('bpDataItemsSelect-');

    this.clearAllDataItems();
  }

  ngOnInit() {}

  ngOnChanges() {}

  ngOnDestroy() {}

  public mapContentItem(contentItem): CategoryItemInterface {
    return {
      ...contentItem,
      label: contentItem.name,
      tag: contentItem.type,
      categoryId: contentItem.type
    };
  }

  public onRequestListLoaded($event: any) {
    this.possibleItems = $event;
    this.setDisallowedItems(this.getSelectedDataItems());
  }

  writeValue(value: any) {}

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  public getSelectedDataItems(): any[] {
    return this.selectedItemsContainerService.getSelectedDataItems();
  }

  public setSelectedDataItems(selectedItems: ItSystemWithLocationId[]) {
    this.selectedItemsContainerService.setSelectedDataItems(selectedItems);
    this.setDisallowedItems(selectedItems);
  }

  public onDropdownItemClicked(selection: any) {
    this.itemAdded.emit(selection);
  }

  public onItemClick(item) {
    this.itemClicked.emit(item);
  }

  public removeFromList(item) {
    this.itemDeleted.emit(item);
  }

  public renderListAfterRemovingItem(item) {
    this.selectedItemsContainerService.removeItemByNodeId(item.nodeId);

    const selectedDataItems = this.selectedItemsContainerService.getSelectedDataItems();
    this.setDisallowedItems(selectedDataItems);
  }

  public clearAllDataItems() {
    const selectedItems = this.selectedItemsContainerService.getSelectedDataItems();
    this.allItemsDeleted.emit(selectedItems);
  }

  public renderEmptyList() {
    this.selectedItemsContainerService.clearAllSelectedDataItems();
    this.disallowedItems = [];
  }

  // if blue info ribbon badge has info tooltip icon
  public showInfoTooltip(data: any, index) {
    // TIMF-4116 - service call to show custom tooltip goes here
  }

  private setDisallowedItems(selectedItems) {
    const selectedItSysLocPairs = _(selectedItems)
      .groupBy('id')
      .mapValues(itemList => {
        const locationIdList = itemList
          .map(item => item.locations)
          .map(locations => {
            return locations.map(location => {
              return this.locationService.getCountryIdByThreeLetterCode(
                location.country.threeLetterCode
              );
            });
          });
        return locationIdList[0];
      })
      .value();

    const actualSelectedItems = _(this.possibleItems)
      .filter(category => category.id !== 'ALL')
      .flatMap(category => category.items)
      .filter(item => {
        const selectedCountryIds = selectedItSysLocPairs[item.id];

        const possibleCountryIds = item.locations.map(
          location => location.countryId
        );

        const remainingOptions = _.difference(
          possibleCountryIds,
          selectedCountryIds
        );

        return remainingOptions.length <= 0;
      })
      .value();

    this.disallowedItems = actualSelectedItems;
  }

  public onAddNewSystem() {
    this.addNewSystem.emit();
  }
}
