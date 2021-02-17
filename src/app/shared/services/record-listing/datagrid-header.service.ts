import { Injectable } from '@angular/core';

import {
  BehaviorSubject,
  ConnectableObservable,
  Observable,
  of,
  Subject
} from 'rxjs';

import { DatagridService, TaDatagridRequest } from '@trustarc/ui-toolkit';
import { filter, map, publishBehavior } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatagridHeaderService {
  private pageSelectSources: Map<string, ConnectableObservable<any[]>>;

  private deleteIndividualBpSubject: BehaviorSubject<any>;
  private requestEvent = new Subject<any>();

  // Used to set the "current grid" for when the Grid ID cannot be passed normally
  private currentGridId: string;

  constructor(private datagridService: DatagridService) {
    this.pageSelectSources = new Map<string, ConnectableObservable<any[]>>();
    this.deleteIndividualBpSubject = new BehaviorSubject(null);
  }

  public initGridSources(gridId: string) {
    if (!this.pageSelectSources.has(gridId)) {
      const source = this.datagridService
        .listenPageSelectedItemsEvents(gridId)
        .pipe(publishBehavior([])) as ConnectableObservable<any[]>;

      this.pageSelectSources.set(gridId, source);
      this.pageSelectSources.get(gridId).connect();
    }
    return of([]);
  }

  public emitSearchRequest(gridID: string, request: any) {
    this.requestEvent.next({
      taGridID: gridID,
      request: request
    });
  }

  public listenToRequestEvents(gridID: string): Observable<TaDatagridRequest> {
    return this.requestEvent.pipe(
      filter((x: any) => {
        return x.taGridID === gridID;
      }),
      map((x: any) => x.request)
    );
  }

  public clearGridSources(gridId: string) {
    this.pageSelectSources.delete(gridId);
  }

  public viewSelectedPageItems(gridId: string): ConnectableObservable<any[]> {
    return this.pageSelectSources.get(gridId);
  }

  public setCurrentGridId(gridId: string) {
    this.currentGridId = gridId;
  }

  public getCurrentSelectedPageItems() {
    return this.pageSelectSources.get(this.currentGridId);
  }

  public getDeleteIndividualBpSubject(): BehaviorSubject<any> {
    return this.deleteIndividualBpSubject;
  }

  public deleteIndividualBp(record: any) {
    this.deleteIndividualBpSubject.next(record);
  }
}
