export interface DropdownCategoryItem {
  selected: boolean;
  value: number;
  text: string;
}

export interface DropdownCategoryGroup {
  group: string;
  items: DropdownCategoryItem[];
}
