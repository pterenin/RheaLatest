import { TestBed } from '@angular/core/testing';

import { NavigationEventService } from './navigation-event.service';

describe('NavigationEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavigationEventService = TestBed.get(NavigationEventService);
    expect(service).toBeTruthy();
  });
});
