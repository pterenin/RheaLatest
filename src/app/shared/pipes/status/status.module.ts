import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusThemePipe } from './status.pipe';

@NgModule({
  declarations: [StatusThemePipe],
  imports: [CommonModule],
  exports: [StatusThemePipe]
})
export class StatusThemePipeModule {}
