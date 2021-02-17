import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { LocationService } from '../../../shared/services/location/location.service';
import { StepContainerService } from '../step-container/step-container.service';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { DataSubjectsRecipientsService } from 'src/app/shared/services/data-subjects-recipients/data-subjects-recipients.service';
import { BaseCategoryInterface } from 'src/app/shared/components/categorical-view/category-model';
import {
  DataRecipientTypeInterface,
  DataSubjectTypeInterface
} from 'src/app/shared/models/subjects-recipients.model';
import { Step3Service } from './step-3.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { flatMap } from 'rxjs/operators';
import {
  ActivatedRoute,
  CanDeactivate,
  RouterStateSnapshot
} from '@angular/router';
import {
  TaModal,
  TaModalOptions,
  TaModalRef,
  ToastService
} from '@trustarc/ui-toolkit';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocationModalContentComponent } from 'src/app/shared/components/location-modal-content/location-modal-content.component';
import { SelectedItemsContainerComponent } from 'src/app/shared/components/selected-items-container/selected-items-container.component';
import { Item } from 'src/app/shared/components/categorical-view/item-model';
import {
  DataElementsInterface,
  DataNodeInterface,
  DataSubjectRecipentPayload,
  dataType
} from './step-3.model';
import { getRouteParamObservable } from 'src/app/shared/utils/route-utils';
import { CreateBusinessProcessesService } from '../create-business-processes.service';
import {
  GlobalRegionInterface,
  LocationInterface
} from 'src/app/shared/models/location.model';
import { SETTINGS } from 'src/app/app.constants';
import { DataInterface } from '../../../shared/components/categorical-view/categorical-view.component';

declare const _: any;

