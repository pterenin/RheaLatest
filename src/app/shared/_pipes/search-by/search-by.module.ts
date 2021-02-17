import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchByPipe } from './search-by.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [SearchByPipe],
  exports: [SearchByPipe]
})
export class SearchByPipeModule {}
