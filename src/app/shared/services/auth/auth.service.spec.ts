import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { TranslateModule } from '@ngx-translate/core';

describe('AuthService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()]
    })
  );

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
