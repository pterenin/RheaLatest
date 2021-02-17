import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Step4ItemsComponent } from './step-4-selected-items-container.component';
import { Step4SelectedItemsContainerService } from './step-4-selected-items-container.service';
import { CategoricalViewModule } from '../categorical-view/categorical-view.module';

import {
  TaButtonsModule,
  TaDropdownModule,
  TaSvgIconModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';

import { LabelBadgeModule } from '../label-badge/label-badge.module';
import { Step4SearchFilterPipe } from './step-4-pipes/step-4-search-filter/step-4-search-filter.pipe';
import { Step4CategoryFilterPipe } from './step-4-pipes/step-4-category-filter/step-4-category-filter.pipe';
import { AsyncCategoricalDropdownModule } from '../async-categorical-dropdown/async-categorical-dropdown.module';

@NgModule({
  declarations: [
    Step4ItemsComponent,
    Step4SearchFilterPipe,
    Step4CategoryFilterPipe
  ],
  imports: [
    AsyncCategoricalDropdownModule,
    CategoricalViewModule,
    CommonModule,
    LabelBadgeModule,
    TaButtonsModule,
    TaDropdownModule,
    TaSvgIconModule,
    TaTooltipModule
  ],
  exports: [Step4ItemsComponent],
  providers: [Step4SelectedItemsContainerService]
})
export class Step4ItemsModule {}
