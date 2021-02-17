import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { LocationsInterface } from '../../models/location.model';

@Component({
  selector: 'ta-location-tooltip',
  templateUrl: './location-tooltip.component.html',
  styleUrls: ['./location-tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LocationTooltipComponent implements OnInit {
  @Input() locations: LocationsInterface[] = [];
  public selectedLocations: LocationsInterface[] = [];

  constructor() {}

  ngOnInit() {
    this.selectedLocations = this.locations;
  }

  public isSingleCountry() {
    return (
      this.selectedLocations.length === 1 &&
      this.selectedLocations[0].countries.length === 1
    );
  }

  public getSelectedLocations() {
    return this.selectedLocations.sort((regionA, regionB) =>
      regionA.name > regionB.name ? 1 : regionB.name > regionA.name ? -1 : 0
    );
  }
}
