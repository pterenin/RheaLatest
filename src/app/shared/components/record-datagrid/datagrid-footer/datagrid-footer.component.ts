import {
  AfterContentChecked,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  DatagridPaginationService,
  DatagridPaginationUpdatesInterface
} from 'src/app/shared/services/record-datagrid-pagination/datagrid-pagination.service';

@Component({
  selector: 'ta-datagrid-footer',
  templateUrl: './datagrid-footer.component.html',
  styleUrls: ['./datagrid-footer.component.scss']
})
export class DatagridFooterComponent
  implements OnInit, OnDestroy, AfterContentChecked {
  public collectionSize = 0; // total-rows received from server
  public page = 1; // current page
  public oldPageValue = 1; // used to check for updates to the page
  public pageSize = 25; // how many rows are displayed at a time

  private paginationInterface: DatagridPaginationUpdatesInterface;

  public constructor(
    private datagridPaginationService: DatagridPaginationService
  ) {}

  public ngOnInit(): void {
    this.datagridPaginationService._datagridPaginationUpdatedObservale$.subscribe(
      paginationUpdates => {
        this.page = paginationUpdates.currentPage;
        this.pageSize = paginationUpdates.displayedNumberOfRows;
        this.collectionSize = paginationUpdates.collectionSize;
      }
    );
  }

  public onChangePageSize(pageSize: number): void {
    this.datagridPaginationService.updateDisplayedNumberOfRows(pageSize);
  }

  public ngAfterContentChecked() {
    this.updatePageIfChanged();
  }

  private updatePageIfChanged() {
    if (this.page !== this.oldPageValue) {
      this.datagridPaginationService.updateCurrentPage(this.page);
      this.oldPageValue = this.page;
    }
  }

  public ngOnDestroy(): void {}
}
