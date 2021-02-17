import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncCategoricalDropdownModule } from '../shared/components/async-categorical-dropdown/async-categorical-dropdown.module';
import { CountrySelectorModule } from 'src/app/shared/components/country-selector/country-selector.module';
import { LocationModule } from '../shared/components/location/location.module';
import { ComponentRegistryComponent } from './component-registry.component';
import { StateModule } from '../shared/components/state/state.module';
@NgModule({
  declarations: [ComponentRegistryComponent],
  exports: [ComponentRegistryComponent],
  imports: [
    CommonModule,
    AsyncCategoricalDropdownModule,
    CountrySelectorModule,
    LocationModule,
    StateModule
  ]
})
export class ComponentRegistryModule {}
