import { TestBed } from '@angular/core/testing';

import { ItSystemDataElementsService } from './it-system-data-elements.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ItSystemDataElementsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ItSystemDataElementsService = TestBed.get(
      ItSystemDataElementsService
    );
    expect(service).toBeTruthy();
  });
});
