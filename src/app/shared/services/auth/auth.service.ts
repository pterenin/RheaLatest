import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public static readonly DEFAULT_LANGUAGE: string = 'en';

  constructor(private translateService: TranslateService) {}

  private token: string;
  private locale: string;
  private timezone: string;
  private seleneClientUrl: string;

  // Token Properties
  private decodeToken() {
    if (!this.token) {
      return null;
    }

    const base64Url = this.token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  /*
   * Get Token Value
   */
  get getToken(): string {
    return this.token;
  }

  /*
   * Set SeleneClientUrl Value
   * @param { url } string
   */
  set setSeleneClientUrl(url: string) {
    this.seleneClientUrl = url;
  }

  /*
   * Get SeleneClientUrl Value
   */
  get getSeleneClientUrl(): string {
    return this.seleneClientUrl;
  }

  /*
   * Set Token Value
   * @param { token } string
   */
  set setToken(token: string) {
    this.token = token;
  }

  /**
   * Get Admin Value
   */
  public isAdmin(): boolean {
    const decodedToken = this.decodeToken();

    return (
      decodedToken &&
      (decodedToken.authorities.includes('rhea_admin') ||
        decodedToken.authorities.includes('rhea_internal_admin'))
    );
  }

  public isInternalAdmin(): boolean {
    const decodedToken = this.decodeToken();

    return (
      decodedToken && decodedToken.authorities.includes('rhea_internal_admin')
    );
  }
  // Timezone Properties

  /**
   * Get Timezone Value
   */
  public get getTimezone(): string {
    return this.timezone;
  }

  /**
   * Set Timezone Value
   */
  public set setTimezone(timezone: string) {
    this.timezone = timezone;
  }

  // Locale

  /**
   * Get Locale Value
   */
  public get getLocale(): string {
    return this.locale;
  }

  /**
   * Set Locale Value
   */
  public set setLocale(locale: string) {
    this.locale = locale;

    const lang = locale ? locale.split('-')[0] : AuthService.DEFAULT_LANGUAGE;

    this.translateService.setDefaultLang(AuthService.DEFAULT_LANGUAGE);
    this.translateService.use(lang);
  }
}
