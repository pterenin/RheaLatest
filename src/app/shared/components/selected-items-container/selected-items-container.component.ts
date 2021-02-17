import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { CategoricalViewComponent } from '../categorical-view/categorical-view.component';
import { LabelBadgeComponent } from '../../../shared/components/label-badge/label-badge.component';
import { SelectedItemsContainerService } from './selected-items-container.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LocationService } from '../../services/location/location.service';
import { GlobalRegionInterface } from '../../models/location.model';

declare const _: any;

@Component({
  selector: 'ta-selected-items-container',
  templateUrl: './selected-items-container.component.html',
  styleUrls: ['./selected-items-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    SelectedItemsContainerService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectedItemsContainerComponent),
      multi: true
    }
  ]
})
export class SelectedItemsContainerComponent
  implements OnInit, OnChanges, ControlValueAccessor {
  public dropdownId: string;
  public clearAllTooltip: string;
  public selectorHeight: string;
  public _data: any;
  public selectedDataItems = [];
  @Input() showRiskFields: boolean;
  @Input() close: boolean;
  @Input() grouped = false;
  @Input() autoClose: boolean | 'outside' | 'inside' = true;
  @Input() dropdownText: string;
  @Input() emptyStateLink = 'Add';
  @Input() emptyStateText = 'data items';
  @Input() height: string;
  @Input() info: boolean;
  @Input() isLoading = false;
  @Input() reselectable: boolean;
  @Input() showCounts: boolean;
  @Input() showThreeLetterCountryCode: Boolean = false;
  @Input() useCheckboxes: boolean;
  @Input() useLocation: boolean;
  @Input() width: string;
  @Input() consolidateLocations: boolean;
  @Input() locations = [];
  @Input() init = [];
  @Input() fullCountryList: GlobalRegionInterface[];
  @Input() showCustomTag = false;
  @Input() options = null;

  @Input()
  set data(data: any) {
    this._data = data;
  }
  get data(): any {
    return this._data;
  }

  @Output() selectionChanged = new EventEmitter<any>();
  @Output() allItemsDeleted = new EventEmitter<any>();
  @Output() itemDeleted = new EventEmitter<any>();
  @Output() groupDeleted = new EventEmitter<any>();
  @Output() itemClicked = new EventEmitter<any>();
  @Output() itemAdded = new EventEmitter<any>();
  @Output() dataChange = new EventEmitter<any>();
  @Output() itemAddingForbidden = new EventEmitter<void>();

  public onChange: Function;
  public onTouched: Function;
  @ViewChild(CategoricalViewComponent) child: CategoricalViewComponent;
  @ViewChildren('labelBadgeComponent') labelBadgeComponent: QueryList<
    LabelBadgeComponent
  >;

  public locationDatas: GlobalRegionInterface[];

  constructor(
    private selectedItemsContainerService: SelectedItemsContainerService,
    private locationService: LocationService
  ) {
    this.selectorHeight = this.height;
    this.clearAllTooltip = 'Clear all items'; // [i18n-tobeinternationalized]
    this.dropdownId = _.uniqueId('bpDataItemsSelect-');
    this.dropdownText = 'Select'; // [i18n-tobeinternationalized]
    this.reselectable = false;
  }

  closeBadgeTooltips() {
    this.labelBadgeComponent.toArray().forEach(labelBadgeComponent => {
      if (labelBadgeComponent && labelBadgeComponent.tip) {
        labelBadgeComponent.tip.close();
      }
    });
  }

  ngOnInit() {
    this.initLocationData();
    this.syncFromDataToSelection();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initLocationData();
    this.syncFromDataToSelection();
  }

  writeValue(value: any) {
    if (value) {
      this._data = value;
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  private updateSelectedDataItems() {
    const selectedList = this.selectedItemsContainerService.getSelectedDataItems();
    this.selectedDataItems = selectedList.sort((itemA, itemB) =>
      itemA.label > itemB.label ? 1 : itemB.label > itemA.label ? -1 : 0
    );
  }

  public syncFromDataToSelection() {
    const dataExists = this._data !== undefined && this._data !== null;
    const childExists = this.child !== undefined && this.child !== null;

    this.updateSelectedDataItems();

    if (dataExists) {
      this._data.forEach(category => {
        category.items.forEach(item => {
          const isInSelectedDataItems = this.selectedDataItems.some(
            selectedItem => selectedItem.id === item.id
          );

          if (item.selected && !isInSelectedDataItems) {
            this.selectedItemsContainerService.addSelectedDataItem(item);
          }

          if (!childExists) {
            return;
          }

          this.child.findAndChangeItem(item.id, true, category);
        });
      });
    }
  }

  private initLocationData() {
    if (!this.fullCountryList) {
      return;
    }
    const fullCountryList = this.fullCountryList;
    this.locationService.getLocationsRaw().subscribe(locations => {
      if (Array.isArray(locations) && this.fullCountryList) {
        // add locationID for each country
        fullCountryList.map(region => {
          region.countries.map(country => {
            const found = Object.assign(
              [],
              locations.filter(loc =>
                loc.country ? loc.country.id === country.id : false
              )
            );
            country.locationId = null;
            country.locationIds = [];

            if (found.length > 0) {
              country.locationId = found[0].id;
              country.locationIds = found.map(location => location.id);
            }
          });
        });
      }
    });
    this.locationDatas = fullCountryList;
  }

  public getSelectedDataItems(): any[] {
    const selectedList = this.selectedItemsContainerService.getSelectedDataItems();
    return selectedList.sort((itemA, itemB) =>
      itemA.label > itemB.label ? 1 : itemB.label > itemA.label ? -1 : 0
    );
  }

  public setSelectedDataItems(selectedItems) {
    this.selectedItemsContainerService.setSelectedDataItems(selectedItems);
    this.syncFromDataToSelection();
  }

  public onSelectionChange(selection: any) {
    if (selection.selected) {
      const selectedBefore = this.getSelectedDataItems();
      const isExisting = selectedBefore.find(item => item.id === selection.id);
      if (!isExisting) {
        this.selectedItemsContainerService.addSelectedDataItem(selection);
        const selectedItems = this.getSelectedDataItems();
        this.selectionChanged.emit({
          selection,
          selectedItems
        });
        this.itemAdded.emit(selection);
      } else {
        this.itemAddingForbidden.emit();
      }
    } else {
      this.removeFromList(selection);
    }
  }

  public onItemClick(item) {
    this.itemClicked.emit(item);
  }

  public initializeAllDataItemsToBeEmpty(clearData: boolean = true) {
    this.selectedItemsContainerService.clearAllSelectedDataItems();

    if (clearData) {
      this._data = [];
    }
  }

  public clearAllDataItems() {
    this.selectedItemsContainerService.clearAllSelectedDataItems();

    this._data = this._data.map(category => {
      return {
        ...category,
        items: category.items.map(item => ({ ...item, selected: false }))
      };
    });

    this.dataChange.emit(this._data);
    this.allItemsDeleted.emit();

    if (this.child !== undefined) {
      this.child.uncheckAll();
    }
    this.updateSelectedDataItems();
    this.selectionChanged.emit({
      selection: null,
      selectedItems: this.selectedDataItems
    });
  }

  public removeFromList(item, ouputDeleteEvent: Boolean = true) {
    if (item.nodeId) {
      this.selectedItemsContainerService.removeItemByNodeId(item);
    } else {
      this.selectedItemsContainerService.removeItemById(item.id);
    }

    if (ouputDeleteEvent) {
      this.itemDeleted.emit(item);
    }

    if (this.child === undefined) {
      return;
    }

    this.child.findAndChangeItemForCheckBoxes(item.id, false);

    this.updateSelectedDataItems();
    this.selectionChanged.emit({
      selection: {
        ...item,
        selected: false
      },
      selectedItems: this.selectedDataItems
    });
  }

  // remove group of items (as on step 3 of BP)
  public removeGroupFromList(item) {
    const bpId = item.businessProcessId;
    const nodeId = item.nodeId;
    item.selection = item;
    item.selection.selected = false;
    item.selectedItems = [];
    this.selectedItemsContainerService.removeGroupedItems(bpId, nodeId);
    this.updateSelectedDataItems();
    this.groupDeleted.emit(item);
  }

  // if blue info ribbon badge has info tooltip icon
  public showInfoTooltip(data: any, index) {
    // TIMF-4116 - service call to show custom tooltip goes here
  }
}
