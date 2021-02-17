import { TaTableRequest } from '@trustarc/ui-toolkit';
import { FilterNonLeafNode } from './filter-model';

export type SortDirection = 'ASC' | 'DESC';

export interface SortOrder {
  property: string;
  direction: SortDirection;
}

export interface SearchResponseInterface<T> {
  content: T[];
  size: number; // Requested number of records
  numberOfElements: number; // Actual number of records returned
  first: boolean; // Whether returned page is the first
  last: boolean; // Whether returned page is the last
  number: number; // The actual page number returned
  sort: SortOrder[]; // How the records are sorted
  totalElements: number; // How many records total match requested search
  totalPages: number; // How many pages total are needed, given size
}

export interface SearchRequest {
  searchTerm?: string;
  page: number;
  size: number;
  sort: string;
}

export interface FilterRequest extends TaTableRequest {
  size?: number;
  sortField?: string;
  sortDirection?: string;
  filters?: FilterNonLeafNode;
}
