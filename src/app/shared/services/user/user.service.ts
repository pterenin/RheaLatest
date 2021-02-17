import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user-model';
import { defaultTo } from '../../utils/basic-utils';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get the first 100 users for the current account.  If a search term is specified,
   * the search is filtered by that term.
   */
  public getUsersSearch(searchTerm: string, page?: number): Observable<User[]> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('page', defaultTo('0', page + ''));
    params = params.append('size', '100');

    let url = `/api/hub/users`;

    if (searchTerm && searchTerm.trim().length > 0) {
      searchTerm = searchTerm.substring(0, 255).trim();
      url = `/api/hub/users/search`;
      params = params.append('searchTerm', searchTerm);
    }

    return this.httpClient
      .get<any>(url, { params })
      .pipe(map(usersResponse => usersResponse.content));
  }

  public getUsersResponse(searchTerm: string, page?: number, size = 100) {
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('page', defaultTo('0', page + ''));
    params = params.append('size', size + '');

    let url = `/api/hub/users`;

    if (searchTerm && searchTerm.trim().length > 0) {
      searchTerm = searchTerm.substring(0, 255).trim();
      url = `/api/hub/users/search`;
      params = params.append('searchTerm', searchTerm);
    }
    return this.httpClient.get<any>(url, { params });
  }
}
