import { TestBed } from '@angular/core/testing';

import { FlowchartUtilityService } from './flowchart-utility.service';

describe('FlowchartUtilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlowchartUtilityService = TestBed.get(
      FlowchartUtilityService
    );
    expect(service).toBeTruthy();
  });
});
