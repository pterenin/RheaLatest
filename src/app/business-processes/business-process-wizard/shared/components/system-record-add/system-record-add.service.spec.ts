import { TestBed } from '@angular/core/testing';

import { SystemRecordAddService } from './system-record-add.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SystemRecordAddService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: SystemRecordAddService = TestBed.get(
      SystemRecordAddService
    );
    expect(service).toBeTruthy();
  });
});
