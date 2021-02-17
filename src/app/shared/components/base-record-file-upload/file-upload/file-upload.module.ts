import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TaButtonsModule,
  TaSvgIconModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { BaseRecordFileUploadService } from '../base-record-file-upload.service';
import { FileUploadComponent } from './file-upload.component';

@NgModule({
  declarations: [FileUploadComponent],
  imports: [CommonModule, TaButtonsModule, TaSvgIconModule, TaTooltipModule],
  exports: [FileUploadComponent],
  providers: [BaseRecordFileUploadService]
})
export class FileUploadModule {}
