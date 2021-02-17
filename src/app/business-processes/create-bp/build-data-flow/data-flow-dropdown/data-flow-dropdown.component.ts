import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  EventEmitter,
  ViewChildren,
  QueryList
} from '@angular/core';
import { GlobalRegionInterface } from 'src/app/shared/models/location.model';
import { highlightText } from 'src/app/shared/utils/basic-utils';
import { DataFlowDropdownLabelComponent } from '../data-flow-dropdown-label/data-flow-dropdown-label.component';

declare const _: any;

@Component({
  selector: 'ta-data-flow-dropdown',
  templateUrl: './data-flow-dropdown.component.html',
  styleUrls: ['./data-flow-dropdown.component.css']
})
export class DataFlowDropdownComponent implements OnInit, OnChanges {
  @Input() dataFlow;
  @Input() direction: 'sending' | 'receiving';
  @Input() hasRHEA_NEW_UI_STEPS_34_LICENSE: boolean;
  @Input() currentItSystem: any;
  @Input() text = 'select';
  @Input() locationDatas: GlobalRegionInterface[] = [];
  @Input() open = false;
  @Input() isFetching: boolean;

  @Output() public itemSelected = new EventEmitter();

  @ViewChildren(DataFlowDropdownLabelComponent) locationTooltips: QueryList<
    DataFlowDropdownLabelComponent
  >;

  public selectedGroup: any;
  public selectedSubGroup: any;
  public items: any[];
  public groups = [];
  public searchValue = '';

  ngOnInit(): void {}

  onSelectedItem(item: any) {
    this.itemSelected.emit(item);
  }

  onSelectedGroup(group: any) {
    this.selectedGroup = group;
    if (group.subCategories) {
      this.onSelectSubGroup(group.subCategories[0]);
    } else {
      this.items = group.items;
    }
  }

  onSelectSubGroup(subGroup) {
    this.selectedSubGroup = subGroup;
    this.items = subGroup.items;
  }

  public triggerLocationTooltip(tip) {
    this.locationTooltips.forEach(tooltip => {
      tooltip.closePopover();
    });

    tip.open();
  }

  private filterSearchItems(item) {
    const itemLabel = item.label.toLowerCase();
    item.hidden = itemLabel.search(this.searchValue) === -1;
  }

  public onSearch(search: string) {
    // Search string must be at least two characters; otherwise, we clear search entirely
    this.searchValue = search.length >= 2 ? search.toLowerCase() : '';
    if (!this.searchValue) {
      this.showAllGroups();
    }
    this.groups.forEach(category => {
      if (category.subCategories) {
        category.subCategories.forEach(subGroup => {
          subGroup.items.forEach(item => this.filterSearchItems(item));
          // hide category if every child is hidden
          subGroup.hidden = subGroup.items.every(subItem => subItem.hidden);
        });
        // hide category if every child is hidden
        category.hidden = category.subCategories.every(
          subGroup => subGroup.hidden
        );
      } else if (category.items) {
        category.items.forEach(item => this.filterSearchItems(item));
        // hide category if every child is hidden
        category.hidden = category.items.every(item => item.hidden);
      }
    });
    this.selectGroupWithVisibleItems();
  }

  private selectGroupWithVisibleItems() {
    if (!this.selectedGroup || this.selectedGroup.hidden) {
      // if selected category is hidden select first visible category
      const groupToSelect = this.groups.find(category => !category.hidden);
      if (groupToSelect) {
        this.onSelectedGroup(groupToSelect);
      }
    }
    // select not hidden subCategory
    if (
      this.isThreeLevel() &&
      (!this.selectedSubGroup || this.selectedSubGroup.hidden)
    ) {
      const subGroupToSelect = this.selectedGroup.subCategories.find(
        category => !category.hidden
      );
      if (subGroupToSelect) {
        this.onSelectSubGroup(subGroupToSelect);
      }
    }
  }

  public getCategoryLabel(category) {
    return highlightText(category.label, this.searchValue);
  }

  private showAllItemsForCategory(category) {
    category.hidden = false;
    if (category.items) {
      category.items.forEach(item => (item.hidden = false));
    }
    if (category.subCategories) {
      category.subCategories.forEach(subGroup =>
        this.showAllItemsForCategory(subGroup)
      );
    }
  }

  private showAllGroups() {
    this.groups.forEach(category => {
      this.showAllItemsForCategory(category);
    });
  }

  private initOptions() {
    this.groups =
      this.direction === 'receiving'
        ? this.currentItSystem.recieveFromOptions
        : this.currentItSystem.sendToOptions;

    if (this.hasRHEA_NEW_UI_STEPS_34_LICENSE && this.direction === 'sending') {
      this.buildDataRecepientsCategories();
    }
    this.onSelectedGroup(this.groups[0]);
  }

  private buildDataRecepientsCategories() {
    const dataRecepientGroup = this.groups.find(
      group => group.label === 'Data Recipients'
    );
    if (!dataRecepientGroup.items) {
      return;
    }
    const drCategories = _.uniqBy(dataRecepientGroup.items, 'tag').map(
      item => ({
        label: item.tag,
        id: _.uniqueId('drt'),
        items: dataRecepientGroup.items.filter(
          categoryItem => categoryItem.tag === item.tag
        )
      })
    );
    dataRecepientGroup.subCategories = drCategories;
    dataRecepientGroup.items = null;
  }

  public isThreeLevel(): boolean {
    return this.selectedGroup && this.selectedGroup.subCategories;
  }

  ngOnChanges() {
    if (this.dataFlow && this.direction && this.currentItSystem) {
      this.initOptions();
    }
  }
}
