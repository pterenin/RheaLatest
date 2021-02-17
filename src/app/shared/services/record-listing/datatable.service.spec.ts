import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatatableService } from './datatable.service';
import { FeatureFlagControllerService } from 'src/app/shared/_services/rest-api';
import { TableService } from '@trustarc/ui-toolkit';

describe('RecordDatagridHeaderService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TableService, FeatureFlagControllerService]
    })
  );

  it('should be created', () => {
    const service: DatatableService = TestBed.get(DatatableService);
    expect(service).toBeTruthy();
  });
});
