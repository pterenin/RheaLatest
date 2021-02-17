import { Item, ItemInterface } from './item-model';

export interface BaseCategoryInterface<T> {
  id: string;
  label: string;
  items: T[];
}

export interface CategoryInterface {
  label: string;
  items: Array<ItemInterface>;
  hidden: boolean;
  isCustom: boolean;
  showAllItems: Function;
  id: string;
}

export interface Selection {
  id: string;
  label: string;
  items: SelectedItem[];
}

export interface SelectedItem {
  id: string;
  label: string;
}

export class Category implements CategoryInterface {
  label: string;
  items: Array<ItemInterface> = [];
  id: string;
  hidden: boolean;
  isCustom: boolean;
  constructor(
    label: string,
    items: Array<{
      label: string;
      id: string;
      selected: boolean;
      nodeId?: string;
      subItem?: string;
      tag?: string;
      location?: string;
      senderId?: string;
      receiverId?: string;
      unReselectable?: boolean;
      isCustom?: boolean;
      locationIds?: string[];
      locations?: string[];
      entityId?: string;
      isItSystem?: boolean;
      isDsOrDr?: boolean;
    }>,
    id: string,
    isCustom?: boolean
  ) {
    this.label = label;
    this.items = items.map(
      (item, index) =>
        new Item(
          item.label,
          item.id || 'item_' + index,
          item.selected || false,
          item.subItem,
          item.tag,
          item.location,
          item.senderId,
          item.receiverId,
          item.unReselectable,
          item.isCustom,
          item.locationIds,
          item.locations,
          item.entityId,
          item.isItSystem,
          item.isDsOrDr,
          item.nodeId
        )
    );
    this.id = id;
    this.hidden = false;
    this.isCustom = isCustom;
  }

  getSelectedItemCount(): number {
    const selectedItems = this.items.filter(item => item.selected);
    return selectedItems.length;
  }

  public isIndeterminate(): boolean {
    return !this.isAllSelected() && this.getSelectedItemCount() > 0;
  }

  isAllSelected(): boolean {
    const selectedCount = this.getSelectedItemCount();
    return this.items.length > 0 && selectedCount === this.items.length;
  }

  showAllItems(): void {
    this.hidden = false;
    this.items.forEach(item => {
      item.hidden = false;
    });
  }
}
