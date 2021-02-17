import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpUtilsService {
  constructor() {}

  public handleError(error: Response | any) {
    return throwError(error);
  }
}
