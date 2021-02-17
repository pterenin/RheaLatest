import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Params } from '@angular/router';

/**
 * Gets all updates to the url params.
 * @param params the route parameters
 * @param paramName the name fo the parameter.
 */
export function getRouteParamObservable(
  paramsObservable: Observable<Params>,
  paramName: string
): Observable<string> {
  return paramsObservable.pipe(
    switchMap((params: Params) => {
      return of(params.get(paramName));
    })
  );
}
