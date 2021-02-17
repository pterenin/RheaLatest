import { NgModule } from '@angular/core';
import { SlotViewDirective } from './slot-view.directive';
import { SlotService } from './slot.injectable';
import { SlotContainerDirective } from './slot.directive';

@NgModule({
  declarations: [SlotContainerDirective, SlotViewDirective],
  providers: [SlotService],
  exports: [SlotContainerDirective, SlotViewDirective]
})
export class SlotModule {}
