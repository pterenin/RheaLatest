import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DatagridPaginationUpdatesInterface {
  displayedNumberOfRows: number;
  currentPage: number;
  collectionSize: number;
}
@Injectable({
  providedIn: 'root'
})
export class DatagridPaginationService {
  private defaultValues: DatagridPaginationUpdatesInterface = {
    displayedNumberOfRows: 25,
    currentPage: 1,
    collectionSize: 0
  };

  public datagridPaginationState: DatagridPaginationUpdatesInterface = this
    .defaultValues;

  private _datagridPaginationUpdated$ = new BehaviorSubject(
    this.datagridPaginationState
  );

  public _datagridPaginationUpdatedObservale$ = this._datagridPaginationUpdated$.asObservable();

  public constructor() {}

  public updateDisplayedNumberOfRows(rows: number) {
    this.datagridPaginationState.displayedNumberOfRows = rows;
    this._datagridPaginationUpdated$.next(this.datagridPaginationState);
  }

  public updateCurrentPage(page: number) {
    this.datagridPaginationState.currentPage = page;
    this._datagridPaginationUpdated$.next(this.datagridPaginationState);
  }

  public updateCollectionSize(totalElements: number) {
    this.datagridPaginationState.collectionSize = totalElements;
    this._datagridPaginationUpdated$.next(this.datagridPaginationState);
  }
}
