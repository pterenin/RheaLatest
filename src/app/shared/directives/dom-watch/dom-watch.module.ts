import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomWatchDirective } from './dom-watch.directive';

@NgModule({
  declarations: [DomWatchDirective],
  imports: [CommonModule],
  exports: [DomWatchDirective]
})
export class DomWatchModule {}
