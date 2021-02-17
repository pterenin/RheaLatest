import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  TaBadgeModule,
  TaProgressbarModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { HighchartsChartModule } from 'highcharts-angular';

import { DataFlowChartComponent } from './components/data-flow-chart/data-flow-chart.component';
import { DataFlowChartControlsComponent } from './components/data-flow-chart-controls/data-flow-chart-controls.component';
import { DataFlowChartNodeComponent } from './components/data-flow-chart-node/data-flow-chart-node.component';
import { DataFlowMapComponent } from './components/data-flow-map/data-flow-map.component';
import { DataFlowRecordIconComponent } from './components/data-flow-record-icon/data-flow-record-icon.component';
import { MapContainerComponent } from './components/map-container/map-container.component';

import { ReplacePipe } from './pipes/replace/replace.pipe';

@NgModule({
  declarations: [
    DataFlowChartComponent,
    DataFlowChartNodeComponent,
    DataFlowMapComponent,
    DataFlowRecordIconComponent,
    DataFlowChartControlsComponent,
    MapContainerComponent,
    ReplacePipe
  ],
  imports: [
    CommonModule,
    TaBadgeModule,
    TaTooltipModule,
    TaProgressbarModule,
    TaProgressbarModule,
    HighchartsChartModule
  ],
  exports: [
    DataFlowChartComponent,
    DataFlowChartNodeComponent,
    DataFlowMapComponent,
    DataFlowRecordIconComponent,
    DataFlowChartControlsComponent,
    MapContainerComponent,
    ReplacePipe
  ],
  entryComponents: [DataFlowChartNodeComponent]
})
export class RheaUiLibraryModule {}
