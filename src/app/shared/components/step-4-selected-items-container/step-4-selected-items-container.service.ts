import { Injectable } from '@angular/core';
import { Item } from '../categorical-view/item-model';

@Injectable()
export class Step4SelectedItemsContainerService {
  private selectedDataItems: any[] = [];

  constructor() {}

  public addSelectedDataItem(data: any) {
    this.selectedDataItems.push(data);
  }

  public setSelectedDataItems(data: any[]) {
    this.selectedDataItems = data;
  }

  public getSelectedDataItems(): any[] {
    return this.selectedDataItems || [];
  }

  public clearAllSelectedDataItems() {
    this.setSelectedDataItems([]);
  }

  public removeItemById(removedItemId: string) {
    const items = this.selectedDataItems.filter(
      item => item.id !== removedItemId
    );
    this.setSelectedDataItems(items);
  }

  /**
   * Remove a particular item identified by nodeId from selected items container.
   * @param itemNodeId The NodeID of the particular item to be removed
   */
  public removeItemByNodeId(itemNodeId: string): void {
    const items = this.selectedDataItems.filter(
      (item: Item) => item.nodeId !== itemNodeId
    );

    this.setSelectedDataItems(items);
  }
}
