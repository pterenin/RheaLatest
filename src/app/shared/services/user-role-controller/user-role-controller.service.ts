import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserRoleControllerService {
  private noAppAccess: boolean;

  public get getNoAppAccess(): boolean {
    return this.noAppAccess;
  }

  public set setNoAppAccess(value: boolean) {
    this.noAppAccess = value;
  }

  constructor(private httpClient: HttpClient) {}

  public getCurrentUserAuthoritiesInMemory(): Observable<string[]> {
    return this.httpClient
      .get(`/api/hub/user-roles/current-authorities`)
      .pipe(map(this.mapUserAuthorities), catchError(this.handleError));
  }

  private mapUserAuthorities(response: string[]): string[] {
    return response;
  }

  public handleError(error: Response | any) {
    return throwError(error);
  }
}
