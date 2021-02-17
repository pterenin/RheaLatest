import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';

import { GlobalRegionInterface } from 'src/app/shared/models/location.model';
import { highlightText } from 'src/app/shared/utils/basic-utils';

import { TaPopover } from '@trustarc/ui-toolkit';

@Component({
  selector: 'ta-data-flow-dropdown-label',
  templateUrl: './data-flow-dropdown-label.component.html',
  styleUrls: ['./data-flow-dropdown-label.component.css']
})
export class DataFlowDropdownLabelComponent implements OnInit {
  @Input() locationDatas: GlobalRegionInterface[] = [];
  @Input() searchValue: string;
  @Input() hasRHEA_NEW_UI_STEPS_34_LICENSE: boolean;
  @Input() direction: 'sending' | 'receiving';
  @Input() item: any;

  @Output() triggerLocationTooltip = new EventEmitter();

  @ViewChild('tip') popover: TaPopover;

  constructor() {}

  public isLocationsHidden(): boolean {
    return (
      this.hasRHEA_NEW_UI_STEPS_34_LICENSE &&
      this.direction === 'sending' &&
      !this.item.isItSystem
    );
  }

  ngOnInit(): void {}

  public openTooltip(tip) {
    this.triggerLocationTooltip.emit(tip);
    tip.open();
  }

  public closePopover() {
    this.popover.close();
  }

  public getItemLabel() {
    return highlightText(this.item.label, this.searchValue);
  }

  public getTooltipLocationList(locationIds: string[]) {
    const datas = this.locationDatas && locationIds;
    if (datas) {
      let locations = this.locationDatas.map(a => Object.assign({}, a));
      locations = locations.filter(region => {
        region.total = region.countries.length;
        region.countries = region.countries.filter(country => {
          return locationIds.find(locId => {
            return country.locationIds
              ? country.locationIds.includes(locId) || locId === country.id
              : locId === country.id;
          });
        });
        return region.countries.length > 0;
      });
      return locations;
    }
    return [];
  }
}
