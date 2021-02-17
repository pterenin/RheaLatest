import { RiskFieldIndicatorComponent } from './risk-field-indicator.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaTooltipModule } from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [RiskFieldIndicatorComponent],
  imports: [CommonModule, TaTooltipModule],
  exports: [RiskFieldIndicatorComponent]
})
export class RiskFieldIndicatorModule {}
