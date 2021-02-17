import {
  ProcessingPurposeItemResponseRawInterface,
  ProcessingPurposeListResponseRawInterface
} from '../_interfaces/data-inventory/processing-purpose/processing-purpose.interface';

export class ProcessingPurposeListClass {
  items: ProcessingPurposeItemResponseRawInterface[];
  totalPages: number;
  totalElements: number;
  pageable: {
    pageSize: number;
    pageNumber: number;
  };

  constructor(data: ProcessingPurposeListResponseRawInterface) {
    this.items = data.content || [];
    this.totalPages = data.totalPages || 0;
    this.totalElements = data.totalElements || 0;
    this.pageable = {
      pageSize: data.pageable.pageSize,
      pageNumber: data.pageable.pageNumber
    };
  }
}
