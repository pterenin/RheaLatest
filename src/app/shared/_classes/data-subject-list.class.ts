import { DataSubjectListResponseRawInterface } from '../_interfaces/data-inventory/data-subject/data-subject.interface';

export class DataSubjectListClass {
  items: DataSubjectListResponseRawInterface;
  totalPages: number;
  totalElements: number;
  pageable: {
    pageSize: number;
    pageNumber: number;
  };

  constructor(data: DataSubjectListResponseRawInterface) {
    this.items = data;
    this.totalPages = 0;
    this.totalElements = data.length;
    this.pageable = {
      pageSize: data.length,
      pageNumber: 0
    };
  }
}
