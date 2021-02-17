import { AuditAccordionComponent } from './audit-accordion.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditTableModule } from '../audit-table/audit-table.module';
import { TaAccordionModule } from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [AuditAccordionComponent],
  imports: [CommonModule, AuditTableModule, TaAccordionModule],
  exports: [AuditAccordionComponent]
})
export class AuditAccordionModule {}
