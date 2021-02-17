import { Component, Input, OnInit } from '@angular/core';
import { DatagridHeaderService } from 'src/app/shared/services/record-listing/datagrid-header.service';

@Component({
  selector: 'ta-datagrid-search-box',
  templateUrl: './datagrid-search-box.component.html',
  styleUrls: ['./datagrid-search-box.component.scss']
})
export class DatagridSearchBoxComponent implements OnInit {
  public searchQuery = '';
  public currentPage = 1;
  @Input() id = '';
  @Input() searchPlaceholder = 'Enter to search...';

  constructor(private datagridHeaderService: DatagridHeaderService) {}

  ngOnInit() {}

  onSearch($event, value) {
    if ($event.keyCode !== 13 || $event.which !== 13) {
      return true;
    }

    this.doSearch(value);
  }

  clearSearch(inputSearch: HTMLInputElement) {
    inputSearch.value = '';
    this.doSearch('');
    setTimeout(() => {
      inputSearch.focus();
      inputSearch.select();
    }, 100);
  }

  doSearch(value) {
    this.searchQuery = value;
    this.currentPage = 1;

    const pr = {};
    pr['search'] = this.searchQuery;
    pr['page'] = this.currentPage;

    this.datagridHeaderService.emitSearchRequest(this.id, pr);
  }
}
