import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationModalContentComponent } from './location-modal-content.component';
import {
  TaAccordionModule,
  TaBadgeModule,
  TaButtonsModule,
  TaCheckboxModule,
  TaSvgIconModule,
  TaTabsetModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { CategoricalViewModule } from 'src/app/shared/components/categorical-view/categorical-view.module';
import { LocationModule } from 'src/app/shared/components/location/location.module';
import { FormsModule } from '@angular/forms';
import { StateModule } from '../state/state.module';
import { RiskFieldIndicatorModule } from '../risk-field-indicator/risk-field-indicator.module';

@NgModule({
  entryComponents: [LocationModalContentComponent],
  declarations: [LocationModalContentComponent],
  exports: [LocationModalContentComponent],
  imports: [
    CommonModule,
    FormsModule,
    TaCheckboxModule,
    TaBadgeModule,
    TaButtonsModule,
    TaAccordionModule,
    CategoricalViewModule,
    TaTabsetModule,
    LocationModule,
    StateModule,
    RiskFieldIndicatorModule,
    TaSvgIconModule,
    TaTooltipModule
  ]
})
export class LocationModalContentModule {}
