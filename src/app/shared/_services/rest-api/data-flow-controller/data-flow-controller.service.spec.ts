import { TestBed } from '@angular/core/testing';

import { DataFlowControllerService } from './data-flow-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DataFlowControllerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: DataFlowControllerService = TestBed.get(
      DataFlowControllerService
    );
    expect(service).toBeTruthy();
  });
});
