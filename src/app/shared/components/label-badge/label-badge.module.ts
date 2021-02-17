import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelBadgeComponent } from './label-badge.component';
import {
  TaBadgeModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaTagsModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { LocationTooltipModule } from '../location-tooltip/location-tooltip.module';
import { ReplacePipeModule } from '../../pipes/replace/replace.module';
import { CustomCategoryTagModule } from '../custom-category-tag/custom-category-tag.module';

@NgModule({
  declarations: [LabelBadgeComponent],
  imports: [
    CommonModule,
    ReplacePipeModule,
    TaBadgeModule,
    TaTooltipModule,
    TaPopoverModule,
    LocationTooltipModule,
    TaTagsModule,
    TaSvgIconModule,
    CustomCategoryTagModule
  ],
  exports: [LabelBadgeComponent]
})
export class LabelBadgeModule {}
