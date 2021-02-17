import { NgModule } from '@angular/core';
import { AmIntegrationRoutingModule } from './am-integration-routing.module';
import { CommonModule } from '@angular/common';
import { BusinessProcessesModule } from '../../business-processes/business-processes.module';
import { AmintegrationComponent } from './am-integration.component';

@NgModule({
  imports: [CommonModule, AmIntegrationRoutingModule, BusinessProcessesModule],
  declarations: [AmintegrationComponent]
})
export class AmIntegrationModule {}
