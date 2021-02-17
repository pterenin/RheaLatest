import { AuditTableComponent } from './audit-table.component';
import { TaPaginationModule, TaTableModule } from '@trustarc/ui-toolkit';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AuditTableComponent],
  imports: [CommonModule, TaTableModule, TaPaginationModule],
  exports: [AuditTableComponent]
})
export class AuditTableModule {}
