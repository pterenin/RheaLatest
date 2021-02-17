import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DatagridService, TaModal, ToastService } from '@trustarc/ui-toolkit';
import { Subscription } from 'rxjs';
import { ConfirmDeleteContentComponent } from '../../confirm-delete-content/confirm-delete-content.component';
import { DatagridHeaderService } from 'src/app/shared/services/record-listing/datagrid-header.service';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { RecordListingService } from 'src/app/shared/services/record-listing/record-listing.service';

@AutoUnsubscribe(['_disableDelete$'])
@Component({
  selector: 'ta-datagrid-delete-button',
  templateUrl: './datagrid-delete-button.component.html',
  styleUrls: ['./datagrid-delete-button.component.scss']
})
export class DatagridDeleteButtonComponent implements OnInit, OnDestroy {
  @Input() public gridId: string;

  public disabled = true;
  public pageSelectedItems: any[];

  private _disableDelete$: Subscription;

  constructor(
    private modalService: TaModal,
    private datagridHeaderService: DatagridHeaderService,
    private recordListingService: RecordListingService,
    private datagridService: DatagridService,
    private toastService: ToastService
  ) {}

  public ngOnInit() {
    this._disableDelete$ = this.datagridHeaderService
      .viewSelectedPageItems(this.gridId)
      .subscribe((items: any[]) => {
        this.pageSelectedItems = items;
        this.disabled = !(items && items.length > 0);
      });
  }

  public ngOnDestroy() {}

  public open() {
    this.datagridHeaderService.setCurrentGridId(this.gridId);

    this.modalService
      .open(ConfirmDeleteContentComponent, { windowClass: 'modal-white' })
      .result.then(success => {
        this.datagridService.clearAllSelected(this.gridId);
      })
      .catch(closed => {
        /* Do Nothing */
      });
  }
}
