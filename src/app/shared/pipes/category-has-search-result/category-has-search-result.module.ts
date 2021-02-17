import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryHasSearchResultPipe } from './category-has-search-result.pipe';

@NgModule({
  declarations: [CategoryHasSearchResultPipe],
  imports: [CommonModule],
  exports: [CategoryHasSearchResultPipe]
})
export class CategoryHasSearchResultPipeModule {}
