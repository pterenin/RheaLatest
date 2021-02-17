import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { GlobalRegionInterface } from '../../models/location.model';
import { TaPopover } from '@trustarc/ui-toolkit';
import { LocationService } from '../../services/location/location.service';
import { ThirdPartyType } from '../../../app.constants';

@Component({
  selector: 'ta-label-badge',
  templateUrl: './label-badge.component.html',
  styleUrls: ['./label-badge.component.scss']
})
export class LabelBadgeComponent implements OnInit, OnChanges {
  public infoTooltip: string;
  @Input() data: any;
  @Input() info: boolean;
  @Input() subItem: string;
  @Input() tag: boolean;
  @Input() tagText: string;
  @Input() close: boolean;
  @Input() grouped: boolean;
  @Input() locationDatas: GlobalRegionInterface[] = [];
  @Input() fullCountryListRaw: GlobalRegionInterface[] = [];
  @Input() showCustomTag = false;
  @Input() options = null;
  @Input() showLoader = false;
  @Input() locations: GlobalRegionInterface[];

  @Output() removeFromList: EventEmitter<any>;
  @Output() removeGroupFromList: EventEmitter<any>;
  @Output() showInfoTooltip: EventEmitter<any>;
  @Output() itemClicked: EventEmitter<any>;

  public dataItem: any;
  public locationsForBage: GlobalRegionInterface[];

  public hasInfoIcon: boolean;
  public hasCloseIcon: boolean;

  @ViewChild(TaPopover) tip: TaPopover;
  @ViewChild(LabelBadgeComponent) badge: LabelBadgeComponent;

  constructor(
    private locationService: LocationService,
    private el: ElementRef
  ) {
    this.removeFromList = new EventEmitter();
    this.removeGroupFromList = new EventEmitter();
    this.showInfoTooltip = new EventEmitter();
    this.itemClicked = new EventEmitter();
    this.locationsForBage = [];
  }

  ngOnInit() {
    this.infoTooltip = 'View details'; // [i18n-tobeinternationalized]
    this.dataItem = this.data;
    this.hasInfoIcon = this.info;
    this.hasCloseIcon = this.close;
  }

  initLocations() {
    const datas = this.locationDatas && this.data && this.data.locationIds;
    if (datas) {
      const locationIds =
        this.data.selectedLocationIds || this.data.locationIds;
      this.locationsForBage = this.locationDatas.map(a => Object.assign({}, a));
      this.locationsForBage = this.locationsForBage.filter(region => {
        region.total = region.countries.length;
        region.countries = region.countries.filter(country => {
          return locationIds.find(locId => {
            return locId === country.id;
          });
        });
        return region.countries.length > 0;
      });
    }
  }

  ngOnChanges() {
    this.initLocations();
  }

  private mapLocations(locations) {
    if (Array.isArray(locations) && this.fullCountryListRaw) {
      // add locationID for each country
      this.fullCountryListRaw.map(region => {
        region.countries.map(country => {
          const found = Object.assign(
            [],
            locations.filter(loc =>
              loc.country ? loc.country.id === country.id : false
            )
          );
          country.locationId = null;
          country.locationIds = [];

          if (found.length > 0) {
            country.locationId = found[0].id;
            country.locationIds = found.map(location => location.id);
          }
        });
      });
      this.locationDatas = this.fullCountryListRaw;
    }
  }

  private getUpdatedLocationsData() {
    if (this.locations) {
      this.mapLocations(this.locations);
      return;
    }
    // Getting updated locations value from Subject (no api call is being made here)
    this.locationService.getLocationsRaw().subscribe(locations => {
      this.mapLocations(locations);
    });
  }

  getLocations() {
    // Need to get updated "locationDatas" after adding new location,
    // otherwise new location id is not participating in filtering - thus returning
    // empty array causing tooltip not displaying any data
    this.getUpdatedLocationsData();
    this.initLocations();
    return this.locationsForBage;
  }

  getCountriesCount() {
    return this.locationsForBage.reduce((count, region) => {
      return count + region.countries.length;
    }, 0);
  }

  removeItem(event: Event, data: any) {
    event.stopPropagation();
    this.removeFromList.emit(data);
  }

  removeGroup(event: Event, data: any) {
    event.stopPropagation();
    this.removeGroupFromList.emit(data);
  }

  showInfo(data: any) {
    this.showInfoTooltip.emit(data);
  }

  onItemClicked() {
    this.itemClicked.emit(this.data);
  }

  triggerTooltip() {
    this.tip.open();
  }

  closeToolTip() {
    this.tip.close();
  }

  getLabelDetailsByTag(tag: string) {
    if (tag) {
      const TAG_MUTATE = tag.replace(/ /g, '_').toUpperCase();
      switch (TAG_MUTATE) {
        case ThirdPartyType.PRIMARY_ENTITY:
        case ThirdPartyType.COMPANY_AFFILIATE:
          return 'green';
        default:
          return 'orange';
      }
    }
  }
}
