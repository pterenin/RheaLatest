import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrafficRiskIndicatorComponent } from './traffic-risk-indicator.component';
import { TaPopoverModule, TaTooltipModule } from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [TrafficRiskIndicatorComponent],
  imports: [CommonModule, TaTooltipModule, TaPopoverModule],
  exports: [TrafficRiskIndicatorComponent]
})
export class TrafficSignalRiskIndicatorModule {}
