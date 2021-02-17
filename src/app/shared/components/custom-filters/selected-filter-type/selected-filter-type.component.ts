import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { highlightText } from 'src/app/shared/utils/basic-utils';

@Component({
  selector: 'ta-selected-filter-type',
  templateUrl: './selected-filter-type.component.html',
  styleUrls: ['./selected-filter-type.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SelectedFilterTypeComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() filterType: any;
  @Input() getFilterOptions: Function;
  @Output() removeFilterType = new EventEmitter<any>();
  @Output() filterOptionChanged = new EventEmitter<any>();

  public arrowColor = '#0052cc';
  public selectedFilterType: any;
  public isLoading: boolean;
  public searchValue = '';
  public isMultyLevelFilter = false;
  public noNameText = '-no name-';

  constructor() {}

  ngOnInit() {}

  public isAll() {
    return this.selectedFilterType.filterOptions.every(filterOption => {
      if (filterOption.isCategory) {
        return this.isAllChildrentSelected(filterOption);
      }
      return filterOption.selected;
    });
  }

  public isInt() {
    return this.selectedFilterType.filterOptions.some(filterOption => {
      if (filterOption.isCategory) {
        return this.isSomeChildrentSelected(filterOption);
      }
      return filterOption.selected;
    });
  }

  public allFiltersClick($event) {
    $event.preventDefault();
    $event.stopPropagation();
    if (this.isAll() || this.isInt()) {
      this.deselectAllFilterOptions();
    } else {
      this.selectAllFilterOptions();
    }
    this.onFilterOptionChanged();
  }

  public deselectAllFilterOptions() {
    this.updateAllFilterOptions(false);
  }

  public selectAllFilterOptions() {
    this.updateAllFilterOptions(true);
  }

  public updateAllFilterOptions(isSelected = false) {
    if (!this.selectedFilterType.filterOptions) {
      return;
    }
    this.selectedFilterType.filterOptions.forEach(filterOption => {
      if (filterOption.isCategory) {
        return isSelected
          ? this.selectAllChildren(filterOption)
          : this.deselectAllChildren(filterOption);
      }
      if (filterOption.isCategorizedFilter && !filterOption.selectable) {
        return;
      }
      filterOption.selected = isSelected;
    });
  }

  public removeFilter() {
    this.removeFilterType.emit(this.filterType);
  }

  public onFilterOptionChanged() {
    this.filterOptionChanged.emit(this.filterType);
  }

  public onSearch(value: string) {
    this.searchValue = value.length >= 2 ? value.toLowerCase().trim() : '';
    if (!this.selectedFilterType.filterOptions) {
      return;
    }
    if (!this.searchValue) {
      this.selectedFilterType.filterOptions.forEach(option => {
        option.hidden = false;
      });
    } else {
      this.selectedFilterType.filterOptions.forEach(option => {
        const optionNameNormilized = option.name
          ? option.name.toLowerCase().trim()
          : '';
        option.hidden = optionNameNormilized.indexOf(this.searchValue) === -1;
      });
    }
  }

  public getLabel(label: string) {
    return highlightText(label, this.searchValue);
  }

  public onOpenChange(isOpen) {
    if (!isOpen && this.selectedFilterType.parentType) {
      this.resetToParent();
    }
  }

  public resetToParent() {
    if (this.selectedFilterType.parentType) {
      this.selectedFilterType = this.selectedFilterType.parentType;
      this.resetToParent();
    }
  }

  ngOnChanges() {
    if (!this.selectedFilterType) {
      this.selectedFilterType = this.filterType;
    }
    this.isMultyLevelFilter = this.isMultyLevel();
    this.noNameText = this.filterType.name.toLowerCase().includes('email')
      ? '-no email-'
      : this.noNameText;
  }

  public selectChild(filterType, $event) {
    $event.preventDefault();
    $event.stopPropagation();
    if (this.isLoading) {
      return;
    }
    if (filterType.isCategorizedFilter || filterType.filterOptions) {
      filterType.parentType = this.selectedFilterType;
      this.selectedFilterType = filterType;
      return;
    } else if (filterType.subType) {
      this.isLoading = true;
      this.getFilterOptions([filterType]).subscribe(() => {
        filterType.parentType = this.selectedFilterType;
        this.selectedFilterType = filterType;
        this.isLoading = false;
      });
    }
  }

  public selectParent($event) {
    $event.preventDefault();
    $event.stopPropagation();
    if (this.selectedFilterType.parentType) {
      this.selectedFilterType = this.selectedFilterType.parentType;
    }
  }

  private getSelectedCategorizedOptions(filterType, value, parent = false) {
    if (
      filterType.selected &&
      !filterType.isCategory &&
      filterType.category &&
      !parent
    ) {
      value.push(filterType);
    }
    if (filterType.filterOptions) {
      filterType.filterOptions.forEach(option =>
        this.getSelectedCategorizedOptions(option, value)
      );
    }
  }

  private getSelectedCountInCategorizedFilter() {
    const selectedItems = [];
    this.getSelectedCategorizedOptions(this.filterType, selectedItems, true);
    return selectedItems;
  }

  public getSelectedOptionsNumber(): string {
    if (this.filterType.isCategorizedFilter) {
      const selectedCount = this.getSelectedCountInCategorizedFilter().length;
      return selectedCount ? `(${selectedCount})` : '';
    }
    const options = this.filterType.filterOptions;
    if (!options) {
      return '';
    }
    const selectedOptionsCount = this.countSelectedRecoursevly(options);
    if (selectedOptionsCount === 0) {
      return '';
    }
    if (!this.isMultyLevelFilter && selectedOptionsCount === options.length) {
      return '(All)';
    }
    return selectedOptionsCount ? `(${selectedOptionsCount})` : '';
  }

  public isMultyLevel(): boolean {
    return this.filterType.filterOptions.some(
      option =>
        option.subType || (option.filterOptions && option.filterOptions.length)
    );
  }

  public countSelectedRecoursevly(options, count = 0) {
    let _count = count + options.filter(option => option.selected).length;
    options.forEach(option => {
      if (option.filterOptions && option.filterOptions.length) {
        _count = this.countSelectedRecoursevly(option.filterOptions, _count);
      }
    });
    return _count;
  }

  public selectCategory(category, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    if (this.isSomeChildrentSelected(category)) {
      this.deselectAllChildren(category);
    } else {
      this.selectAllChildren(category);
    }
    this.onFilterOptionChanged();
  }

  public isAllChildrentSelected(category) {
    return category.filterOptions.every(option => option.selected);
  }

  public isSomeChildrentSelected(category) {
    if (!category.filterOptions || !category.filterOptions.length) {
      return false;
    }
    return category.filterOptions.some(option => {
      if (option.selected) {
        return true;
      } else if (option.filterOptions) {
        return this.isSomeChildrentSelected(option);
      }
      return false;
    });
  }

  public deselectAllChildren(category) {
    category.filterOptions.forEach(option => {
      option.selected = false;
      if (option.filterOptions) {
        this.deselectAllChildren(option);
      }
    });
  }
  public selectAllChildren(category) {
    category.filterOptions.forEach(option => {
      option.selected = option.selectable;
      if (option.filterOptions) {
        this.selectAllChildren(option);
      }
    });
  }

  ngOnDestroy() {}
}
