import { TestBed } from '@angular/core/testing';

import { DataFlowService } from './data-flow.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('DataFlowService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: DataFlowService = TestBed.get(DataFlowService);
    expect(service).toBeTruthy();
  });
});
