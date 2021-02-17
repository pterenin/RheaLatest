import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaTooltipModule } from '@trustarc/ui-toolkit';

import { RecordIconComponent } from './record-icon.component';
import { ReplacePipeModule } from 'src/app/shared/pipes/replace/replace.module';

@NgModule({
  declarations: [RecordIconComponent],
  exports: [RecordIconComponent],
  entryComponents: [RecordIconComponent],
  imports: [CommonModule, TaTooltipModule, ReplacePipeModule]
})
export class RecordIconModule {}
