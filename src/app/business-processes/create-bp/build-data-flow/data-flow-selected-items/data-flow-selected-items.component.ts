import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList
} from '@angular/core';

import { GlobalRegionInterface } from 'src/app/shared/models/location.model';
import { LabelBadgeComponent } from 'src/app/shared/components/label-badge/label-badge.component';

@Component({
  selector: 'ta-data-flow-selected-items',
  templateUrl: './data-flow-selected-items.component.html',
  styleUrls: ['./data-flow-selected-items.component.scss']
})
export class DataFlowSelectedItemsComponent implements OnInit {
  @Input() locationDatas: GlobalRegionInterface[] = [];
  @Input() locations: GlobalRegionInterface[] = [];
  @Input() fullCountryList: GlobalRegionInterface[] = [];
  @Input() emptyStateText = '';
  @Input() dataItems: any[];
  @Output() itemRemoved = new EventEmitter();
  @Output() emptyLinkClicked = new EventEmitter();
  @Output() itemClicked = new EventEmitter();

  @ViewChildren('labelBadgeComponent') labelBadgeComponent: QueryList<
    LabelBadgeComponent
  >;

  constructor() {}

  ngOnInit(): void {}

  public removeGroupFromList(item) {
    this.itemRemoved.emit(item);
  }

  public closeBadgeTooltips() {
    this.labelBadgeComponent.toArray().forEach(labelBadgeComponent => {
      if (labelBadgeComponent && labelBadgeComponent.tip) {
        labelBadgeComponent.tip.close();
      }
    });
  }

  public onItemClick(dataItem) {
    if (dataItem.edgeId) {
      this.itemClicked.emit(dataItem);
    }
  }

  public emptyLinkClickEvent() {
    this.emptyLinkClicked.emit();
  }
}
