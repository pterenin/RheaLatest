import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSubjectPipe } from './data-subject.pipe';

@NgModule({
  declarations: [DataSubjectPipe],
  imports: [CommonModule],
  exports: [DataSubjectPipe],
  providers: [DataSubjectPipe]
})
export class DataSubjectPipeModule {}
