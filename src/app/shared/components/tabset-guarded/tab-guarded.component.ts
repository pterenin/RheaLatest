import {
  AfterContentChecked,
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList
} from '@angular/core';
import { TaTabContent } from '@trustarc/ui-toolkit';
import { Observable, of } from 'rxjs';
import {
  CanDeactivateTabInterface,
  DeactivationType
} from './can-deactivate-tab.model';

@Component({
  selector: 'ta-tab-guarded',
  template: '<div>Loading...</div>'
})
export class TabGuardedComponent implements OnInit, AfterContentChecked {
  @Input() title: string;
  @Input() disabled = false;

  @ContentChildren(TaTabContent, { descendants: false })
  tabContents: QueryList<TaTabContent>;

  @ContentChildren('canDeactivateTab')
  canDeactivateTabComponents: QueryList<CanDeactivateTabInterface>;

  tabContent: TaTabContent;
  canDeactivateTabComponent: CanDeactivateTabInterface;

  constructor() {}

  public canDeactivateTab(
    deactivationType: DeactivationType
  ): Observable<boolean> {
    if (
      this.canDeactivateTabComponent &&
      this.canDeactivateTabComponent.canDeactivateTab
    ) {
      return this.canDeactivateTabComponent.canDeactivateTab(deactivationType);
    } else {
      return of(true);
    }
  }

  ngOnInit() {}
  ngAfterContentChecked() {
    this.tabContent = this.tabContents.first;
    this.canDeactivateTabComponent = this.canDeactivateTabComponents.first;
  }
}
