import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityTypePipe } from './entity-type.pipe';

@NgModule({
  declarations: [EntityTypePipe],
  imports: [CommonModule],
  exports: [EntityTypePipe]
})
export class EntityTypePipeModule {}
