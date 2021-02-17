import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ta-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss']
})
export class SearchFieldComponent implements OnInit {
  @ViewChild('search', { read: ElementRef }) public search: ElementRef;

  @Input() public prefixValue = '';
  @Input() public placeholder: string;
  @Input() public value: string;
  @Input() public alwaysShowClear: boolean;

  @Output() searchValue: EventEmitter<any>;
  @Output() clearValue: EventEmitter<any>;

  public searchForm: FormGroup;
  public showClear: boolean;

  constructor(private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      searchInput: ['']
    });
    this.searchValue = new EventEmitter();
    this.clearValue = new EventEmitter();
    this.showClear = false;
  }

  ngOnInit() {
    if (!this.placeholder) {
      throw new TypeError('***placeholder*** input is required');
    }

    this.searchUIComposition();
    this.emitSearchValue();

    if (this.value) {
      this.searchInput.patchValue(this.value);
    }
  }

  public get searchInput(): FormControl {
    return this.searchForm.get('searchInput') as FormControl;
  }

  public searchUIComposition() {
    this.searchForm.valueChanges.subscribe(currentValue => {
      const searchElement = this.search.nativeElement;
      const searchLength = currentValue.searchInput.length || 0;
      const targetSize = searchLength < 150 ? searchLength : 150;

      searchElement.setAttribute('size', targetSize + 1);

      this.showClear = targetSize > 0;
    });
  }

  public searchClear() {
    this.searchInput.patchValue('');
    this.search.nativeElement.setAttribute('size', 3);
    this.showClear = false;

    this.searchValue.emit({
      searchValue: null
    });

    this.emitClearValue();
  }

  public composeAttributeValue() {
    return (
      this.prefixValue +
      '-' +
      this.placeholder.replace(/[\W_]+/g, '-').toLowerCase()
    );
  }

  private emitSearchValue() {
    this.searchForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(currentValue => {
        this.searchValue.emit({
          searchValue: currentValue.searchInput
        });
      });
  }

  private emitClearValue() {
    this.clearValue.emit({
      clearValue: true
    });
  }
}
