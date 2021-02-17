import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  EventEmitter
} from '@angular/core';

import { TaPopover, TaModal } from '@trustarc/ui-toolkit';
import { ThirdPartyType } from 'src/app/app.constants';
import { GlobalRegionInterface } from 'src/app/shared/models/location.model';
import { CountryInterface } from 'src/app/shared/models/location.model';
import { NodeEntityType } from '../build-data-flow.model';
import { noop } from 'rxjs';

declare const _: any;

@Component({
  selector: 'ta-data-flow-popover',
  templateUrl: './data-flow-popover.component.html',
  styleUrls: ['./data-flow-popover.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataFlowPopoverComponent implements OnInit, OnChanges {
  @Input() popoverData: any;
  @Input() locations: any[];
  @Input() allGlobalRegions: GlobalRegionInterface[];
  @Input() allDataElements: any[];
  @Input() allProcessingPurposes: any[];

  @Output() public savePopoverData = new EventEmitter();
  @Output() public itemSelected = new EventEmitter();

  public selectedCountries = [];
  public location: string;
  public entityType: NodeEntityType;
  public globalRegionsForDisplay: GlobalRegionInterface[];
  public dataElementsForDisplay: any[];
  public processingPurposesForDisplay: any[];
  public selectedLocationsCount = 0;
  public countSelectedDataElements = 0;
  public countSelectedProcessingPurposes = 0;
  public selectedDataElementIds: string[];
  public selectedProcessingPurposeIds: string[];
  private allowChangesToSystem = false;

  @ViewChild('popover') popover: TaPopover;

  constructor(private modalService: TaModal) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.selectedCountries = [];
    if (!this.popoverData) {
      return;
    }
    this.entityType = this.getEntityType();
    this.getLocationData();
    this.getDataElemtsData();
    this.geProcessingPurposesData();
  }

  private isLocationInEdge(locationId: string): boolean {
    return this.popoverData.edge.locationIds.includes(locationId);
  }

  private isDataElementInEdge(dataElementId: string) {
    return this.popoverData.edge.dataElementIds.includes(dataElementId);
  }

  private isProcessingPurposeInEdge(processingPurposeId: string) {
    return this.popoverData.edge.processingPurposeIds.includes(
      processingPurposeId
    );
  }

  private getEntityType(): NodeEntityType {
    const item = this.popoverData.item;
    if (item.isItSystem || (item.selection && item.selection.isItSystem)) {
      return 'System';
    } else if (this.popoverData.edge.sourceNodeId === item.nodeId) {
      return 'Data Subject';
    }
    return 'Data Recipient';
  }

  public getIdentifierTitle() {
    const item = this.popoverData.item;
    return item.sourceNodeId === item.nodeId ? 'sending' : 'receiving';
  }

  private getDataElemtsData() {
    this.selectedDataElementIds = this.popoverData.edge.dataElementIds;
    this.countSelectedDataElements = this.selectedDataElementIds.length;

    const dataElementIds = this.popoverData.edge.dataElementIds || [];
    this.dataElementsForDisplay = _.cloneDeep(this.allDataElements);
    this.dataElementsForDisplay.forEach(dataElementCategory => {
      dataElementCategory.items.forEach(dataElement => {
        if (
          dataElementIds.includes(dataElement.id) ||
          this.entityType === 'Data Recipient'
        ) {
          dataElement.selected = this.isDataElementInEdge(dataElement.id);
          return true;
        } else {
          // don't filter for Data Reciepient
          return false;
        }
      });
    });
  }

  private geProcessingPurposesData() {
    this.selectedProcessingPurposeIds = this.popoverData.edge.processingPurposeIds;
    this.countSelectedProcessingPurposes = this.selectedProcessingPurposeIds.length;

    const processingPurposeIds =
      this.popoverData.edge.processingPurposeIds || [];
    this.processingPurposesForDisplay = _.cloneDeep(this.allProcessingPurposes);
    this.processingPurposesForDisplay.forEach(processingPurposeCategory => {
      processingPurposeCategory.items.forEach(processingPurpose => {
        // don't filter for Data Reciepient
        if (
          processingPurposeIds.includes(processingPurpose.id) ||
          this.entityType === 'Data Recipient'
        ) {
          processingPurpose.selected = this.isProcessingPurposeInEdge(
            processingPurpose.id
          );
          return true;
        } else {
          return false;
        }
      });
    });
  }

  public onDataElementSelect(selectedDataElements, changeToSystemModal) {
    if (!selectedDataElements || !Array.isArray(selectedDataElements)) {
      return;
    }
    const newId = [];
    const dataElemntIds = [];
    selectedDataElements.forEach(category =>
      category.items.forEach(dataElement => {
        dataElemntIds.push(dataElement.id);
        !this.isDataElementInEdge(dataElement.id)
          ? newId.push(dataElement.id)
          : noop();
      })
    );

    if (newId.length && !this.allowChangesToSystem) {
      const modalRef = this.modalService.open(changeToSystemModal);
      modalRef.result
        .then(success => {
          this.selectedDataElementIds = dataElemntIds;
          this.countSelectedDataElements = dataElemntIds.length;
          this.allowChangesToSystem = true;
          modalRef.close();
        })
        .catch(dismiss => {
          this.popover.close();
        });
    } else {
      this.selectedDataElementIds = dataElemntIds;
      this.countSelectedDataElements = dataElemntIds.length;
    }
  }

  public onProcessingPurposeSelect(
    selectedProcessingPurposes,
    changeToSystemModal
  ) {
    if (
      !selectedProcessingPurposes ||
      !Array.isArray(selectedProcessingPurposes)
    ) {
      return;
    }
    const newId = [];
    const processingPurposeIds = [];
    selectedProcessingPurposes.forEach(category =>
      category.items.forEach(pp => {
        processingPurposeIds.push(pp.id);
        !this.isProcessingPurposeInEdge(pp.id) ? newId.push(pp.id) : noop();
      })
    );

    if (newId.length && !this.allowChangesToSystem) {
      const modalRef = this.modalService.open(changeToSystemModal);
      modalRef.result
        .then(success => {
          this.selectedProcessingPurposeIds = processingPurposeIds;
          this.countSelectedProcessingPurposes = processingPurposeIds.length;
          this.allowChangesToSystem = true;
        })
        .catch(dismiss => {
          this.popover.close();
        });
    } else {
      this.selectedProcessingPurposeIds = processingPurposeIds;
      this.countSelectedProcessingPurposes = processingPurposeIds.length;
    }
  }

  public getLocationData() {
    const countryIds = _(this.allGlobalRegions)
      .map(region => region.countries)
      .flatten()
      .map(country => country.id)
      .value();

    this.selectedLocationsCount = this.popoverData.item.isItSystem
      ? 1
      : this.popoverData.edge.locationIds.length;

    this.globalRegionsForDisplay = _.cloneDeep(this.allGlobalRegions);
    this.globalRegionsForDisplay.forEach(region => {
      region.countries.forEach(country => {
        if (
          countryIds.includes(country.id) ||
          this.entityType === 'Data Recipient'
        ) {
          country.selected = this.isLocationInEdge(country.id);
          this.selectedCountries.push(country);
          return true;
        } else {
          country.selected = false;
          // don't filter for Data Reciepient
          return false;
        }
      });
    });
    // only display selected locationf or It System
    if (this.popoverData.item.isItSystem) {
      this.globalRegionsForDisplay = this.globalRegionsForDisplay.filter(
        region => {
          region.countries = region.countries.filter(
            country => country.selected
          );
          return region.countries.length;
        }
      );
    }
  }

  public updateSelectedLocationCount($event) {
    this.selectedLocationsCount = $event;
  }

  public editSelectedCountries(
    countries: CountryInterface[],
    changeToSystemModal
  ) {
    if (countries.length === 0) {
      return;
    }
    const exec = () => {
      if (countries[0].selected) {
        this.selectedCountries = this.selectedCountries.concat(countries);
      } else {
        const idsToRemove = countries.map(country => country.id);

        this.selectedCountries = this.selectedCountries.filter(
          country => !idsToRemove.includes(country.id)
        );
      }
    };

    const showModal = () => {
      const modalRef = this.modalService.open(changeToSystemModal);
      modalRef.result
        .then(success => {
          this.allowChangesToSystem = true;
          exec();
        })
        .catch(dismiss => {
          this.popover.close();
        });
    };

    if (!this.isDataSubject()) {
      return exec();
    }

    this.isLocationInEdge(countries[0].id)
      ? exec()
      : this.allowChangesToSystem
      ? exec()
      : showModal();
  }

  public isDataSubject() {
    return (
      this.popoverData.edge.sourceNodeId === this.popoverData.item.nodeId &&
      !this.popoverData.item.isItSystem
    );
  }

  public saveData() {
    const locationIds = this.selectedCountries
      .filter(country => country.selected)
      .map(country => country.id);
    const newData = {
      locationIds: _.uniq(locationIds),
      dataElementIds: this.selectedDataElementIds,
      processingPurposeIds: this.selectedProcessingPurposeIds,
      saleOfData: this.popoverData.edge.saleOfData
    };
    this.savePopoverData.emit(newData);
  }

  public onSearchChange(search) {
    this.globalRegionsForDisplay = [];
    this.allGlobalRegions.map(region => {
      const containsCountry = region.countries.filter(
        country =>
          String(country.name)
            .toLowerCase()
            .indexOf(search.toLowerCase()) !== -1
      );
      const tempRegion = Object.assign({}, region);
      if (containsCountry.length > 0) {
        tempRegion.countries = containsCountry;
        this.globalRegionsForDisplay.push(tempRegion);
      }
    });
  }

  public open() {
    this.allowChangesToSystem = false;
    this.popover.open();
  }

  public close() {
    this.popover.close();
  }

  public getLabelDetailsByTag(tag: string) {
    switch (tag) {
      case ThirdPartyType.PRIMARY_ENTITY:
      case ThirdPartyType.COMPANY_AFFILIATE:
        return 'green';
      default:
        return 'orange';
    }
  }
}
