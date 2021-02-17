import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddItSystemComponent } from './add-it-system.component';
import { Step4Service } from '../step-4.service';
import {
  TaAccordionModule,
  TaBadgeModule,
  TaButtonsModule,
  TaModalModule,
  TaSvgIconModule,
  TaTabsetModule,
  TaTagsModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { CategoricalViewModule } from 'src/app/shared/components/categorical-view/categorical-view.module';
import { LocationModule } from 'src/app/shared/components/location/location.module';
import { EntityTypePipeModule } from 'src/app/shared/pipes/entity-type/entity-type.module';
import { RiskFieldIndicatorModule } from 'src/app/shared/components/risk-field-indicator/risk-field-indicator.module';

@NgModule({
  declarations: [AddItSystemComponent],
  imports: [
    CommonModule,
    EntityTypePipeModule,
    ReactiveFormsModule,
    FormsModule,
    TaModalModule,
    TaButtonsModule,
    TaTabsetModule,
    TaTooltipModule,
    TaAccordionModule,
    CategoricalViewModule,
    LocationModule,
    TaBadgeModule,
    RiskFieldIndicatorModule,
    TaSvgIconModule,
    TaTagsModule
  ],
  entryComponents: [AddItSystemComponent],
  providers: [Step4Service]
})
export class AddItSystemModule {}
