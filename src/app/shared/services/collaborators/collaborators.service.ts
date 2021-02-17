import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseDomainInterface } from '../../models/base-domain-model';
import { Observable, throwError } from 'rxjs';
import { UserService } from '../user/user.service';
import { isIdParameterInvalid } from 'src/app/shared/utils/basic-utils';

export interface AddCollaboratorsRequest {
  message: string;
  userIds: string[];
}

export interface AddCollaboratorsResponse extends BaseDomainInterface {
  userIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CollaboratorsService implements OnDestroy {
  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {}

  public ngOnDestroy() {}

  public add(
    id: string,
    collaborators: AddCollaboratorsRequest
  ): Observable<AddCollaboratorsResponse> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    return this.httpClient.post<AddCollaboratorsResponse>(
      `/api/hub/base-records/${id}/collaborators`,
      collaborators
    );
  }

  public getAAAUserInfo(searchTerm: string, page?: number) {
    return this.userService.getUsersSearch(searchTerm, page);
  }
}
