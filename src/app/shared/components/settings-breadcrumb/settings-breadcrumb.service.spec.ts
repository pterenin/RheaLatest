import { TestBed } from '@angular/core/testing';

import { SettingsBreadcrumbService } from './settings-breadcrumb.service';

describe('SettingsBreadcrumbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsBreadcrumbService = TestBed.get(
      SettingsBreadcrumbService
    );
    expect(service).toBeTruthy();
  });
});
