import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, ConnectableObservable, Subscription } from 'rxjs';

import { TableService } from '@trustarc/ui-toolkit';
import { publishBehavior } from 'rxjs/operators';

import { FeatureFlagControllerService } from 'src/app/shared/_services/rest-api';
import { FeatureFlagAllInterface } from 'src/app/shared/_interfaces';
import { UtilsClass } from 'src/app/shared/_classes';

declare const _: any;

@Injectable({
  providedIn: 'root'
})
export class DatatableService implements OnDestroy {
  private identifier = _.uniqueId('Datatable - ');
  private pageSelectSources: Map<string, ConnectableObservable<any[]>>;
  private riskEnabledStatus = new BehaviorSubject<boolean | null>(null);
  public riskEnabled$ = this.riskEnabledStatus.asObservable();
  private _allFeatureFlag$: Subscription;

  private riskServiceStatus = new BehaviorSubject<any>(null);
  public riskService$ = this.riskServiceStatus.asObservable();

  private config = {
    columns: null
  };

  private currentColumnItem: number;

  // Used to set the "current grid" for when the Grid ID cannot be passed normally
  private currentGridId: string;

  constructor(
    private tableService: TableService,
    private featureFlagControllerService: FeatureFlagControllerService
  ) {
    this.pageSelectSources = new Map<string, ConnectableObservable<any[]>>();
    this.updateFeaturesInfo();
    this.getRiskEnabled();
    this.getRiskService();
  }

  ngOnDestroy() {
    UtilsClass.unSubscribe(this._allFeatureFlag$);
  }

  updateFeaturesInfo() {
    this._allFeatureFlag$ = this.featureFlagControllerService
      .getAllFeatureFlags()
      .subscribe((featureFlagAll: FeatureFlagAllInterface) => {
        this.riskEnabledStatus.next(featureFlagAll.RISK_PROFILE_LICENSE);
        this.riskServiceStatus.next({
          riskProfile: featureFlagAll.RISK_PROFILE_LICENSE,
          riskService: featureFlagAll.RISK_SERVICE_V2,
          riskProfileThirdParty: featureFlagAll.RISK_PROFILE_THIRD_PARTY_LICENSE
        });
      });
  }

  private getRiskEnabled() {
    if (this.riskEnabledStatus.value === null) {
      this.updateFeaturesInfo();
    }
  }

  private getRiskService() {
    if (this.riskServiceStatus.value === null) {
      this.updateFeaturesInfo();
    }
  }

  public initGridSources(gridId: string) {
    if (!this.pageSelectSources.has(gridId)) {
      const source = this.tableService
        .listenPageSelectedItemsEvents(gridId)
        .pipe(publishBehavior([])) as ConnectableObservable<any[]>;

      this.pageSelectSources.set(gridId, source);
      this.pageSelectSources.get(gridId).connect();
    }
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

  public setTableConfigByType(
    type: 'columns-bp' | 'columns-inventory',
    config
  ) {
    this.config[type] = config;
  }

  public getTableConfigByType(type: 'columns-bp' | 'columns-inventory') {
    return this.config[type];
  }

  public set setTableCurrentColumn(columnItem: number) {
    this.currentColumnItem = columnItem;
  }

  public get getTableCurrentColumn() {
    return this.currentColumnItem || 0;
  }
}
