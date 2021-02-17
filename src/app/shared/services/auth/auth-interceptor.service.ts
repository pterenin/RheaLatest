import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler) {
    const authToken = this.authService.getToken;
    const authRequest = httpRequest.clone({
      headers: httpRequest.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return httpHandler.handle(authRequest);
  }
}
