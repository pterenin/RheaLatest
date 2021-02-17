import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TaButtonsModule,
  TaSvgIconModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { SimpleFileUploadComponent } from './simple-file-upload.component';
import { FileUploadModule } from '../file-upload/file-upload.module';

@NgModule({
  declarations: [SimpleFileUploadComponent],
  imports: [
    CommonModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    TaButtonsModule,
    TaSvgIconModule,
    TaTooltipModule
  ],
  exports: [SimpleFileUploadComponent]
})
export class SimpleFileUploadModule {}
