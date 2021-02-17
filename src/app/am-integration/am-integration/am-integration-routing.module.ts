import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BusinessProcessesComponent } from '../../business-processes/business-processes.component';
import { AmintegrationComponent } from './am-integration.component';

export const routes: Routes = [
  {
    path: ':type/new',
    component: AmintegrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmIntegrationRoutingModule {}
