import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizeCasePipe } from './string.pipe';

@NgModule({
  declarations: [CapitalizeCasePipe],
  imports: [CommonModule],
  exports: [CapitalizeCasePipe]
})
export class CapitalizeCasePipeModule {}
