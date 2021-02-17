import {
  Component,
  OnInit,
  Input,
  NgZone,
  ChangeDetectorRef,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { ItSystemDataElementsService } from './it-system-data-elements.service';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { tap, map } from 'rxjs/operators';
import { DataInterface } from 'src/app/shared/components/categorical-view/categorical-view.component';
import { DataElementsService } from 'src/app/shared/services/data-elements/data-elements.service';
import { Item } from 'src/app/shared/components/categorical-view/item-model';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { Observable, of, Subscription } from 'rxjs';
import { CompletionStateService } from '../../../../shared/services/completion-state/completion-state.service';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';
import { CanDeactivateTabInterface } from 'src/app/shared/components/tabset-guarded/can-deactivate-tab.model';
import { RoutingStateService } from 'src/app/global-services/routing-state.service';
import { NotificationService } from '../../../../shared/services/notification/notification.service';

declare const _: any;

@AutoUnsubscribe(['_getDataElements$'])
@Component({
  selector: 'ta-it-system-data-elements',
  templateUrl: './it-system-data-elements.component.html',
  styleUrls: ['./it-system-data-elements.component.scss']
})
export class ItSystemDataElementsComponent
  implements OnInit, OnDestroy, CanDeactivateTabInterface {
  public dataElementGroups: DataInterface[] = [];
  public selectedIds: string[] = [];
  public baseDomain: BaseDomainInterface = {} as BaseDomainInterface;
  public dirty = false;

  private _onCancelSubscription$: Subscription;
  private _getDataElements$: Subscription;
  private cancelChanges: boolean;

  private selectedDataElementIdList: string[] = [];
  private savedSelectedIds: string[] = [];

  @Input() set baseDomainId(newBaseDomainId: string) {
    if (newBaseDomainId) {
      this.itSystemDataElementsService
        .getSelectedDataElementIds(newBaseDomainId)
        .subscribe(selectedDataElementIdsResponse => {
          this.selectedIds = this.itSystemDataElementsService.mapDataElementsToIds(
            selectedDataElementIdsResponse.dataElements
          );
          this.baseDomain = {
            id: selectedDataElementIdsResponse.id,
            version: selectedDataElementIdsResponse.version
          };
          this.updateSelections();
        });
    }
  }
  @Input() styleClass = 'categorical-view-component';
  @Input() preselectedDataElementIds: string[] = [];
  @Output() public selectionsUpdated = new EventEmitter<string[]>();
  @Output() public isSaving = new EventEmitter<boolean>();

  constructor(
    private itSystemDataElementsService: ItSystemDataElementsService,
    private dataElementsService: DataElementsService,
    public zone: NgZone,
    private ref: ChangeDetectorRef,
    private completionStateService: CompletionStateService,
    private dataInventoryService: DataInventoryService,
    private routingStateService: RoutingStateService,
    private notificationService: NotificationService
  ) {
    this.savedSelectedIds = routingStateService.getDataHistoryOnReconstruct(
      'addedDataElements'
    );
  }

  updateSelections() {
    // NOTE: We must update this value to trigger Angular to update the page.
    // Mutating it will NOT trigger a UI update.
    this.dataElementGroups = this.dataElementGroups.map(group => ({
      ...group,
      items: group.items.map(item => ({
        ...item,
        selected:
          (this.selectedIds || []).includes(item.id) ||
          (this.preselectedDataElementIds || []).includes(item.id)
      }))
    }));
  }

  public dataElementUpdated(item: Item) {
    this.selectedDataElementIdList.push(item.id);
    this.dirty = true;
    const includesId = this.selectedIds.includes(item.id);
    if (item.selected && !includesId) {
      this.selectedIds.push(item.id);
    } else if (!item.selected && includesId) {
      this.selectedIds = this.selectedIds.filter(id => id !== item.id);
    } else {
      // This case may happen when the user clicks Select All:
      // The user has added an item that was already added, or
      // removed an item that was not in the list.  In either case,
      // do nothing.
    }
    this.selectionsUpdated.emit(this.selectedIds);
  }

  public save(): Observable<BaseDomainInterface> {
    if (this.cancelChanges) {
      return of({ id: null, version: null });
    }

    if (this.routingStateService.getLatestReplayableHistory()) {
      this.selectedDataElementIdList = _(this.selectedIds)
        .intersection(this.selectedDataElementIdList)
        .concat(this.savedSelectedIds)
        .uniq()
        .value();

      this.routingStateService.addDataToLatestHistory(
        'addedDataElements',
        this.selectedDataElementIdList
      );
    }

    if (!this.dirty) {
      // If there were no changes, don't save.
      return of(this.baseDomain);
    } else {
      this.isSaving.emit(true);
      return this.completionStateService.watchCompletionState(
        this.itSystemDataElementsService
          .updateSelectedDataElementIds(this.baseDomain, this.selectedIds)
          .pipe(
            tap(baseDomain => {
              this.isSaving.emit(false);
              this.baseDomain = baseDomain;
            })
          )
      );
    }
  }

  ngOnInit() {
    this.getDataElementsGroups();
    this.onCancelChanges();
    this.subscribeToNotifications();
  }

  getDataElementsGroups(page = 0) {
    this._getDataElements$ = this.dataElementsService
      .getAllDataElementsPaged(page)
      .subscribe((response: { last: boolean; content: DataInterface[] }) => {
        if (this.dataElementGroups) {
          this.dataElementGroups.push(...response.content);
        } else {
          this.dataElementGroups = response.content;
        }
        if (response.last) {
          this.updateSelections();
        } else {
          this.getDataElementsGroups(page + 1);
        }
      });
  }

  public subscribeToNotifications() {
    this.notificationService.getData().subscribe(event => {
      if (event.action === 'COLLABORATOR_INVITED_SUCCESS') {
        if (event.payload.version) {
          this.baseDomain.version = event.payload.version;
        }
      }
    });
  }

  private onCancelChanges() {
    this.onCancelChangesSubscriber();
    this._onCancelSubscription$ = this.dataInventoryService.getCancelFormChanges.subscribe(
      (value: boolean) => {
        if (value) {
          this.routingStateService.removeLatestHistoryData([
            'addedDataElements',
            'addedProcessingPurposes'
          ]);
          this.cancelChanges = true;
          this.dataInventoryService.goBackDataInventoryListPage();
        }
      }
    );
  }

  private onCancelChangesSubscriber() {
    if (this._onCancelSubscription$) {
      this._onCancelSubscription$.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.dataElementGroups = [];
    this.onCancelChangesSubscriber();
    this.dataElementGroups = [];
  }

  canDeactivateTab(): Observable<boolean> {
    return this.save().pipe(map(() => true));
  }
}
