import { TestBed } from '@angular/core/testing';

import { DatagridPaginationService } from './datagrid-pagination.service';

describe('RecordDatagridHeaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatagridPaginationService = TestBed.get(
      DatagridPaginationService
    );
    expect(service).toBeTruthy();
  });

  it('should initialize with default values of datagridPaginationState', () => {
    const service: DatagridPaginationService = TestBed.get(
      DatagridPaginationService
    );
    expect(service.datagridPaginationState).toEqual({
      displayedNumberOfRows: 25,
      currentPage: 1,
      collectionSize: 0
    });
  });

  it('should update displayNumberOfRows on calls to updateDisplayedNumberOfRows()', () => {
    const service: DatagridPaginationService = TestBed.get(
      DatagridPaginationService
    );
    service.updateDisplayedNumberOfRows(42);
    expect(service.datagridPaginationState).toEqual({
      displayedNumberOfRows: 42,
      currentPage: 1,
      collectionSize: 0
    });
  });

  it('should update currentPage on calls to updateCurrentPage()', () => {
    const service: DatagridPaginationService = TestBed.get(
      DatagridPaginationService
    );
    service.updateCurrentPage(42);
    expect(service.datagridPaginationState).toEqual({
      displayedNumberOfRows: 25,
      currentPage: 42,
      collectionSize: 0
    });
  });

  it('should update collectionSize on calls to updateCollectionSize()', () => {
    const service: DatagridPaginationService = TestBed.get(
      DatagridPaginationService
    );
    service.updateCollectionSize(42);
    expect(service.datagridPaginationState).toEqual({
      displayedNumberOfRows: 25,
      currentPage: 1,
      collectionSize: 42
    });
  });
});
