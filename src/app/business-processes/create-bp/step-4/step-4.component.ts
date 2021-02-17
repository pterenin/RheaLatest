import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { ActivatedRoute, Router } from '@angular/router';
import { getRouteParamObservable } from 'src/app/shared/utils/route-utils';
import { Subscription, of, forkJoin } from 'rxjs';
import { tap, flatMap } from 'rxjs/operators';
import { Step4ItemsComponent } from 'src/app/shared/components/step-4-selected-items-container/step-4-selected-items-container.component';
import { AddItSystemComponent } from './add-it-system/add-it-system.component';
import { CreateBusinessProcessesService } from '../create-business-processes.service';
import { StepContainerService } from '../step-container/step-container.service';
import { RoutingStateService } from 'src/app/global-services/routing-state.service';
import { LocationService } from '../../../shared/services/location/location.service';
import { Step4Service } from './step-4.service';
import { ToastService, TaModal } from '@trustarc/ui-toolkit';
import {
  ItSystemDataFlowSaveRequest,
  ItSystemWithLocationId
} from './step-4.model';
import { ItSystemInterface } from '../create-business-processes.model';
import { GlobalRegionInterface } from 'src/app/shared/models/location.model';
import { ItemWithLocationId } from '../step-3/step-3.model';

import { SETTINGS } from 'src/app/app.constants';

declare const _: any;

@AutoUnsubscribe(['_itSystems$', '_init$', '_initData$', '_modal$', '_delete$'])
@Component({
  selector: 'ta-step-4',
  templateUrl: './step-4.component.html',
  styleUrls: ['./step-4.component.scss']
})
export class Step4Component implements OnInit, OnDestroy {
  public containerHeight: string;
  public badgeWidth: string;
  private businessProcessId: string;
  private checkDataElementIdsFromExternalEdit: string[];
  private checkProcessingPurposeIdsFromExternalEdit: string[];
  private savedNodes = [];
  private locations = [];
  private isLoadingModal = false;
  public showRiskFields = SETTINGS.ShowRiskFields;

  private _init$: Subscription;
  private _initData$: Subscription;
  private _modal$: Subscription;
  private _delete$: Subscription;
  private _itSystems$: Subscription;

  @ViewChild('itSystemsSelector')
  private itSystemsComponent: Step4ItemsComponent;

  constructor(
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private modalService: TaModal,
    private route: ActivatedRoute,
    private router: Router,
    private routingStateService: RoutingStateService,
    private step4Service: Step4Service,
    private stepContainerService: StepContainerService,
    private locationService: LocationService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.containerHeight = '288px';
    this.badgeWidth = '560px';

    this.initData();
    this.cancelGetItSystems();
    this.handleRouteCallbacks();
  }

  public initData() {
    this._initData$ = this.locationService.getFullCountryList().subscribe(
      (data: GlobalRegionInterface[]) => {
        this.locations = this.locationService.mapLocationsFromRegions(data);
        this.locationService.emitLocationsRawUpdated(this.locations);
        this.step4Service.setLocations(this.locations);
        this.initITSystemComponents();
      },
      err => {
        console.error(err);
      }
    );
  }

  initITSystemComponents() {
    this._init$ = getRouteParamObservable(this.route.parent.paramMap, 'id')
      .pipe(
        tap((id: string) => (this.businessProcessId = id)),
        flatMap(id => this.step4Service.getSavedItSystemNodes(id)),
        flatMap((itSystemItems: any[]) => {
          this.savedNodes = itSystemItems;
          this.savedNodes.forEach(node => {
            node.locationIds.forEach(id => {
              this.locations.forEach(location => {
                if (location.id === id) {
                  node.locations.push(location);
                }
              });
            });
          });
          return of(this.savedNodes);
        })
      )
      .subscribe(
        itSystemItems => {
          this.itSystemsComponent.setSelectedDataItems([...itSystemItems]);
        },
        error =>
          this.createBusinessProcessesService.show404ErrorAndRedirect(error)
      );
  }

  ngOnDestroy() {}

  /**
   * Handles route callbacks for when the routingStateService is used.
   */
  private handleRouteCallbacks() {
    const latestHistory = this.routingStateService.getLatestReplayableHistory();
    if (latestHistory && latestHistory.url === this.router.url) {
      const latestHistoryPopped = this.routingStateService.popHistory();

      this.checkDataElementIdsFromExternalEdit =
        latestHistoryPopped.data.addedDataElements;
      this.checkProcessingPurposeIdsFromExternalEdit =
        latestHistoryPopped.data.addedProcessingPurposes;

      let type: 'edited' | 'added' =
        latestHistoryPopped.data && latestHistoryPopped.data.id
          ? 'edited'
          : 'added';

      if (history.state.action === 'New') {
        type = 'added';
      }

      this.openItSystemModal(latestHistoryPopped.data, type);
    }
  }

  onSubmit() {
    // TODO: (TIMF-4288) add validation and this step logic before emitiing change
    this.stepContainerService.emitChange(1);
  }

  private cancelGetItSystems() {
    if (this._itSystems$) {
      this._itSystems$.unsubscribe();
    }
  }

  public getLocationData(locations, selectedItems, currentSelection) {
    const isSelected = country => {
      return selectedItems.find(
        item =>
          item.location === country.threeLetterCode &&
          item.id === currentSelection.id
      );
    };

    return locations
      .map(region => ({
        ...region,
        countries: region.countries.filter(country => !isSelected(country))
      }))
      .filter(region => region.countries.length > 0);
  }

