import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingEventService {
  private loaded = new BehaviorSubject<any>({});

  emitLoaded(loaded: any) {
    this.loaded.next(loaded);
  }

  getData(): Observable<any> {
    return this.loaded.asObservable();
  }
}