@AutoUnsubscribe(['_init$', '_delete$', '_isUpdating$'])
@Component({
  selector: 'ta-step-3',
  templateUrl: './step-3.component.html',
  styleUrls: ['./step-3.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Step3Component
  implements OnInit, OnDestroy, CanDeactivate<Step3Component> {
  public locationData: GlobalRegionInterface[];
  public fullDataSubjectList: BaseCategoryInterface<DataSubjectTypeInterface>[];
  public fullDataRecipientList: BaseCategoryInterface<
    DataRecipientTypeInterface
  >[];
  public locations: LocationInterface[] | Object;
  public containerHeight: string;
  public badgeWidth: string;
  public isNavDisabled: boolean;
  public isLoading = true;
  public showRiskFields = SETTINGS.ShowRiskFields;
  public allDataElements: DataInterface[] = [];

  private businessProcessId: string;
  private _init$: Subscription;
  private _delete$: Subscription;
  private _isUpdating$: Subscription;
  private locationStream: Subscription;
  public isEditProcessing: boolean;

  step3Form: FormGroup;

  @ViewChild('dataSubjectSelector')
  private dataSubjectComponent: SelectedItemsContainerComponent;

  @ViewChild('dataRecipientSelector')
  private dataRecipientComponent: SelectedItemsContainerComponent;

  constructor(
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private dataSubjectRecipientService: DataSubjectsRecipientsService,
    private formBuilder: FormBuilder,
    private modalService: TaModal,
    private route: ActivatedRoute,
    private authService: AuthService,
    private stepContainerService: StepContainerService,
    private step3Service: Step3Service,
    private toastService: ToastService,
    private locationService: LocationService
  ) {
    this.step3Form = this.formBuilder.group({
      subjects: [],
      recipients: []
    });
    this.locations = [];
  }

  public initForm() {
    this.step3Form.patchValue({
      value: {
        subjects: [],
        recipients: []
      },
      options: { emitEvent: false }
    });
    if (this.dataSubjectComponent) {
      this.dataSubjectComponent.initializeAllDataItemsToBeEmpty(false);
    }
    if (this.dataRecipientComponent) {
      this.dataRecipientComponent.initializeAllDataItemsToBeEmpty(false);
    }
  }

  public getDataSubjectOptions() {
    return { showMappedTag: this.authService.isInternalAdmin() };
  }

  public initData() {
    // Init locations data
    this.locationStream = this.locationService.getFullCountryList().subscribe(
      (data: GlobalRegionInterface[]) => {
        this.locationData = data;
        this.locations = this.locationService.mapLocationsFromRegions(data);
        this.locationService.emitLocationsRawUpdated(this.locations);
        this.step3Service.setLocations(this.locations);
        this.initDataSubjectsAndRecipient();
      },
      err => {
        console.error(err);
      }
    );

    // Init data elements
    this.createBusinessProcessesService.getDataElements().subscribe(
      data => {
        this.allDataElements = data;
      },
      err => {
        console.error(err);
      }
    );
  }

  ngOnInit() {
    this.initData();
    this._isUpdating$ = this.step3Service.getIsUpdatingSubject().subscribe(
      isUpdating => (this.isNavDisabled = isUpdating),
      err => console.error(err)
    );

    this.containerHeight = '288px';
    this.badgeWidth = '280px';
  }

  resetModalModels() {
    this.allDataElements.forEach(dataElement => {
      dataElement.items.forEach(item => {
        item.selected = false;
      });
    });
    this.locationData.forEach(region => {
      region.countries.forEach(country => {
        country.selected = false;
      });
    });
  }

  transformDataForSelectContainer(
    payload: DataSubjectRecipentPayload[]
  ): DataNodeInterface[] {
    return payload.map(node => ({
      businessProcessId: node.businessProcessId,
      label: node.dataSubjectType || node.dataRecipientType,
      location: node.locationIds.length.toString(),
      subItem: node.dataSubjectType ? 'Data Subject' : 'Data Recipient',
      tag: null,
      mapped: node.mapped,
      unReselectable: true,
      locationIds: node.locationIds,
      dataElementIds: node.dataElementIds,
      nodeId: node.nodeId,
      id: node.entityId
    }));
  }

  initDataSubjectsAndRecipient() {
    if (this._init$) {
      this._init$.unsubscribe();
    }
    this._init$ = forkJoin([
      this.dataSubjectRecipientService.getDataSubjectTypeList(),
      this.dataSubjectRecipientService.getDataRecipients()
    ])
      .pipe(
        flatMap(([dataSubjects, dataRecpients]) => {
          this.fullDataSubjectList = dataSubjects.map(ds => ({
            ...ds,
            items: ds.items.map(item => ({
              ...item,
              isDsOrDr: true
            }))
          }));

          this.fullDataRecipientList = dataRecpients.map(dr => ({
            ...dr,
            items: dr.items.map(item => ({
              ...item,
              isDsOrDr: true
            }))
          }));
          return getRouteParamObservable(this.route.parent.paramMap, 'id');
        }),
        flatMap(id => {
          this.initForm();
          this.businessProcessId = id;
          return this.step3Service.getSavedNodes(id);
        }),
        flatMap(([dataSubjectItems, dataRecipientItems]) => {
          this.fullDataSubjectList = this.markSelectedItems(
            dataSubjectItems,
            this.fullDataSubjectList
          );
          this.fullDataRecipientList = this.markSelectedItems(
            dataRecipientItems,
            this.fullDataRecipientList
          );
          this.isLoading = false;
          const subjects = this.transformDataForSelectContainer(
            dataSubjectItems
          );
          const recipients = this.transformDataForSelectContainer(
            dataRecipientItems
          );

          return of([subjects, recipients]);
        })
      )
      .subscribe(
        ([dataSubjectItems, dataRecipientItems]) => {
          this.dataSubjectComponent.setSelectedDataItems(dataSubjectItems);
          this.dataRecipientComponent.setSelectedDataItems(dataRecipientItems);
        },
        error =>
          this.createBusinessProcessesService.show404ErrorAndRedirect(error)
      );
  }

  markSelectedItems(selectedItems, fullItemList) {
    fullItemList.forEach(categoy => {
      categoy.items.forEach(item => {
        item.selected = selectedItems.some(
          selectedItem => selectedItem.entityId === item.id
        );
      });
    });
    return [...fullItemList];
  }

  ngOnDestroy() {
    if (this.locationStream) {
      this.locationStream.unsubscribe();
    }
    if (this._init$) {
      this._init$.unsubscribe();
    }
  }

  public onSubmit() {
    this.stepContainerService.emitChange(1);
  }

  public canDeactivate(
    step3Component: Step3Component,
    _currentRoute,
    _currentState,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return !this.isNavDisabled;
  }

  public open($event: Item, type: dataType) {
    const selector =
      type === 'Data Subject'
        ? this.dataSubjectComponent
        : this.dataRecipientComponent;

    selector.setSelectedDataItems(
      selector
        .getSelectedDataItems()
        .filter((item: Item) => item.id !== $event.id)
    );

    this.resetModalModels();
    const options: TaModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'ta-modal-location',
      size: 'md'
    };
    const modalRef = this.modalService.open(
      LocationModalContentComponent,
      options
    );
    modalRef.componentInstance.showRiskFields = this.showRiskFields;
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.typeName = $event.label;
    modalRef.componentInstance.locationData = this.locationData;
    modalRef.componentInstance.allDataElements = this.allDataElements;

    modalRef.result.then(
      ([locationData, selectedDataElements]) => {
        const locationUpdates = locationData.map(
          location =>
            new Item(
              $event.label,
              $event.id,
              true,
              $event.subItem,
              $event.tag,
              location.threeLetterCode,
              $event.senderId,
              $event.receiverId,
              null
            )
        );

        this.step3Service
          .updateNodes(
            selector.getSelectedDataItems(),
            this.businessProcessId,
            type,
            locationUpdates,
            selectedDataElements,
            false
          )
          .subscribe(
            res => {
              const transformations: DataNodeInterface[] = this.transformDataForSelectContainer(
                res
              );
              const selectedItems = selector.getSelectedDataItems();
              let isUpdate = false;

              selectedItems.map(item => {
                const nodeExists = transformations.find(
                  node => node.nodeId === item.nodeId
                );

                if (nodeExists) {
                  item.location = nodeExists.location;
                  item.locationIds = nodeExists.locationIds;
                  isUpdate = true;
                }
              });

              if (isUpdate) {
                selector.setSelectedDataItems(selectedItems);
              } else {
                selector.setSelectedDataItems([
                  ...selector.getSelectedDataItems(),
                  ...transformations
                ]);
              }
            },
            error => {
              console.error(error); // here if not logging error message will lead to very hard any issue tracking (too big function above)
              this.handleUpdateNodesError(error, type);
            }
          );
      },
      cancelMessage => {
        selector.removeFromList($event, false);
      }
    );
  }

  public edit(
    $event: DataNodeInterface,
    type: 'Data Subject' | 'Data Recipient' = 'Data Subject'
  ) {
    // Prevent double api calls
    if (this.isEditProcessing) {
      return false;
    }

    this.isEditProcessing = true;
    const { locationIds, dataElementIds } = $event;
    const selector =
      type === 'Data Subject'
        ? this.dataSubjectComponent
        : this.dataRecipientComponent;

    const matchLocation = (locations: LocationInterface[]) => {
      const matches: LocationInterface[] = [];
      locations.map((location: LocationInterface) => {
        locationIds.forEach(locationId => {
          if (location.id === locationId) {
            matches.push(location);
          }
        });
      });
      return matches;
    };

    const setCountrySelection = (
      selectedLocations: LocationInterface[],
      regions: GlobalRegionInterface[]
    ) => {
      const selectedCountriesIds = selectedLocations.map(
        location => location.country.id
      );
      const setSelectionToCountry = region =>
        _.map(region.countries, country => {
          country.selected = _.includes(selectedCountriesIds, country.id);
        });
      _.map(regions, setSelectionToCountry);

      return regions;
    };

    const setSelectedDataElements = (
      dataElementIdStrings: string[],
      dataElements: DataElementsInterface[]
    ) => {
      const mapDataElements = (): DataElementsInterface[] => {
        dataElements.forEach(element =>
          element.items.forEach(item => {
            item.selected = _.includes(dataElementIdStrings, item.id);
          })
        );
        return dataElements;
      };

      return type === 'Data Subject' ? mapDataElements() : [];
    };

    forkJoin([
      of(this.locations),
      of(this.locationData),
      of(this.allDataElements)
    ])
      .pipe(
        flatMap(([locations, regions, dataElements]: Array<any>) => {
          return of([
            matchLocation(locations),
            regions,
            setSelectedDataElements(dataElementIds, dataElements)
          ]);
        }),
        flatMap(([selectedLocation, regions, selectedDataElements]) => {
          return of([
            setCountrySelection(selectedLocation, regions),
            selectedDataElements
          ]);
        })
      )
      .subscribe(([regions, selectedDataElements]) => {
        const options: TaModalOptions = {
          ariaLabelledBy: 'modal-basic-title',
          windowClass: 'ta-modal-location',
          size: 'md'
        };
        const modalRef: TaModalRef = this.modalService.open(
          LocationModalContentComponent,
          options
        );
        modalRef.componentInstance.type = type;
        modalRef.componentInstance.typeName = $event.label;
        modalRef.componentInstance.locationData = regions;
        modalRef.componentInstance.dataElements = selectedDataElements;
        modalRef.componentInstance.allDataElements = this.allDataElements;
        modalRef.componentInstance.showRiskFields = this.showRiskFields;

        modalRef.result.then(
          ([newLocations, newDataElements, modal]) => {
            // If newDataElements length is zero. Then it means that no new data elements were selected.
            // use existing selected data elements in update request
            if (!newDataElements.length && type === 'Data Subject') {
              selectedDataElements.forEach(category => {
                const cat = category.items.filter(item =>
                  item.selected ? true : false
                );
                if (cat.length) {
                  category.items = cat;
                  newDataElements.push(category);
                }
              });
            }
            const existingLocations = [];
            regions.forEach(region => {
              region.countries.forEach(country => {
                if (country.selected) {
                  existingLocations.push(country);
                }
              });
            });

            newLocations.forEach(loc => {
              if (!existingLocations.includes(loc)) {
                existingLocations.push(loc);
              }
            });

            const locationUpdates = existingLocations.map(
              location =>
                new Item(
                  $event.label,
                  $event.nodeId,
                  true,
                  $event.subItem,
                  $event.tag,
                  location.threeLetterCode,
                  null,
                  null,
                  null
                )
            );

            this.step3Service
              .updateNodes(
                selector.getSelectedDataItems(),
                this.businessProcessId,
                type,
                locationUpdates,
                newDataElements,
                true
              )
              .pipe(
                flatMap(([successfulUpdate]) => {
                  if (successfulUpdate) {
                    return this.step3Service.getSavedNodes(
                      this.businessProcessId
                    );
                  } else {
                    return of([]);
                  }
                })
              )
              .subscribe(
                ([dataSubjects, dataRecipients]) => {
                  const dataSubjectsNodes: DataNodeInterface[] = this.transformDataForSelectContainer(
                    dataSubjects
                  );
                  const dataRecipientNodes: DataNodeInterface[] = this.transformDataForSelectContainer(
                    dataRecipients
                  );

                  if (type === 'Data Subject') {
                    this.dataSubjectComponent.setSelectedDataItems(
                      dataSubjectsNodes
                    );
                  } else {
                    this.dataRecipientComponent.setSelectedDataItems(
                      dataRecipientNodes
                    );
                  }
                },
                error => {
                  this.handleUpdateNodesError(error, type);
                }
              );
            this.isEditProcessing = false;
          },
          () => {
            this.isEditProcessing = false;
          }
        );
      });
  }

  public delete($event: DataNodeInterface, type: dataType) {
    this._delete$ = this.step3Service
      .deleteNode(this.businessProcessId, $event.nodeId, type)
      .subscribe(
        success => {
          /* Happy Path; Do nothing */
        },
        error => {
          // [i18n-tobeinternationalized]
          this.toastService.error(`Error deleting the selected ${type}.`);
        }
      );
  }

  public deleteGroup($event, type: dataType) {
    this._delete$ = this.step3Service
      .deleteGroupNode(this.businessProcessId, $event.nodeId, type)
      .subscribe(
        success => {
          /* Happy Path; Do nothing */
        },
        error => {
          // [i18n-tobeinternationalized]
          this.toastService.error(`Error deleting group of ${type}s.`);
        }
      );
  }

  public deleteAll(type: dataType) {
    this._delete$ = this.step3Service
      .deleteAllNodes(this.businessProcessId, type)
      .subscribe(
        success => {
          /* Happy Path; Do nothing */
        },
        error => {
          this.toastService.error(
            // [i18n-tobeinternationalized]
            type === 'Data Subject'
              ? 'Error deleting data subjects.'
              : 'Error deleting data recipients.'
          );
        }
      );
  }

  private handleUpdateNodesError(error, type) {
    // [i18n-tobeinternationalized]
    if (error.status === 409) {
      this.toastService.error(
        'A node with the selected data subject and locations already exists'
      );
    } else {
      this.toastService.error(
        `Error updating the selected ${type}
                with the selected countries.`
      );
    }
  }

  public handleItemAddingForbidden() {
    // [i18n-tobeinternationalized]
    this.toastService.error(
      'Item already selected. Edit record or delete it first',
      null,
      4000
    );
  }
}
