import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartComponent } from './chart.component';
@NgModule({
  declarations: [ChartComponent],
  exports: [ChartComponent],
  entryComponents: [ChartComponent],
  imports: [CommonModule]
})
export class ChartModule {}
