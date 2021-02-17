import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessingPurposePipe } from './processing-purpose.pipe';

@NgModule({
  declarations: [ProcessingPurposePipe],
  imports: [CommonModule],
  exports: [ProcessingPurposePipe],
  providers: [ProcessingPurposePipe]
})
export class ProcessingPurposePipeModule {}
