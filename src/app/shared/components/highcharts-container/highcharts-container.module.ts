import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsContainerComponent } from './highcharts-container.component';
import { FlowchartContainerComponent } from './flowchart-container/flowchart-container.component';
import {
  TaAccordionModule,
  TaBadgeModule,
  TaPopoverModule,
  TaSvgIconModule,
  TaTabsetModule,
  TaToggleSwitchModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule } from '@angular/forms';
import { RheaUiLibraryModule } from 'projects/rhea-ui-library/src/public-api';

@NgModule({
  declarations: [HighchartsContainerComponent, FlowchartContainerComponent],
  imports: [
    CommonModule,
    TaTabsetModule,
    HighchartsChartModule,
    TaPopoverModule,
    TaSvgIconModule,
    TaTooltipModule,
    TaToggleSwitchModule,
    TaTabsetModule,
    TaToggleSwitchModule,
    TaAccordionModule,
    TaBadgeModule,
    FormsModule,
    RheaUiLibraryModule
  ],
  exports: [HighchartsContainerComponent]
})
export class HighchartsContainerModule {}
