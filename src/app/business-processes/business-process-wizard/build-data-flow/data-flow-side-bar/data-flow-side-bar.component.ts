import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ta-data-flow-side-bar',
  templateUrl: './data-flow-side-bar.component.html',
  styleUrls: ['./data-flow-side-bar.component.scss']
})
export class DataFlowSideBarComponent implements OnInit {
  @Input() isStandardView: boolean;
  @Input() isFilterDirty: boolean;
  @Input() filtersFormValue;

  @Output() toggleStandardView = new EventEmitter();
  @Output() toggleExpandedView = new EventEmitter();
  @Output() searchUpdated = new EventEmitter();
  @Output() filtersApplied = new EventEmitter<FormGroup>();
  @Output() filtersUpdated = new EventEmitter<FormGroup>();

  public isExpandedView: boolean;
  public isSearchVisible: boolean;

  constructor() {
    this.isSearchVisible = false;
    this.isExpandedView = false;
  }

  ngOnInit() {}

  toggleStandard() {
    if (this.isExpandedView) {
      this.isExpandedView = false;
    } else {
      this.toggleStandardView.emit();
    }

    /**
     * Dispatch Event | Resize
     * This to trigger the window resize within DOM dimension change
     */
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 400);
  }

  toggleExpanded() {
    this.isExpandedView = !this.isExpandedView;
  }

  public toggleSearchVisible() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  public onSearch(event) {
    this.searchUpdated.emit(event);
  }

  public onFiltersApplied(event) {
    this.filtersApplied.emit(event);
  }
}
