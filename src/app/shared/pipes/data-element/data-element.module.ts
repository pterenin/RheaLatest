import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataElementPipe } from './data-element.pipe';

@NgModule({
  declarations: [DataElementPipe],
  imports: [CommonModule],
  exports: [DataElementPipe],
  providers: [DataElementPipe]
})
export class DataElementPipeModule {}
