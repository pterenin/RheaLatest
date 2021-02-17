import { TestBed } from '@angular/core/testing';

import { BaseRecordsControllerService } from './base-records-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminControllerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: BaseRecordsControllerService = TestBed.get(
      BaseRecordsControllerService
    );
    expect(service).toBeTruthy();
  });
});
