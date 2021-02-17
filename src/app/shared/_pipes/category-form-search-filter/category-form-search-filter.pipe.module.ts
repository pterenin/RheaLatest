import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryFormSearchFilterByProperties } from './category-form-search-filter.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [CategoryFormSearchFilterByProperties],
  exports: [CategoryFormSearchFilterByProperties]
})
export class CategoryFormSearchFilterPipeModule {}
