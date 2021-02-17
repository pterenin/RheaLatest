import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import {
  CountryInterface,
  SelectedRegionCount
} from '../../../../shared/models/location.model';

@Component({
  selector: 'ta-region-display-field',
  templateUrl: './region-display-field.component.html',
  styleUrls: ['./region-display-field.component.scss']
})
export class RegionDisplayFieldComponent implements OnInit, OnChanges {
  @Input() locationData: CountryInterface[];
  @Input() isDisabled = false;
  @Output() openModalEmitter = new EventEmitter();
  @Output() updatedLocationDataEmitter = new EventEmitter<CountryInterface[]>();

  selectedRegions: SelectedRegionCount[];

  constructor() {
    this.selectedRegions = [];
  }

  ngOnInit() {}

  ngOnChanges(): void {
    if (this.locationData) {
      this.mapLocationData();
    }
  }

  public openModal() {
    if (!this.isDisabled) {
      this.openModalEmitter.emit();
    }
  }

  private isEurope(name) {
    return name === 'Europe';
  }

  private isEu(name) {
    return name === 'EU';
  }

  private getEuropeRegion(country) {
    return country.globalRegions.find(region => this.isEurope(region.name));
  }

  private getEuRegion(country) {
    return country.globalRegions.find(region => this.isEu(region.name));
  }

  private getOtherRegion(country) {
    const isOther =
      !country.globalRegions || country.globalRegions.length === 0;
    return isOther ? { name: 'Other' } : null;
  }

  private getRegionName(country) {
    const euRegion = this.getEuRegion(country);
    const otherRegion = this.getOtherRegion(country);
    const regionName = otherRegion
      ? otherRegion.name
      : euRegion
      ? euRegion.name
      : country.globalRegions[0].name;

    return regionName;
  }

  private mapLocationData() {
    this.selectedRegions = [];
    this.locationData.forEach(country => {
      const regionName = this.getRegionName(country);
      const countryIsEu = this.getEuRegion(country);
      const countryIsEurope = this.getEuropeRegion(country);
      const existsEurope = this.selectedRegions.find(reg =>
        this.isEurope(reg.region)
      );
      const existsRegion = this.selectedRegions.find(
        reg => reg.region === regionName
      );

      if (!existsRegion) {
        this.selectedRegions.push({
          region: regionName,
          selectedCountryCount: 1
        });
      } else {
        existsRegion.selectedCountryCount += 1;
      }
      // country is EU need also count europe
      if (countryIsEu && existsEurope) {
        existsEurope.selectedCountryCount += 1;
      }
      if (countryIsEu && !existsEurope) {
        this.selectedRegions.push({
          region: countryIsEurope.name,
          selectedCountryCount: 1
        });
      }
    });
  }

  public removeRegion(event, region) {
    if (event) {
      event.stopPropagation();
    }
    this.updatedLocationDataEmitter.emit(
      this.locationData.filter(country => {
        const regionName = this.getRegionName(country);
        const countryIsEurope = this.getEuropeRegion(country);
        const isRemovingEurope = this.isEurope(region.region);
        const validRegion =
          isRemovingEurope && countryIsEurope
            ? false
            : regionName !== region.region;

        return validRegion;
      })
    );
  }
}
