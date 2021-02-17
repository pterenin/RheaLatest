import { NgModule } from '@angular/core';
import { AssessmentsComponent } from './assessments.component';
import { CommonModule } from '@angular/common';
import { AssessmentsService } from './assessments.service';
import { TaDropdownModule, TaSvgIconModule } from '@trustarc/ui-toolkit';

@NgModule({
  declarations: [AssessmentsComponent],
  imports: [CommonModule, TaDropdownModule, TaSvgIconModule],
  exports: [AssessmentsComponent],
  providers: [AssessmentsService]
})
export class AssessmentsModule {}
