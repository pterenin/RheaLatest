import { TestBed } from '@angular/core/testing';

import { ReportDownloadService } from './report-download.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReportDownloadService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ReportDownloadService = TestBed.get(ReportDownloadService);
    expect(service).toBeTruthy();
  });
});
