import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  QueryList,
  ViewChild
} from '@angular/core';
import { TaTab, TaTabChangeEvent, TaTabset } from '@trustarc/ui-toolkit';
import { TabGuardedComponent } from './tab-guarded.component';
import { Observable, of } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { exists } from '../../utils/basic-utils';
import { DeactivationType } from './can-deactivate-tab.model';

@Component({
  selector: 'ta-tabset-guarded',
  templateUrl: './tabset-guarded.component.html'
})
export class TabsetGuardedComponent implements AfterViewInit {
  public isCanDeactivateInProgress = false;

  @ViewChild(TaTabset) tabset: TaTabset;
  private hasOnTabChangeCanDeactivateRunOnce = false;
  @ContentChildren(TabGuardedComponent) tabs: QueryList<TabGuardedComponent>;

  public ngAfterViewInit() {
    this.ref.detectChanges();
  }

  public constructor(private ref: ChangeDetectorRef) {}

  public onTabChange(event: TaTabChangeEvent) {
    // NOTE: onTabChange is called twice:
    // * First, when the user clicks a tab, it calls the async call to deacivate, which may save the tab content.
    // * Second, when the async call is complete, it synchronously changes the tab by immediatly returning.
    if (this.hasOnTabChangeCanDeactivateRunOnce) {
      this.hasOnTabChangeCanDeactivateRunOnce = false;
      return;
    }
    const tabNext = this.getTabById(event.nextId);
    event.preventDefault();
    this.deactivateCurrentTab('tabChange')
      .pipe(
        tap(() => {
          this.hasOnTabChangeCanDeactivateRunOnce = true;
          tabNext.disabled = false; // Allow immediatle selection if this tab was disabled.
          if (this.tabset) {
            this.tabset.select(event.nextId);
          }
        })
      )
      .subscribe();
  }

  private deactivateCurrentTab(
    deactivationType: DeactivationType
  ): Observable<boolean> {
    if (this.tabset) {
      const activeId = this.tabset.activeId;
      const tabCurrentGuarded = this.getTabGuardedById(activeId);
      this.isCanDeactivateInProgress = true;
      return tabCurrentGuarded.canDeactivateTab(deactivationType).pipe(
        first(),
        tap(canDeactivateResult => {
          this.isCanDeactivateInProgress = false;
        })
      );
    } else {
      return of(true);
    }
  }

  public isTabDisabled(tab: TabGuardedComponent): boolean {
    return this.isCanDeactivateInProgress || tab.disabled;
  }

  private getTabById(id: string): TaTab {
    if (this.tabset) {
      return this.tabset.tabs.toArray().find(tab => tab.id === id);
    } else {
      return null;
    }
  }

  private getTabGuardedById(id: string): TabGuardedComponent {
    if (this.tabset && this.tabs) {
      const tabIndex = this.getTabIndex(this.tabset.tabs.toArray(), id);
      return this.tabs.toArray()[tabIndex];
    } else {
      return null;
    }
  }

  private getTabIndex(taTabs: TaTab[], id: string) {
    return taTabs.findIndex(tab => tab.id === id);
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.deactivateCurrentTab('pageChange');
  }

  private isActiveTab(tab: TabGuardedComponent) {
    const activeId = this.tabset.activeId;
    return exists(activeId)
      ? tab.title !== this.getTabGuardedById(activeId).title
      : false;
  }

  public getTabIdByTabTitle(title = '') {
    const found = this.tabset.tabs
      .toArray()
      .find(tab => tab.title.toLowerCase() === title.toLowerCase());
    return found ? found.id : null;
  }

  public setDisabilityByTabId(tadId, disability) {
    this.tabset.tabs.toArray().forEach(tab => {
      if (tab.id === tadId) {
        tab.disabled = disability;
      }
    });
  }
}
