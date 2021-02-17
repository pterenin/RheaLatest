import { BehaviorSubject, Observable, throwError, UnaryFunction } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { pipeFromArray } from 'rxjs/internal/util/pipe';

/**
 * Broadcast the progress status of the specified observable using the specified multicast BehaviorSubject.
 * The BehaviorSubject will immediately send "true" to all subscribers.  When the observer produces either
 * data or an error, then the BehaviorSubject will send "false."
 *
 * @param observable The Observable to watch.
 * @param isInProgressSubject The subject that multicasts the status.
 */
export function multicastInProgressState<T>(
  observable: Observable<T>,
  isInProgressSubject: BehaviorSubject<boolean>
): Observable<T> {
  isInProgressSubject.next(true);

  return observable.pipe(
    tap(() => isInProgressSubject.next(false)),
    catchError(error => {
      isInProgressSubject.next(false);
      return throwError(error);
    })
  );
}

/**
 * Converts an array of UnaryFunctions unto one UnaryFunction.  The rxjs pipeFromArray function is internal,
 * so this utility serves as a place to minimize the impact if rxjs makes this private, or if we want to
 * write our own implementation of this feature.
 *
 * @param fns the array to convert.
 */
export function createPipeFromArray<T, R>(
  fns: Array<UnaryFunction<T, R>>
): UnaryFunction<T, R> {
  return pipeFromArray(fns);
}
