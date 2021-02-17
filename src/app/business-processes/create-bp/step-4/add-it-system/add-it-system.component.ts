import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { TaActiveModal, TaTabChangeEvent } from '@trustarc/ui-toolkit';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import {
  ItSystemInterface,
  ItSystemPropertiesInterface
} from '../../create-business-processes.model';

import {
  CountryInterface,
  GlobalRegionInterface
} from 'src/app/shared/models/location.model';
import { Selection } from 'src/app/shared/components/categorical-view/category-model';
import { forkJoin, of, Subscription } from 'rxjs';
import { CreateBusinessProcessesService } from '../../create-business-processes.service';
import { Step4Service } from '../step-4.service';
import { LocationComponent } from 'src/app/shared/components/location/location.component';
import { DataInterface } from 'src/app/shared/components/categorical-view/categorical-view.component';
import { ItSystemDataFlowSaveRequest, ItSystemNode } from '../step-4.model';
import { exists } from 'src/app/shared/utils/basic-utils';
import { RoutingStateService } from 'src/app/global-services/routing-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessingPurposesService } from '../../../../shared/services/processing-purposes/processing-purposes.service';
import { DataElementsService } from 'src/app/shared/services/data-elements/data-elements.service';
import { ThirdPartyType } from '../../../../app.constants';

import { BaseCategoryInterface } from 'src/app/shared/components/categorical-view/base-category.model';
import { ProcessingPurposeInterface } from 'src/app/shared/models/processing-purposes.model';

declare const _: any;

