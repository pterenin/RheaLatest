import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerPipe } from './owner.pipe';

@NgModule({
  declarations: [OwnerPipe],
  imports: [CommonModule],
  exports: [OwnerPipe]
})
export class OwnerPipeModule {}
