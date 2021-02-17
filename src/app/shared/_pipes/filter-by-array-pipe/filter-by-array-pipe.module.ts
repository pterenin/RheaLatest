import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FilterByArrayPipe,
  FilterByIncludeArrayAndPathPipe,
  FilterByIncludeArrayInArrayAndPathPipe
} from './filter-by-array.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    FilterByArrayPipe,
    FilterByIncludeArrayAndPathPipe,
    FilterByIncludeArrayInArrayAndPathPipe
  ],
  exports: [
    FilterByArrayPipe,
    FilterByIncludeArrayAndPathPipe,
    FilterByIncludeArrayInArrayAndPathPipe
  ]
})
export class FilterByArrayPipeModule {}
