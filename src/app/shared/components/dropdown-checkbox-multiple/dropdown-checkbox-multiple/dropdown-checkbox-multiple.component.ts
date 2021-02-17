import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SEARCH_FIELD_DEBOUNCE_MILLISECONDS } from '../../../utils/form-utils';
import { exists, highlightText } from 'src/app/shared/utils/basic-utils';

declare const _: any;

@Component({
  selector: 'ta-dropdown-checkbox-multiple',
  templateUrl: './dropdown-checkbox-multiple.component.html',
  styleUrls: ['./dropdown-checkbox-multiple.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownCheckboxMultipleComponent),
      multi: true
    }
  ]
})
export class DropdownCheckboxMultipleComponent {
  @Output() searchChanged = new EventEmitter();
  @Output() valuesUpdated = new EventEmitter();
  @Input() label: string;
  @Input() placeholder = 'Select'; // [i18n-tobeinternationalized]
  @Input() optionLabel = 'label';
  @Input() isSearchable = false;
  @Input() isAutoShowSearch = false;
  @Input() noOptionsText = 'There are no matching options'; // [i18n-tobeinternationalized]
  @Input() autoClose: boolean;
  private _options: Array<any>;
  @Input() set options(newOptions: Array<any>) {
    this._options = !exists(newOptions) ? [] : newOptions;

    if (exists(this._options) && this._options.length > 0) {
      this.onSelectCategory(this._options[0]);
    }

    this.buildForm();
    this.filteredOptions = this._options;
    this.applySearchBoxDisplayPolicy();
  }

  public searchChangedDebounce: Subject<string> = new Subject<string>();
  public searchString: string;
  public showSearch = false;

  public filteredOptions: Array<any> = [];
  public selectedCategory: any = {};
  public selectedValues: any[] = [];
  public dropdownId: string = _.uniqueId('dropdown_multiple_');

  public dropdownForm: FormGroup;
  public propagateChange: Function;

  private _dropdownForm$: Subscription;

  constructor(private formBuilder: FormBuilder) {
    this.searchChangedDebounce
      .pipe(
        debounceTime(SEARCH_FIELD_DEBOUNCE_MILLISECONDS),
        distinctUntilChanged()
      )
      .subscribe(searchString => this.searchChanged.emit(searchString));

    this.buildForm();
  }

  /**
   * This function evaluates boolean for checkboxes whether or not they should be disabled
   * If default option is already selected - then disable other options
   * If other options are already selected - then disable the default option
   * @param item - risk factor option in dropdown
   * @return boolean
   */
  private evaluateIfDisabled(item) {
    const defaultUUID = '00000000-0000-0000-0000-000000000000';
    const currentIsDefaultUUID = item.id === defaultUUID;
    if (currentIsDefaultUUID) {
      const lengthOfNonDefaults = this.selectedValues.filter(
        value => value.id !== defaultUUID
      ).length;
      return lengthOfNonDefaults > 0;
    } else {
      return this.selectedValues.map(option => option.id).includes(defaultUUID);
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  writeValue(values: any[] = []) {
    if (Array.isArray(values)) {
      values.forEach(value => {
        this.dropdownForm.addControl(value.id, new FormControl(true));
      });
    }
    this.selectedValues = values;
  }

  onSelectCategory(category) {
    this.selectedCategory = category;
  }

  onRemoveSelectedOption(selectionIndex: number) {
    const selectedItem = this.selectedValues[selectionIndex];

    this.dropdownForm.get(selectedItem.id).patchValue(false);
    if (this.propagateChange) {
      this.propagateChange(this.selectedValues);
    }
  }

  onSearch(searchString: string) {
    this.searchString = searchString;
    // If the search is being watched externally, let the external component do the filtering.
    // this.searchChanged.observers will be null if this.searchChanged.unsubscribe() is called.
    if (
      this.searchChanged.observers &&
      this.searchChanged.observers.length > 0
    ) {
      this.searchChangedDebounce.next(searchString);
    }

    this.search();

    if (!this.selectedCategory || this.selectedCategory.hidden) {
      // if selected category is hidden select first visible category
      this.selectedCategory = this.filteredOptions.find(
        category => !category.hidden
      );
    }
  }

  private search() {
    // Search string must be at least two characters; otherwise, we clear search entirely
    const searchString =
      this.searchString.length >= 2 ? this.searchString.toLowerCase() : '';

    this.filteredOptions.forEach(category => {
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
        category.hidden = false;
        category.items.forEach(item => {
          item.hidden = false;
        });
      }
    });
  }

  public getItemLabel(item: any) {
    return highlightText(item.name, this.searchString);
  }

  applySearchBoxDisplayPolicy() {
    // NOTE: The search threshold length is based on the number of options visible before
    // the scrollbar appears.  See the component.scss file and the ui-toolkit defaults.
    const optionLengthSearchThreshold = 7;
    const enoughOptions = this._options.length > optionLengthSearchThreshold;

    this.showSearch =
      (this.isAutoShowSearch && enoughOptions) || this.isSearchable;
  }

  buildForm() {
    if (exists(this._options)) {
      const existingControls = _.keys(this.dropdownForm.controls) || [];

      const newControls = _(this._options)
        .reject(item => existingControls.includes(item.id))
        .keyBy('id')
        .mapValues(() => false)
        .value();

      this.dropdownForm = this.formBuilder.group({
        ...this.dropdownForm.controls,
        ...newControls
      });

      if (exists(this._dropdownForm$)) {
        this._dropdownForm$.unsubscribe();
      }

      this._dropdownForm$ = this.dropdownForm.valueChanges.subscribe(
        updatedList => {
          const selectedIds = _(updatedList)
            .pickBy(x => x)
            .keys()
            .value();

          this.selectedValues = _(this._options)
            .filter(item => selectedIds.includes(item.id))
            .value();

          if (this.propagateChange) {
            this.propagateChange(this.selectedValues);
          }
        }
      );
    } else {
      this.dropdownForm = this.formBuilder.group({});
    }
  }
}
