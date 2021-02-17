import { TestBed } from '@angular/core/testing';

import { AuthInterceptorService } from './auth-interceptor.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

describe('AuthInterceptorService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot()]
    })
  );

  it('should be created', () => {
    const service: AuthInterceptorService = TestBed.get(AuthInterceptorService);
    expect(service).toBeTruthy();
  });
});
