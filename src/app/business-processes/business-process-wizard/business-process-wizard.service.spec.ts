import { TestBed } from '@angular/core/testing';

import { BusinessProcessWizardService } from './business-process-wizard.service';

describe('BusinessProcessWizardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BusinessProcessWizardService = TestBed.get(
      BusinessProcessWizardService
    );
    expect(service).toBeTruthy();
  });
});
