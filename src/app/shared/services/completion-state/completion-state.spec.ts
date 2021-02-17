import { TestBed } from '@angular/core/testing';

import { CompletionStateService } from './completion-state.service';

describe('CompletionStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompletionStateService = TestBed.get(CompletionStateService);
    expect(service).toBeTruthy();
  });
});
