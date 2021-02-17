import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCategoryTagComponent } from './custom-category-tag.component';
import { TaTagsModule } from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [CustomCategoryTagComponent],
  imports: [CommonModule, TaTagsModule],
  exports: [CustomCategoryTagComponent],
  entryComponents: [CustomCategoryTagComponent]
})
export class CustomCategoryTagModule {}
