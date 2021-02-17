import {
  DataElementItemResponseRawInterface,
  DataElementListResponseRawInterface
} from '../_interfaces/data-inventory/data-element/data-element.interface';

export class DataElementListClass {
  items: DataElementItemResponseRawInterface[];
  totalPages: number;
  totalElements: number;
  pageable: {
    pageSize: number;
    pageNumber: number;
  };

  constructor(data: DataElementListResponseRawInterface) {
    this.items = data.content || [];
    this.totalPages = data.totalPages || 0;
    this.totalElements = data.totalElements || 0;
    this.pageable = {
      pageSize: data.pageable.pageSize,
      pageNumber: data.pageable.pageNumber
    };
  }
}
