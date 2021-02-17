import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsetGuardedComponent } from './tabset-guarded.component';
import { TaTabsetModule } from '@trustarc/ui-toolkit';
import { TabGuardedComponent } from './tab-guarded.component';

@NgModule({
  declarations: [TabsetGuardedComponent, TabGuardedComponent],
  imports: [CommonModule, TaTabsetModule],
  exports: [TabsetGuardedComponent, TabGuardedComponent]
})
export class TabsetGuardedModule {}
