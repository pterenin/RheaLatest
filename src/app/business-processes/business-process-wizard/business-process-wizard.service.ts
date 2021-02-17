import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessProcessWizardService {
  public getBpName: BehaviorSubject<string>;

  constructor() {
    this.getBpName = new BehaviorSubject('Untitled');
  }
}
