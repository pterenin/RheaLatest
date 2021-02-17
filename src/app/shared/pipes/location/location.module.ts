import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationPipe } from './location.pipe';

@NgModule({
  declarations: [LocationPipe],
  imports: [CommonModule],
  exports: [LocationPipe]
})
export class LocationPipeModule {}
