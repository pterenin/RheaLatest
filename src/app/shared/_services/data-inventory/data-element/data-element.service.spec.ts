import { TestBed } from '@angular/core/testing';

import { DataElementService } from './data-element.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('DataElementService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: DataElementService = TestBed.get(DataElementService);
    expect(service).toBeTruthy();
  });
});
