import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TaButtonsModule,
  TaSvgIconModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { BaseRecordFileUploadComponent } from './base-record-file-upload/base-record-file-upload.component';
import { BaseRecordFileUploadService } from './base-record-file-upload.service';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ModalsModule } from 'src/app/business-processes/business-process-wizard/shared/components/modals/modals.module';

@NgModule({
  declarations: [BaseRecordFileUploadComponent],
  imports: [
    CommonModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    TaButtonsModule,
    TaSvgIconModule,
    TaTooltipModule,
    ModalsModule
  ],
  exports: [BaseRecordFileUploadComponent],
  providers: [BaseRecordFileUploadService]
})
export class BaseRecordFileUploadModule {}
