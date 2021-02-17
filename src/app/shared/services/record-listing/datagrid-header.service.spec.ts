import { TestBed } from '@angular/core/testing';

import { DatagridHeaderService } from './datagrid-header.service';
import { DatagridService } from '@trustarc/ui-toolkit';

describe('RecordDatagridHeaderService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [DatagridService]
    })
  );

  it('should be created', () => {
    const service: DatagridHeaderService = TestBed.get(DatagridHeaderService);
    expect(service).toBeTruthy();
  });
});
