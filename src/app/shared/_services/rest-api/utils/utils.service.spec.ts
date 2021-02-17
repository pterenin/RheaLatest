import { TestBed } from '@angular/core/testing';

import { HttpUtilsService } from './utils.service';

describe('HttpUtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpUtilsService = TestBed.get(HttpUtilsService);
    expect(service).toBeTruthy();
  });
});
