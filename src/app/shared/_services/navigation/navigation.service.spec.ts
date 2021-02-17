import { TestBed } from '@angular/core/testing';

import { NavigationService } from './navigation.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('NavigationService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [AuthService, TranslateService]
    })
  );

  it('should be created', () => {
    const service: NavigationService = TestBed.get(NavigationService);
    expect(service).toBeTruthy();
  });
});