@AutoUnsubscribe(['_initialization$', '_processingPurposes$', '_dataElements$'])
@Component({
  selector: 'ta-add-it-system',
  templateUrl: './add-it-system.component.html',
  styleUrls: ['./add-it-system.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddItSystemComponent implements OnInit, OnDestroy {
  @Input() public businessProcessId: string;
  @Input() public itSystemData: ItSystemInterface;
  @Input() public itSystemProperties: ItSystemPropertiesInterface;
  @Input() public locationData: GlobalRegionInterface[] = [];
  @Input() public preSelectDataElementIds: string[];
  @Input() public preSelectProcessingPurposeIds: string[];
  @Input() public mode: 'added' | 'edited' = 'added';
  @Input() public showRiskFields: boolean;

  public countSelectedCountries: number;
  public countSelectedProcessingPurposes: number;
  public countSelectedDataElements: number;
  public selectedCountries: CountryInterface[] = [];
  public country = 'country';
  public activeTabId: string;

  private _processingPurposes$: Subscription;
  private _dataElements$: Subscription;

  public itSystemNode: ItSystemNode;
  public dataElementCategories: any[] = [];
  public processingPurposes: any[] = [];

  public dataElementsData: DataInterface[] = [];
  public processingPurposeData: DataInterface[] = [];

  public _initialization$: Subscription;

  public isFetching = false;
  public isSaving = false;
  private id: string;

  @ViewChild('locationSelector') locationSelector: LocationComponent;

  constructor(
    public activeModal: TaActiveModal,
    private step4Service: Step4Service,
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private routingStateService: RoutingStateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private processingPurposesService: ProcessingPurposesService,
    private dataElementService: DataElementsService
  ) {
    this.countSelectedCountries = 0;
    this.countSelectedDataElements = 0;
    this.countSelectedProcessingPurposes = 0;
  }

  ngOnInit() {
    this.initDefaultElements = this.initDefaultElements.bind(this);
    this.initElementLists = this.initElementLists.bind(this);

    this.activeTabId =
      this.mode === 'added' ? 'it-system-tab-location' : 'it-system-tab-de';

    if (this.itSystemData) {
      if (this.mode === 'edited') {
        this.country = _.get(this.itSystemData, 'locations[0].country.name');
      }

      this.isFetching = true;
      this.getDataElementsGroups();
      // this.getItSystemData();
    }
  }

  private getItSystemData() {
    const itSystemId = this.itSystemData.id;
    const bpId = this.businessProcessId;
    const locations = this.step4Service.getLocations();
    const itSystemPropertiesSource = this.itSystemProperties
      ? of(this.itSystemProperties)
      : this.createBusinessProcessesService.getItSystemProperties(
          itSystemId,
          locations
        );

    this._initialization$ = forkJoin([
      itSystemPropertiesSource,
      this.step4Service.getSavedItSystemNode(bpId, itSystemId)
    ]).subscribe(
      ([itSystemProperties, itSystemNodes]) => {
        this.itSystemProperties = itSystemProperties;

        this.itSystemNode = itSystemNodes.find(node => {
          const savedLocation = this.itSystemData['locationId'];

          const isThisItSystem = node['entityId'] === itSystemId;
          const isThisItLocation = node['locationId'] === savedLocation;

          return isThisItSystem && isThisItLocation;
        });

        this.initCountryList();

        this.processingPurposesService.addOtherElementToTheEndOfProcessingPurposeCategories(
          this.processingPurposes
        );
        this.initElementLists(
          this.dataElementCategories,
          this.processingPurposes
        );
      },
      error => {}, // TODO: add error handling/display toast
      () => (this.isFetching = false)
    );
  }

  private getDataElementsGroups(page = 0) {
    this._dataElements$ = this.dataElementService
      .getAllDataElementsPaged(page)
      .subscribe((response: { last: boolean; content: DataInterface[] }) => {
        this.dataElementCategories.push(...response.content);
        if (response.last) {
          this.getProcessingPurposesGroups();
        } else {
          this.getDataElementsGroups(page + 1);
        }
      });
  }

  private getProcessingPurposesGroups(page = 0) {
    this._processingPurposes$ = this.processingPurposesService
      .getAllProcessingPurposesPaged(page)
      .subscribe(
        (response: {
          last: boolean;
          content: BaseCategoryInterface<ProcessingPurposeInterface>[];
        }) => {
          this.processingPurposes.push(...response.content);
          if (response.last) {
            this.getItSystemData();
          } else {
            this.getProcessingPurposesGroups(page + 1);
          }
        }
      );
  }

  ngOnDestroy() {
    this.dataElementCategories = [];
    this.processingPurposes = [];
  }

  public isEditDisabled() {
    return false;
  }

  public editItSystem() {
    const itSystemId = this.itSystemData.id;
    const tabForRedirect = this.getTabTitleForRedirect(this.activeTabId);
    const redirectTo = [
      '/data-inventory',
      'my-inventory',
      'it-system',
      `${itSystemId}`
    ];
    const qParams = {
      action: 'Edit',
      tab: tabForRedirect
    };
    this.routingStateService.pushHistory(this.router.url, this.itSystemData);
    this.router.navigate(redirectTo, { queryParams: qParams });
    this.closeModal();
  }

  private getTabTitleForRedirect(nextTab) {
    // We cannot identify tabs by id because ids are generated randomly at runtime,
    // we have to redirect to tab by it's name first and then evaluate it's id
    switch (nextTab) {
      case 'it-system-tab-location':
        return 'Details';
      case 'it-system-tab-de':
        return 'Data';
      case 'it-system-tab-pp':
        return 'Purposes';
    }
  }

  public canSelectLocation() {
    if (this.mode === 'edited') {
      return false;
    }
    if (this.itSystemData) {
      return !this.itSystemData['locationId'];
    }
    return false;
  }

  public initCountryList() {
    const selectedCountries = this.locationData.reduce((acc, region) => {
      return [...acc, ...region.countries.filter(country => country.selected)];
    }, []);

    this.editSelectedCountries(selectedCountries);
  }

  public initElementLists(dataElementCategories, processingPurposeCategories) {
    this.dataElementsData = this.initDefaultElements(
      this.itSystemProperties.dataElements,
      dataElementCategories,
      'dataElementIds'
    );

    this.processingPurposeData = this.initDefaultElements(
      this.itSystemProperties.processingPurpose,
      processingPurposeCategories,
      'processingPurposeIds'
    );

    if (this.itSystemNode) {
      this.dataElementsData = this.initSelectedElements(
        this.dataElementsData,
        this.itSystemNode.dataElementIds
      );

      if (this.preSelectDataElementIds) {
        this.dataElementsData.forEach(dataElement => {
          dataElement.items.forEach(item => {
            if (this.preSelectDataElementIds.find(id => id === item.id)) {
              item.selected = true;
            }
          });
        });
      }

      this.processingPurposeData = this.initSelectedElements(
        this.processingPurposeData,
        this.itSystemNode.processingPurposeIds
      );

      if (this.preSelectProcessingPurposeIds) {
        this.processingPurposeData.forEach(processingPurpose => {
          processingPurpose.items.forEach(item => {
            if (this.preSelectProcessingPurposeIds.find(id => id === item.id)) {
              item.selected = true;
            }
          });
        });
      }
    }

    this.countSelectedDataElements = this.getSelectedElementCountFrom(
      this.dataElementsData
    );

    this.countSelectedProcessingPurposes = this.getSelectedElementCountFrom(
      this.processingPurposeData
    );
  }

  public initDefaultElements(
    selectableElements: Array<{ id: string }>,
    allCategorizedElements: DataInterface[],
    selectedElementsKey: string
  ) {
    const hasSelectableElements =
      (selectableElements && selectableElements.length > 0) ||
      (this.itSystemNode &&
        this.itSystemNode[selectedElementsKey] &&
        this.itSystemNode[selectedElementsKey].length);

    if (!hasSelectableElements) {
      return [];
    }

    const itSystemElementIds = selectableElements.map(de => de.id);
    if (this.itSystemNode && this.itSystemNode[selectedElementsKey]) {
      itSystemElementIds.push(...this.itSystemNode[selectedElementsKey]);
    }
    const categorizedSelectableElements = allCategorizedElements.reduce(
      (acc, category) => {
        const selectableItems = category.items.filter(element =>
          itSystemElementIds.includes(element.id)
        );

        return [
          ...acc,
          {
            ...category,
            items: selectableItems.map(item => ({ ...item, selected: true }))
          }
        ];
      },
      []
    );

    return categorizedSelectableElements;
  }

  public initSelectedElements(selectableElements, selectedElements) {
    if (!exists(this.itSystemNode)) {
      return [];
    }

    const result = selectableElements.map(category => ({
      ...category,
      items: category.items.map(item => ({
        ...item,
        selected: selectedElements.includes(item.id)
      }))
    }));

    return result;
  }

  public getSelectedElementsFrom(elements) {
    return elements.reduce((acc, category) => {
      if (category.label === 'All') {
        return acc;
      }

      const selectedIds = category.items
        .filter(item => item.selected)
        .map(item => item.id);

      return [...acc, ...selectedIds];
    }, []);
  }

  public getSelectedElementCountFrom(elements) {
    return elements.reduce((acc, selection) => {
      const selectedItemCount = (selection.items || []).filter(
        item => item.selected
      ).length;

      return acc + selectedItemCount;
    }, 0);
  }

  public onSelection(
    selections: Selection[],
    data: DataInterface[]
  ): [DataInterface[], number] {
    if (selections === null || selections === undefined) {
      return [data, this.getSelectedElementCountFrom(data)];
    }

    const selectionIds = selections.reduce((acc, selection) => {
      return [...acc, ...selection.items.map(s => s.id)];
    }, []);

    const dataWithSelectionsMarked = data.map(category => ({
      ...category,
      items: category.items.map(item => ({
        ...item,
        selected: selectionIds.includes(item.id)
      }))
    }));

    return [
      dataWithSelectionsMarked,
      this.getSelectedElementCountFrom(dataWithSelectionsMarked)
    ];
  }

  public onProcessingPurposesSelect(selections: Selection[]) {
    [
      this.processingPurposeData,
      this.countSelectedProcessingPurposes
    ] = this.onSelection(selections, this.processingPurposeData);
  }

  public onDataElementSelect(selections: Selection[]) {
    [this.dataElementsData, this.countSelectedDataElements] = this.onSelection(
      selections,
      this.dataElementsData
    );
  }

  public onTabChange($event: TaTabChangeEvent) {
    this.activeTabId = $event.nextId;
  }

  public editSelectedCountries(countries: CountryInterface[]) {
    if (countries.length === 0) {
      return;
    }
    if (countries[0].selected) {
      this.selectedCountries = this.selectedCountries.concat(countries);
    } else {
      const idsToRemove = countries.map(country => country.id);

      this.selectedCountries = this.selectedCountries.filter(
        country => !idsToRemove.includes(country.id)
      );
    }

    this.countSelectedCountries = this.selectedCountries.length;
  }

  public closeModal() {
    this.activeModal.dismiss('Cross click');
  }

  public onSubmit() {
    // perform validation and submit of form once BE and api is ready (TIMF-4636)
    const selectedCountryCodes = this.selectedCountries.map(
      country => country.threeLetterCode
    );
    this.isSaving = true;
    this.step4Service.generateLocations(selectedCountryCodes).subscribe(
      response => {
        this.isSaving = false;
        const itSystems = response.map(
          location =>
            new ItSystemDataFlowSaveRequest(
              this.getSelectedElementsFrom(this.dataElementsData),
              location.locationId,
              this.getSelectedElementsFrom(this.processingPurposeData),
              this.itSystemData.id,
              this.itSystemData.label,
              null,
              this.itSystemData.tag,
              null,
              null,
              null,
              null,
              null,
              null,
              this.itSystemData.nodeId
            )
        );

        this.activeModal.close(itSystems);
      },
      error => {
        this.isSaving = false;
      }
    );
  }

  public getLabelDetailsByTag(tag) {
    switch (tag) {
      case ThirdPartyType.PRIMARY_ENTITY:
        return 'green';
      case ThirdPartyType.COMPANY_AFFILIATE:
        return 'green';
      default:
        return 'orange';
    }
  }
}
