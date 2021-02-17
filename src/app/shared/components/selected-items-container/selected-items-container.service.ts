import { Injectable } from '@angular/core';
import { Item } from '../categorical-view/item-model';

@Injectable()
export class SelectedItemsContainerService {
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
   * Remove an particular item identified through (item, location) pair from the selected items container.
   * Returns true if the removed (item, location) pair was the last of the pairs with that particular item ID.
   *
   * @param itemId The ID of the particular item to be removed
   * @param itemLocation The Location of the particular item to be removed
   */

  public removeItemByNodeId(selectedItem: Item) {
    const items = this.selectedDataItems.filter(
      (item: Item) => item.nodeId !== selectedItem.nodeId
    );
    this.setSelectedDataItems(items);
  }

  public removeGroupedItems(bpId: string, nodeId: string) {
    const items = this.selectedDataItems.filter(
      item => !(item.businessProcessId === bpId && item.nodeId === nodeId)
    );
    this.setSelectedDataItems(items);
  }
}
