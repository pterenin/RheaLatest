import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinByPipe } from './array.pipe';

@NgModule({
  declarations: [JoinByPipe],
  imports: [CommonModule],
  exports: [JoinByPipe]
})
export class ArrayPipeModule {}
