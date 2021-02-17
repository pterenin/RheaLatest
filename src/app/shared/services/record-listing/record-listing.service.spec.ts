import { TestBed } from '@angular/core/testing';

import { RecordListingService } from './record-listing.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaToastModule, ToastService } from '@trustarc/ui-toolkit';
import { RouterTestingModule } from '@angular/router/testing';

describe('RecordListingService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, TaToastModule],
      providers: [ToastService]
    })
  );

  it('should be created', () => {
    const service: RecordListingService = TestBed.get(RecordListingService);
    expect(service).toBeTruthy();
  });
});
