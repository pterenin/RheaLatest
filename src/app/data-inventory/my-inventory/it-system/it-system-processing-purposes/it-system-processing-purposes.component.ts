import {
  Component,
  OnInit,
  Input,
  NgZone,
  ChangeDetectorRef,
  ViewEncapsulation,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { ItSystemProcessingPurposesService } from './it-system-processing-purposes.service';
import { tap, map } from 'rxjs/operators';
import { ProcessingPurposesService } from 'src/app/shared/services/processing-purposes/processing-purposes.service';
import { Item } from 'src/app/shared/components/categorical-view/item-model';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { Observable, Subject, of, Subscription } from 'rxjs';
import { CompletionStateService } from '../../../../shared/services/completion-state/completion-state.service';
import { ProcessingPurposeInterface } from 'src/app/shared/models/processing-purposes.model';
import { BaseCategoryInterface } from 'src/app/shared/components/categorical-view/base-category.model';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';
import { CanDeactivateTabInterface } from 'src/app/shared/components/tabset-guarded/can-deactivate-tab.model';
import { RoutingStateService } from 'src/app/global-services/routing-state.service';

declare const _: any;

@AutoUnsubscribe(['_processingPurposes$'])
@Component({
  selector: 'ta-it-system-processing-purposes',
  templateUrl: './it-system-processing-purposes.component.html',
  styleUrls: ['./it-system-processing-purposes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItSystemProcessingPurposesComponent
  implements OnInit, OnDestroy, CanDeactivateTabInterface {
  public processingPurposeGroups: BaseCategoryInterface<
    ProcessingPurposeInterface
  >[] = [];

  public selectedIds: string[] = [];
  private savedSelectedIds: string[] = [];

  public baseDomain: BaseDomainInterface = {} as BaseDomainInterface;
  public dirty = false;
  private _onCancelSubscription$: Subscription;
  private _processingPurposes$: Subscription;
  private cancelChanges: boolean;
  private selectedProcessingPurposeIdList: string[] = [];

  @Input() set baseDomainId(newBaseDomainId: string) {
    if (newBaseDomainId) {
      this.itSystemProcessingPurposesService
        .getSelectedProcessingPurposeIds(newBaseDomainId)
        .subscribe(selectedProcessingPurposeIdsResponse => {
          this.selectedIds =
            selectedProcessingPurposeIdsResponse.processingPurposeIds;
          this.baseDomain = {
            id: selectedProcessingPurposeIdsResponse.id,
            version: selectedProcessingPurposeIdsResponse.version
          };
          this.updateSelections();
        });
    }
  }
  @Input() styleClass = 'categorical-view-component';
  @Input() preselectedProcessingPurposeIds: string[] = [];
  @Output() public selectionsUpdated = new EventEmitter<string[]>();

  constructor(
    private itSystemProcessingPurposesService: ItSystemProcessingPurposesService,
    private processingPurposesService: ProcessingPurposesService,
    public zone: NgZone,
    private ref: ChangeDetectorRef,
    private completionStateService: CompletionStateService,
    private dataInventoryService: DataInventoryService,
    private routingStateService: RoutingStateService
  ) {
    this.savedSelectedIds = routingStateService.getDataHistoryOnReconstruct(
      'addedProcessingPurposes'
    );
  }

  updateSelections() {
    // NOTE: We must update this value to trigger Angular to update the page.
    // Mutating it will NOT trigger a UI update.
    this.processingPurposeGroups = this.processingPurposeGroups.map(group => ({
      ...group,
      items: group.items.map(item => ({
        ...item,
        selected:
          (this.selectedIds || []).includes(item.id) ||
          (this.preselectedProcessingPurposeIds || []).includes(item.id)
      }))
    }));
  }

  public processingPurposeUpdated(item: Item) {
    this.selectedProcessingPurposeIdList.push(item.id);
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
    if (this.routingStateService.getLatestReplayableHistory()) {
      this.selectedProcessingPurposeIdList = _(this.selectedIds)
        .intersection(this.selectedProcessingPurposeIdList)
        .concat(this.savedSelectedIds)
        .uniq()
        .value();

      this.routingStateService.addDataToLatestHistory(
        'addedProcessingPurposes',
        this.selectedProcessingPurposeIdList
      );
    }
    if (this.cancelChanges) {
      return of({ id: null, version: null });
    }

    if (!this.dirty) {
      // If there were no changes, don't save.
      return of(this.baseDomain);
    } else {
      return this.completionStateService.watchCompletionState(
        this.itSystemProcessingPurposesService
          .updateSelectedProcessingPurposeIds(this.baseDomain, this.selectedIds)
          .pipe(
            tap(baseDomain => {
              this.baseDomain = baseDomain;
            })
          )
      );
    }
  }

  ngOnInit() {
    this.getAllProcessingPurposes();
    this.onCancelChanges();
  }

  private getAllProcessingPurposes(page = 0) {
    this._processingPurposes$ = this.processingPurposesService
      .getAllProcessingPurposesPaged(page)
      .subscribe(
        (response: {
          last: boolean;
          content: BaseCategoryInterface<ProcessingPurposeInterface>[];
        }) => {
          this.processingPurposeGroups.push(...response.content);
          if (response.last) {
            this.processingPurposesService.addOtherElementToTheEndOfProcessingPurposeCategories(
              this.processingPurposeGroups
            );
            this.updateSelections();
          } else {
            this.getAllProcessingPurposes(page + 1);
          }
        }
      );
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

  ngOnDestroy(): void {
    this.onCancelChangesSubscriber();
    this.processingPurposeGroups = [];
  }

  canDeactivateTab(): Observable<boolean> {
    return this.save().pipe(map(() => true));
  }
}
