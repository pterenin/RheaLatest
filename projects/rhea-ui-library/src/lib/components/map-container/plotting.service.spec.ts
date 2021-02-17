import { TestBed } from '@angular/core/testing';

import { PlottingService } from './plotting.service';

describe('PlottingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlottingService = TestBed.get(PlottingService);
    expect(service).toBeTruthy();
  });
});
