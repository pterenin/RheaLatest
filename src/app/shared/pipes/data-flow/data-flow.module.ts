import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFlowPipe } from './data-flow.pipe';

@NgModule({
  declarations: [DataFlowPipe],
  imports: [CommonModule],
  exports: [DataFlowPipe]
})
export class DataFlowPipeModule {}
