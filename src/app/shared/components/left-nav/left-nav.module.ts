import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftNavComponent } from './left-nav.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LeftNavComponent],
  imports: [CommonModule, RouterModule],
  exports: [LeftNavComponent]
})
export class LeftNavModule {}
