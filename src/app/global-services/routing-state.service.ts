import { Injectable } from '@angular/core';

export interface HistoryReplayable {
  url: string;
  data?: any;
}

export type DataHistoryTypes = 'addedProcessingPurposes' | 'addedDataElements';

@Injectable({
  providedIn: 'root'
})
export class RoutingStateService {
  private _history: HistoryReplayable[] = [];

  constructor() {}

  public pushHistory(history: string, data?: any) {
    this._history.push({ url: history, data: data });
  }

  public addDataToLatestHistory(dataKey: string, newData: any) {
    if (!this._history || this._history.length === 0) {
      throw new Error(
        'Cannot add data to history that does not exist. A check should occur to prevent this code from executing in illegal contexts.'
      );
    }
    // Append new data to existing data if existing data exists.
    this._history[this._history.length - 1].data[dataKey] = newData;
  }

  public getLatestReplayableHistory() {
    if (!this._history || this._history.length === 0) {
      return null;
    }
    return this._history[this._history.length - 1];
  }

  public removeLatestHistoryData(dataKeys) {
    if (this._history && this._history.length > 0) {
      dataKeys.map(key => {
        if (this.getLatestReplayableHistory().data[key]) {
          delete this.getLatestReplayableHistory().data[key];
        }
      });
    }
  }

  /**
   * Pops history - Always pop the history as soon as it makes sense to do so, so that we don't keep track of stale history.
   * @returns the last history element in the history array (just like a stack would pop an element, LIFO)
   */
  public popHistory() {
    const latestHistory = this._history.pop();
    return latestHistory ? latestHistory : null;
  }

  public getDataHistoryOnReconstruct(key: DataHistoryTypes): [] {
    const latestHistory = this.getLatestReplayableHistory();
    if (latestHistory && latestHistory.data && latestHistory.data[key]) {
      return latestHistory.data[key];
    }

    return [];
  }
}
