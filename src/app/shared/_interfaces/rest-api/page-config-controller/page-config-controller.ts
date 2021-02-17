export interface ColumnConfigControllerInterface {
  columnConfig: ColumnConfigInterface[];
}

export interface ColumnConfigInterface {
  columnAlias: string;
  columnName: string;
  columnOrder: number;
  selectable: boolean;
  selected: boolean;
}