  public openItSystemModal(
    $event: ItSystemInterface,
    reason: 'added' | 'edited'
  ) {
    if (this.isLoadingModal) {
      return;
    }

    this.isLoadingModal = true;
    const currentItems: ItemWithLocationId[] = this.itSystemsComponent.getSelectedDataItems();

    this._modal$ = this.step4Service
      .getItSystemLocationData($event)
      .subscribe(
        ([itSystemProperties, allowedLocations]: [
          any,
          GlobalRegionInterface[]
        ]) => {
          const locationsToDisplay =
            reason === 'edited'
              ? allowedLocations
              : this.getLocationData(allowedLocations, currentItems, $event);

          const modalRef = this.modalService.open(AddItSystemComponent, {
            windowClass: 'ta-modal-add-it-system',
            size: 'md'
          });

          if (this.checkDataElementIdsFromExternalEdit) {
            modalRef.componentInstance.preSelectDataElementIds = this.checkDataElementIdsFromExternalEdit;
            this.checkDataElementIdsFromExternalEdit = null;
          }
          if (this.checkProcessingPurposeIdsFromExternalEdit) {
            modalRef.componentInstance.preSelectProcessingPurposeIds = this.checkProcessingPurposeIdsFromExternalEdit;
            this.checkProcessingPurposeIdsFromExternalEdit = null;
          }

          this.isLoadingModal = false;
          modalRef.componentInstance.businessProcessId = this.businessProcessId;
          modalRef.componentInstance.itSystemProperties = itSystemProperties;
          modalRef.componentInstance.locationData = locationsToDisplay;
          modalRef.componentInstance.itSystemData = $event;
          modalRef.componentInstance.mode = reason;
          modalRef.componentInstance.showRiskFields = this.showRiskFields;

          modalRef.result.then(
            success => {
              const itSystemCountries: ItSystemDataFlowSaveRequest[] = success.map(
                itSystem => ({
                  ...itSystem,
                  locationIds: [itSystem.locationId],
                  businessProcessId: this.businessProcessId
                })
              );

              this.savedNodes
                .filter(system => {
                  return system.entityId === itSystemCountries[0].entityId;
                })
                .forEach(system => {
                  itSystemCountries[0].nodeId = system.nodeId;
                });

              if (reason === 'added') {
                this.step4Service
                  .saveItSystemNode(this.businessProcessId, itSystemCountries)
                  .subscribe(responseData => {
                    this.initData();
                  });
              } else {
                this.step4Service
                  .updateItSystemNode(
                    this.businessProcessId,
                    itSystemCountries[0]
                  )
                  .subscribe(() => {});
              }
            },
            error => {
              this.itSystemsComponent.setSelectedDataItems(currentItems);
            }
          );
        }
      );
  }

  public delete($event: ItSystemWithLocationId) {
    const { nodeId } = $event;
    this._delete$ = this.step4Service
      // Get all data transfers for current business process
      .findAllDataTransfersByBPIdAndNodeId(this.businessProcessId, nodeId)
      .pipe(
        flatMap(res => {
          if (Array.isArray(res)) {
            // Loop through the existing data transfers and check if current node Id is used already
            res.forEach(item => {
              const { sourceNodeId, targetNodeId } = item;
              if (sourceNodeId === nodeId || targetNodeId === nodeId) {
                throw new Error('FORBIDDEN');
              }
            });
          }
          // Optimistic rerender of the list in UI before deletion
          this.itSystemsComponent.renderListAfterRemovingItem($event);

          // Delete node after checking deleting is safe
          return this.step4Service.deleteNode(this.businessProcessId, nodeId);
        })
      )
      .subscribe(
        res => {},
        err => {
          if (err.message === 'FORBIDDEN') {
            // [i18n-tobeinternationalized]
            return this.toastService.error(
              'Remove System from step 5 before deleting it from step 4'
            );
          }
          // [i18n-tobeinternationalized]
          this.toastService.error('Error deleting selected systems.');
        }
      );
  }

  public deleteAll($event) {
    const nodeIdsToDelete = [];
    const subs = [];
    if (Array.isArray($event)) {
      $event.forEach(item => {
        nodeIdsToDelete.push(item.nodeId);
        subs.push(
          this.step4Service.findAllDataTransfersByBPIdAndNodeId(
            this.businessProcessId,
            item.nodeId
          )
        );
      });
    }
    this._delete$ = forkJoin(subs)
      .pipe(
        flatMap(res => {
          if (Array.isArray(res)) {
            // Flatten the 2-dim array response
            const flatten = [].concat(...res);
            // Loop through the existing data transfers and check if current node Ids are used already
            flatten.forEach(item => {
              const { sourceNodeId, targetNodeId } = item;
              const existsInSource = _.includes(nodeIdsToDelete, sourceNodeId);
              const existsInTarget = _.includes(nodeIdsToDelete, targetNodeId);
              if (existsInSource || existsInTarget) {
                throw new Error('FORBIDDEN');
              }
            });
          }
          // Optimistic rerender of the empty list in UI before deletion
          this.itSystemsComponent.renderEmptyList();

          // Delete nodes after checking deleting is safe
          return this.step4Service.deleteAllNodes(this.businessProcessId);
        })
      )
      .subscribe(
        res => {},
        err => {
          if (err.message === 'FORBIDDEN') {
            // [i18n-tobeinternationalized]
            return this.toastService.error(
              'Some of the systems are used in step 5, delete them first'
            );
          }
          // [i18n-tobeinternationalized]
          this.toastService.error('Error deleting all systems.');
        }
      );
  }

  public addSystem() {
    const redirectTo = [`/data-inventory/my-inventory/it-system/new`];
    const qParams = { action: 'New' };
    this.routingStateService.pushHistory(this.router.url, {});
    this.router.navigate(redirectTo, { queryParams: qParams });
  }
}
