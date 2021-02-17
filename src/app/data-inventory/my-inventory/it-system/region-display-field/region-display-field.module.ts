import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionDisplayFieldComponent } from './region-display-field.component';
import {
  TaTagsModule,
  TaButtonsModule,
  TaSvgIconModule
} from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [RegionDisplayFieldComponent],
  imports: [CommonModule, TaTagsModule, TaButtonsModule, TaSvgIconModule],
  exports: [RegionDisplayFieldComponent]
})
export class RegionDisplayFieldModule {}
