import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatePipe } from './paginate.pipe';

@NgModule({
  declarations: [PaginatePipe],
  imports: [CommonModule],
  exports: [PaginatePipe]
})
export class PaginatePipeModule {}
