import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountrySelectorComponent } from './country-selector.component';
import { TaButtonsModule } from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [CountrySelectorComponent],
  exports: [CountrySelectorComponent],
  imports: [CommonModule, TaButtonsModule]
})
export class CountrySelectorModule {}
