import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValueByKeyMapPipe } from './map.pipe';

@NgModule({
  declarations: [ValueByKeyMapPipe],
  imports: [CommonModule],
  exports: [ValueByKeyMapPipe]
})
export class MapPipeModule {}
