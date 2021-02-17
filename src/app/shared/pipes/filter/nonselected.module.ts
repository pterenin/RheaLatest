import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonselectedPipe } from './nonselected.pipe';

@NgModule({
  declarations: [NonselectedPipe],
  imports: [CommonModule],
  exports: [NonselectedPipe]
})
export class NonselectedPipeModule {}
