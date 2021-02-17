import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectedItemsContainerComponent } from './selected-items-container.component';
import { SelectedItemsContainerService } from './selected-items-container.service';
import { CategoricalViewModule } from '../categorical-view/categorical-view.module';

import {
  TaButtonsModule,
  TaCheckboxModule,
  TaDropdownModule,
  TaSvgIconModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { LabelBadgeModule } from '../label-badge/label-badge.module';
import { SearchFilterPipe } from './pipes/search-filter/search-filter.pipe';
import { CategoryFilterPipe } from './pipes/category-filter/category-filter.pipe';
import { RiskFieldIndicatorModule } from '../risk-field-indicator/risk-field-indicator.module';

@NgModule({
  declarations: [
    SelectedItemsContainerComponent,
    SearchFilterPipe,
    CategoryFilterPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    TaButtonsModule,
    TaCheckboxModule,
    TaDropdownModule,
    TaSvgIconModule,
    TaTooltipModule,
    LabelBadgeModule,
    CategoricalViewModule,
    RiskFieldIndicatorModule
  ],
  exports: [SelectedItemsContainerComponent],
  providers: [SelectedItemsContainerService]
})
export class SelectedItemsContainerModule {}
