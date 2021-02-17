import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TaPopover } from '@trustarc/ui-toolkit';

declare const _: any;

@Component({
  selector: 'ta-data-flow-filters',
  templateUrl: './data-flow-filters.component.html',
  styleUrls: ['./data-flow-filters.component.scss']
})
export class DataFlowFiltersComponent implements OnInit {
  @Input() isFilterDirty: boolean;
  @Input() filtersFormValue;
  @Output() filtersApplied = new EventEmitter<FormGroup>();
  @Output() filtersUpdated = new EventEmitter<FormGroup>();
  @ViewChild('popItSystemNodesFilter') popItSystemNodesFilter: TaPopover;

  public totalFilters = 0;
  public filterSystemRecordsIsDirty: boolean;

  constructor() {}

  ngOnInit() {}

  public applySelectedFilter(event) {
    this.filtersApplied.emit(event);
    this.popItSystemNodesFilter.close();
  }

  public onFilterUpdated(event) {
    if (event) {
      const sortingKey = 'filterSort';
      const sortingArray = ['nameAsc', 'nameDesc'];
      const filterKeys = [
        'filterOwner',
        'filterDataSubjects',
        'filterDataElements',
        'filterProcessingPurposes',
        'filterHostingLocations'
      ];

      const sortingSum = sortingArray.includes(event[sortingKey].id) ? 1 : 0;

      const filterSum = filterKeys.reduce((acc, key) => {
        return event[key].filter(item => item.checked === true).length + acc;
      }, 0);

      this.totalFilters = sortingSum + filterSum;
    }
  }

  public getSortingPlaceholder() {
    // [i18n-tobeinternationalized]
    return 'Name';
  }
}
