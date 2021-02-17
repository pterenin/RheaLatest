import {
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SEARCH_FIELD_DEBOUNCE_MILLISECONDS } from '../../utils/form-utils';

declare const _: any;
// comment to trigger build
@Component({
  selector: 'ta-dropdown-field',
  templateUrl: './dropdown-field.component.html',
  styleUrls: ['./dropdown-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownFieldComponent),
      multi: true
    }
  ]
})
export class DropdownFieldComponent implements ControlValueAccessor {
  @Output() searchChanged = new EventEmitter();
  @Output() dropdownOpenChanged = new EventEmitter();
  @Output() selectedItemChanged = new EventEmitter();
  @Input() showRiskFields: boolean;
  @Input() label: string;
  @Input() placeholder = 'Select'; // [i18n-tobeinternationalized]
  @Input() optionLabel = 'label';
  @Input() placement = ['bottom-left', 'top-left'];
  @Input() isSearchable = false;
  @Input() isAutoShowSearch = false;
  @Input() emptyOption = false;
  @Input() emptyLabel = '';
  @Input() noOptionsText = 'There are no matching options'; // [i18n-tobeinternationalized]
  @Input() useInfiniteScroll;
  @Input() isDisabled = false;
  @Input() itemIndex: number;
  @Input() autoClose = true;
  @Input() allowUnselectItem = false;
  @Input() viewPortHeight = 0;
  @Input() selectAllOption = false;

  @HostBinding('class.multiple-value-dropdown')
  @Input()
  isMultiple = false;

  @Output() infiniteListChanged = new EventEmitter<any>();

  public virtualScrollViewportItems;

  private _options = [];
  @Input() set options(newOptions: Array<any>) {
    this._options =
      newOptions === null || newOptions === undefined ? [] : newOptions;
    this.filterOptions(this.searchString);
    this.applySearchBoxDisplayPolicy();
  }
  private _selectedOption: any;
  @Input() set selectedOption(newSelectedOption: any) {
    this._selectedOption = newSelectedOption;
    const selectedOption = newSelectedOption
      ? newSelectedOption
      : this.placeholder;
    this.selectedOptionLabel = this.getLabel(selectedOption);
    this.filterOptions(this.searchString);
  }
  get selectedOption(): any {
    return this.isMultiple && !this._selectedOption ? [] : this._selectedOption;
  }

  public filteredOptions: Array<any> = [];
  public searchString: string;
  public showSearch = false;
  public searchChangedDebounce: Subject<string> = new Subject<string>();

  // optionLabel is a string indicating field that needs to be displayed in UI
  // if option is an object (f.e. {label: 'Option 1', value: 'option_1' })
  // by default it's 'label'
  selectedOptionLabel: string;
  dropdownId: string = _.uniqueId('dropdown_');
  selectedValue: any;

  public propagateChange: Function;

  constructor() {
    this.searchChangedDebounce
      .pipe(
        debounceTime(SEARCH_FIELD_DEBOUNCE_MILLISECONDS),
        distinctUntilChanged()
      )
      .subscribe(searchString => this.searchChanged.emit(searchString));
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  public getViewPortStyle() {
    return this.viewPortHeight ? { height: this.viewPortHeight + 'px' } : '';
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.selectedValue = value;
    }
  }

  getLabel(option) {
    return _.get(option, this.optionLabel, '') || option;
  }

  public onSelect(option) {
    if (this.isMultiple) {
      if (!this.selectedOption || !this.selectedOption.length) {
        this.selectedOption = [];
      }
      this.selectedOption.push(option);
      this.filterOptions(this.searchString);
      this.propagateChange(this.selectedOption);
      this.selectedItemChanged.emit(this.selectedOption);
    } else {
      // unselect when choose same item when use dropdown single
      option =
        this.allowUnselectItem &&
        this.selectedOption &&
        this.getLabel(option) === this.getLabel(this.selectedOption)
          ? null
          : option;
      this.filterOptions('');
      this.propagateChange(option);
      this.selectedItemChanged.emit(option);
    }
  }

  public onListChange($event) {
    this.infiniteListChanged.emit($event);
  }

  public getDropdownButtonId() {
    return `dropdown-button-${this.itemIndex}`;
  }

  public getSearchId() {
    return `search-dropdown-${this.itemIndex}`;
  }

  public onSearch(searchString: string) {
    this.searchString = searchString;
    // this.searchChanged.observers will be null if this.searchChanged.unsubscribe() is called.
    if (
      this.searchChanged.observers &&
      this.searchChanged.observers.length > 0
    ) {
      this.searchChangedDebounce.next(searchString);
    } else {
      this.filterOptions(this.searchString);
    }
  }

  public filterOptions(searchString: string) {
    searchString = searchString ? searchString : '';

    if (!this._options || this._options.length <= 0) {
      this.filteredOptions = [];

      return false;
    }

    this.filteredOptions = this._options.filter(option => {
      const targetString = this.getLabel(option);
      if (this.isMultiple) {
        const isAlreadySelected = _.find(
          this.selectedOption,
          selectedOption =>
            this.getLabel(option) === this.getLabel(selectedOption)
        );
        // Don't show an option that's already been selected.
        if (isAlreadySelected) {
          return false;
        }
      }

      // Don't show an option that has no string to match with.
      if (!targetString) {
        return false;
      } else {
        return (
          String(targetString)
            .toLowerCase()
            .indexOf(searchString.toLowerCase()) !== -1
        );
      }
    });
  }

  applySearchBoxDisplayPolicy() {
    // NOTE: The search threshold length is based on the number of options visible before
    // the scrollbar appears.  See the component.scss file and the ui-toolkit defaults.
    const optionLengthSearchThreshold = 7;
    const enoughOptions = this._options.length > optionLengthSearchThreshold;

    this.showSearch =
      (this.isAutoShowSearch && enoughOptions) || this.isSearchable;
  }

  onRemoveSelectedOption(selectionIndex: number) {
    this.selectedOption.splice(selectionIndex, 1);
    this.filterOptions('');
    this.propagateChange(this.selectedOption);
  }

  onOpenChange(payload) {
    this.dropdownOpenChanged.emit(payload);
  }

  onSelectAll() {
    if (
      this.isMultiple &&
      this.filteredOptions &&
      this.filteredOptions.length > 0
    ) {
      this.selectedOption =
        this.selectedOption && this.selectedOption.length > 0
          ? this.selectedOption
          : [];

      this.filteredOptions.map(option => {
        this.selectedOption.push(option);
      });

      this.filterOptions(this.searchString);
      this.propagateChange(this.selectedOption);
      this.selectedItemChanged.emit(this.selectedOption);
    }
  }
}
