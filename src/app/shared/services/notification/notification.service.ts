import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notification = new BehaviorSubject<any>({});

  emit(data: any) {
    this.notification.next(data);
  }

  getData(): Observable<any> {
    return this.notification.asObservable();
  }
}
