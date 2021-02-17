import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatagridHeaderService } from 'src/app/shared/services/record-listing/datagrid-header.service';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator';
import { Router } from '@angular/router';

@AutoUnsubscribe(['_disableButton$'])
@Component({
  selector: 'ta-datagrid-edit-button',
  templateUrl: './datagrid-edit-button.component.html',
  styleUrls: ['./datagrid-edit-button.component.scss']
})
export class DatagridEditButtonComponent implements OnInit, OnDestroy {
  @Input() public gridId: string;

  public disabled = true;
  public pageSelectedItems: any[];

  private _disableButton$: Subscription;

  constructor(
    private datagridHeaderService: DatagridHeaderService,
    private router: Router
  ) {}

  public ngOnInit() {
    this._disableButton$ = this.datagridHeaderService
      .viewSelectedPageItems(this.gridId)
      .subscribe((items: any[]) => {
        this.pageSelectedItems = items;
        this.disabled = !(items && items.length === 1);
      });
  }

  public ngOnDestroy() {}

  public open() {
    if (this.pageSelectedItems && this.pageSelectedItems.length === 1) {
      const selectedId = this.pageSelectedItems[0].id;
      this.router.navigate([`/business-process/${selectedId}`]);
    } else {
      console.warn('Only one item can be opened for editing at a time.');
    }
  }
}
