import {
  SearchRequest,
  SearchResponseInterface
} from '../../models/search.model';

import { Observable } from 'rxjs';

export type CategoryID = string;
export type ItemID = string;

export interface ScrollMetadata {
  // size: number; // Requested number of records
  // numberOfElements: number; // Actual number of records returned
  prevScrollIndex: number;
  totalElements: number; // How many records total match requested search
  currentPage: number;
  isFullyLoaded: boolean;
  isLoading: boolean;

  /*
  first: boolean; // Whether returned page is the first
  last: boolean; // Whether returned page is the last
  number: number; // The actual page number returned
  sort: SortOrder[]; // How the records are sorted
  totalPages: number; // How many pages total are needed, given size
  */
}

export interface CategoryItemInterface {
  id: ItemID;
  name: string;
  type: string;
  categoryId: CategoryID;
}

export interface CategoryInterface<T> {
  id: CategoryID;
  name: string;
  items: (CategoryItemInterface & T)[];
  metadata: ScrollMetadata;
}

export interface CategoryLoaderInterface {
  categoryId: CategoryID;
  requestFunction: RequestFunction<any>;
  sort: string;
}

export type RequestFunction<T> = (
  searchRequest: SearchRequest
) => Observable<SearchResponseInterface<T>>;

export type GenericItem<T> = CategoryItemInterface & T;
