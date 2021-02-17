import { TestBed } from '@angular/core/testing';

import { ItSystemProcessingPurposesService } from './it-system-processing-purposes.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ItSystemProcessingPurposesService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ItSystemProcessingPurposesService = TestBed.get(
      ItSystemProcessingPurposesService
    );
    expect(service).toBeTruthy();
  });
});
