import { TestBed } from '@angular/core/testing';

import { LoadingEventService } from './loading-event.service';

describe('LoadingEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadingEventService = TestBed.get(LoadingEventService);
    expect(service).toBeTruthy();
  });
});
