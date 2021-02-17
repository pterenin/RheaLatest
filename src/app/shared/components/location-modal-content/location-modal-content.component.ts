import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { TaActiveModal } from '@trustarc/ui-toolkit';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { CreateBusinessProcessesService } from 'src/app/business-processes/create-bp/create-business-processes.service';
import { DataElementsInterface } from './location-modal-content.model';

import {
  CountryInterface,
  GlobalRegionInterface,
  StateOrProvinceInterface
} from 'src/app/shared/models/location.model';
import { LocationService } from 'src/app/shared/services/location/location.service';
import { DataInterface } from '../categorical-view/categorical-view.component';

declare const _: any;

@AutoUnsubscribe(['_initialization$'])
@Component({
  selector: 'ta-location-modal-content',
  templateUrl: './location-modal-content.component.html',
  styleUrls: ['./location-modal-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LocationModalContentComponent implements OnInit, OnDestroy {
  @Input() public type:
    | 'Data Subject'
    | 'Data Recipient'
    | 'Data Subject Location';

  @Input() public typeName: string;
  @Input() public showRiskFields: boolean;
  @Input() public selectedType: any;
  @Input() public stateProvinceIsSelectable = true;
  @Input() public locationData: GlobalRegionInterface[] = [];
  @Input() public ignoreStatusSaveBtn = false;
  @Input() public modalHeaderTile: string;
  @Input() public redesign: boolean;
  @Input() public saveButtonLabel: string;
  @Input() public allDataElements: DataInterface[] = [];

  public locationDataProp = 'countries';
  public locationDataRaw: GlobalRegionInterface[] = [];
  public dataElements: DataInterface[] = [];
  public selectedDataElements: DataElementsInterface[] = [];
  public selectedDataElementsCount: number;
  public selectedLocations: CountryInterface[] = [];
  public selectingStates: boolean;
  public stateList: StateOrProvinceInterface[];
  public selectedCountry: CountryInterface;
  public selectedLocationData: CountryInterface[] = [];
  public selectedLocationDataSnapshot: CountryInterface[] = [];
  public pristine = true;
  public useSelectedDataElementsForCount: boolean;
  public setActiveTabId: string;

  private locationDataSnapshot: GlobalRegionInterface[] = [];
  private dataElementsSnapshot: DataElementsInterface[] = [];

  constructor(
    public activeModal: TaActiveModal,
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private locationService: LocationService
  ) {
    this.typeName = '';
    this.selectedLocationDataSnapshot = [];
    this.redesign = false;
    this.saveButtonLabel = 'Save'; // [i18n-tobeinternationalized]
  }

  ngOnInit() {
    if (!this.dataElements || !this.dataElements.length) {
      if (
        Array.isArray(this.allDataElements) &&
        this.allDataElements.length > 0
      ) {
        this.dataElements = this.allDataElements;
      } else {
        this.createBusinessProcessesService
          .getDataElementsRaw()
          .subscribe(cachedDataElements => {
            if (!cachedDataElements) {
              this.createBusinessProcessesService
                .getDataElements()
                .subscribe(data => {
                  this.createBusinessProcessesService.emitDataElementsRawUpdated(
                    data
                  );
                  this.dataElements = data;
                });
            } else {
              this.dataElements = cachedDataElements;
            }
          });
      }
    }

    if (!this.locationData || !this.locationData.length) {
      this.locationService.getFullCountryList(false).subscribe(
        data => {
          this.locationDataRaw = _.cloneDeep(data);
          this.locationData = _.cloneDeep(data);
        },
        err => console.error(err)
      );
    }

    if (this.dataElements.length > 0 && this.locationData.length > 0) {
      this.getInitialSnapshot();
      this.locationData.forEach(region => {
        if (Array.isArray(region.countries)) {
          region.countries.forEach(country => {
            if (country.selected) {
              this.selectedLocationData.push(country);
            }
          });
        }
      });
    }

    this.setPristine();
  }

  ngOnDestroy() {
    this.resetModels();
  }

  public resetModels() {
    this.locationData = [];
    this.dataElements = [];
    this.selectedDataElements = [];
    this.selectedDataElementsCount = 0;
    this.selectedLocations = [];
    this.selectingStates = false;
    this.stateList = [];
    this.typeName = '';
    this.useSelectedDataElementsForCount = false;
    this.pristine = true;
  }

  private getInitialSnapshot() {
    this.locationDataSnapshot = _.cloneDeep(this.locationData);
    this.dataElementsSnapshot = _.cloneDeep(this.dataElements);
  }

  public getSelectedLocationCount(): number {
    let count = 0;
    if (this.locationData) {
      this.locationData.forEach(region => {
        if (region.countries) {
          region.countries.forEach(country => {
            if (country.selected) {
              count++;
            }
          });
        }
      });
    }
    return count;
  }

  public getSelectedDataElementsCount(): number {
    let count = 0;
    if (this.dataElements) {
      this.dataElements.forEach(element => {
        if (element.items) {
          element.items.forEach(item => {
            if (item.selected) {
              count++;
            }
          });
        }
      });
    }
    return count;
  }

  public setPristine() {
    if (this.ignoreStatusSaveBtn) {
      this.pristine = false;
      return;
    }

    let dataElementsChange = false;

    const bpStep3locChanged = (country): any => {
      let hasChanged = false;
      this.locationDataSnapshot.forEach(snapRegion => {
        const match = _.find(snapRegion.countries, snapCountry => {
          return snapCountry.name === country.name;
        });

        if (match && match.selected !== country.selected) {
          hasChanged = true;
        }
      });
      return hasChanged;
    };

    const dataInventoryItSystem = (): any => {
      return true;
    };

    let locationChanged = false;
    if (this.locationData.length && !this.locationDataSnapshot.length) {
      locationChanged = true;
    } else {
      this.locationData.forEach(region => {
        region.countries.forEach(country => {
          if (locationChanged === false) {
            locationChanged =
              this.locationDataProp === 'countries'
                ? bpStep3locChanged(country)
                : dataInventoryItSystem();
          }
        });
      });
    }

    const selectedLocationsChanged = () => {
      let hasChanged = false;

      this.selectedLocationDataSnapshot.forEach(snapLoc => {
        const selectedLocation = _.find(
          this.selectedLocationData,
          selectedLoc => {
            return selectedLoc.name === snapLoc.name;
          }
        );

        if (!selectedLocation) {
          return hasChanged;
        }

        if (
          hasChanged === false &&
          selectedLocation.selectedStates &&
          selectedLocation.selectedStates.length &&
          snapLoc.selectedStates &&
          snapLoc.selectedStates.length
        ) {
          const diff = _.xor(
            snapLoc.selectedStates.sort(),
            selectedLocation.selectedStates.sort()
          ).length;

          hasChanged = diff ? true : false;
        }
      });
      return hasChanged;
    };

    if (this.dataElements) {
      this.dataElements.forEach(element => {
        element.items.forEach(item => {
          if (item.selected && !this.dataElementsSnapshot.length) {
            dataElementsChange = true;
          }
          if (this.dataElementsSnapshot) {
            this.dataElementsSnapshot.forEach(snapElement => {
              const match = _.find(snapElement.items, snapItem => {
                return snapItem.id === item.id;
              });
              if (match && match.selected !== item.selected) {
                dataElementsChange = true;
              }
            });
          }
        });
      });
    }

    const selectedLocationsHasChanged = selectedLocationsChanged();

    const totalSelectedLocation = this.getSelectedLocationCount();

    if (
      (dataElementsChange || locationChanged || selectedLocationsHasChanged) &&
      totalSelectedLocation > 0
    ) {
      this.pristine = false;
    } else {
      this.pristine = true;
    }
  }

  public onLocationSelected(locations: CountryInterface[]) {
    locations.forEach(location => {
      const toggleLocationSelection = (loc, bool) => {
        this.locationData.forEach(region => {
          region.countries.forEach(country => {
            if (country.name === loc.name) {
              country.selected = bool;
            }
          });
        });
      };

      const remove = (loc: CountryInterface) => {
        if (this.stateProvinceIsSelectable) {
          loc.selectedStates = [];
        }
        _.remove(
          this.selectedLocationData,
          locationData => locationData.threeLetterCode === loc.threeLetterCode
        );
        toggleLocationSelection(loc, false);
        this.setPristine();
      };

      const save = (loc: CountryInterface) => {
        // find all state and set select all stage/province
        const selectAllStateProvince = loc.stateOrProvinces.length > 0;
        if (this.stateProvinceIsSelectable) {
          loc.selectedStates = selectAllStateProvince
            ? loc.stateOrProvinces.map(state => state.id)
            : [];
        }

        this.selectedLocationData.push(loc);
        toggleLocationSelection(loc, true);
        this.setPristine();
      };

      location.selected ? save(location) : remove(location);
    });
  }

  private deselectAllDataElements() {
    return this.dataElements.map(dataElementCategory => {
      dataElementCategory.items = dataElementCategory.items.map(item => {
        item.selected = false;
        return item;
      });
      return dataElementCategory;
    });
  }

  private updateDataElementsWithNewSelectedDataElements(
    selectedDataElements: DataElementsInterface[]
  ) {
    this.dataElements = this.deselectAllDataElements();
    selectedDataElements.map(dataElementCategory => {
      dataElementCategory.items.map(dataElementItem => {
        this.updateSelectedForDataElementWithId(dataElementItem.id);
      });
    });
  }

  private updateSelectedForDataElementWithId(selectedDataElementId) {
    this.dataElements = this.dataElements.map(thisCategory => {
      const itemIndex = thisCategory.items
        .map(item => item.id)
        .indexOf(selectedDataElementId);

      const selected = itemIndex < 0 ? false : true;
      if (selected === true) {
        thisCategory.items[itemIndex].selected = selected;
      }
      return thisCategory;
    });
  }

  public onDataElementSelected(dataElements: DataElementsInterface[] = []) {
    this.selectedDataElements = dataElements;
    this.useSelectedDataElementsForCount = true;

    if (dataElements.length === 0) {
      this.dataElements = this.deselectAllDataElements();
      this.setPristine();
      return;
    }

    this.updateDataElementsWithNewSelectedDataElements(dataElements);
    this.setPristine();
  }

  public closeModal() {
    this.activeModal.dismiss('Cross click');
    this.resetModels();
  }

  public onSubmit() {
    this.selectedLocationDataSnapshot = _.cloneDeep(this.selectedLocationData);

    this.activeModal.close([
      this.selectedLocationData,
      this.selectedDataElements,
      this.selectedLocationDataSnapshot,
      this.locationDataRaw
    ]);

    this.resetModels();
  }

  public stateSelectHandler(event) {
    if (typeof event === 'boolean') {
      this.selectingStates = false;
    } else {
      this.stateList = event.stateOrProvinces;
      this.selectedCountry = event;
      this.selectingStates = true;
    }
  }

  public stateSelectHandlerFromLocation(event) {
    this.stateList = event.stateOrProvinces;
    this.selectedCountry = event;
  }

  public setSelectedStates(selectedStates: []) {
    const countryId = this.selectedCountry.id;
    if (!this.selectedLocationData.find(country => countryId === country.id)) {
      this.selectedCountry.selected = true;
      this.onLocationSelected([this.selectedCountry]);
    }
    const selectedLocation = this.selectedLocationData.find(
      country => countryId === country.id
    );
    selectedLocation.selectedStates = selectedStates;
    selectedLocation.selected = true;

    this.selectedCountry.selectedStates = selectedStates;
    this.setPristine();
  }

  public getModalTitle() {
    if (this.modalHeaderTile) {
      return this.modalHeaderTile;
    } else {
      return this.type === 'Data Subject Location'
        ? this.type
        : `Add ${this.type} - ${this.typeName}`;
    }
  }

  // Function which will abstract type from human reading text as text may be changed later on
  public getDataTypeGDPRString(type: 'Data Subject' | 'Data Recipient') {
    switch (type) {
      case 'Data Subject':
        return 'Data Subject';
      case 'Data Recipient':
        return 'Data Recipient';
      default:
        return '';
    }
  }

  public emitActiveTabId(event: string) {
    /**
     * Since ta-location is rendered and destroy through ngIf
     * To save the state of current selected tab
     * We listen to the event emitter emitActiveTabId
     */
    this.setActiveTabId = event;
  }
}
