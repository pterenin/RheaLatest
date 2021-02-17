import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompletionStateService {
  public isAwaitingCompletion: BehaviorSubject<boolean>;

  constructor() {
    this.isAwaitingCompletion = new BehaviorSubject<boolean>(false);
  }

  public watchCompletionState<T>(
    targetObservable: Observable<T>
  ): Observable<T> {
    this.isAwaitingCompletion.next(true);
    return targetObservable.pipe(
      tap(
        () => {},
        () => {},
        () => this.isAwaitingCompletion.next(false)
      )
    );
  }
}
