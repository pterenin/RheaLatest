import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ta-data-flow-search',
  templateUrl: './data-flow-search.component.html',
  styleUrls: ['./data-flow-search.component.scss']
})
export class DataFlowSearchComponent implements OnInit {
  public searchString: string;

  @Input() isSearchVisible: boolean;
  @Output() public toggleSearchVisible = new EventEmitter();
  @Output() public searchUpdated = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public toggleSearch() {
    this.toggleSearchVisible.emit();
  }

  public searchItSystemRecordsFilters($event: any) {
    if (
      $event.searchValue === '' ||
      ($event.searchValue && $event.searchValue.length > 2)
    ) {
      this.searchString = $event.searchValue;
      this.searchUpdated.emit(this.searchString);
    }
  }

  public clearSearchItSystemRecords() {
    this.searchString = '';
    this.searchUpdated.emit(this.searchString);
    this.toggleSearch();
  }
}
