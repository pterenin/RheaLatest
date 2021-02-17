export interface DataItemInterface {
  id: string;
  label: string;
  selected?: boolean;
}

export interface DataElementsInterface {
  items: DataItemInterface[];
}
