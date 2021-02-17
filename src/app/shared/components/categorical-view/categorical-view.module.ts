import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoricalViewComponent } from './categorical-view.component';
import {
  TaBadgeModule,
  TaCheckboxModule,
  TaIconSearchModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaTagsModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { LocationTooltipModule } from '../location-tooltip/location-tooltip.module';
import { CustomCategoryTagModule } from '../custom-category-tag/custom-category-tag.module';

@NgModule({
  declarations: [CategoricalViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    LocationTooltipModule,
    TaTooltipModule,
    TaPopoverModule,
    TaCheckboxModule,
    TaPopoverModule,
    TaBadgeModule,
    TaIconSearchModule,
    TaTagsModule,
    TaSvgIconModule,
    CustomCategoryTagModule
  ],
  exports: [CategoricalViewComponent]
})
export class CategoricalViewModule {}
