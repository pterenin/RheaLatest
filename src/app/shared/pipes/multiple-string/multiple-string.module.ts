import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultipleStringPipe } from './multiple-string.pipe';

@NgModule({
  declarations: [MultipleStringPipe],
  imports: [CommonModule],
  exports: [MultipleStringPipe]
})
export class MultipleStringPipeModule {}
