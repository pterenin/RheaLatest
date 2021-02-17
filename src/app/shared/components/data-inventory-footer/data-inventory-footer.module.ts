import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataInventoryFooterComponent } from './data-inventory-footer.component';
import { TaButtonsModule, TaDropdownModule } from '@trustarc/ui-toolkit';
import { PageFooterModule } from '../page-footer-nav/page-footer-nav.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DataInventoryFooterComponent],
  imports: [
    CommonModule,
    TaDropdownModule,
    TaButtonsModule,
    FormsModule,
    PageFooterModule,
    RouterModule
  ],
  exports: [DataInventoryFooterComponent]
})
export class DataInventoryFooterModule {}
