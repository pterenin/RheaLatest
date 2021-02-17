import { NgModule } from '@angular/core';
import {
  TaSvgIconModule,
  TaBadgeModule,
  TaTooltipModule,
  TaDropdownModule,
  TaButtonsModule
} from '@trustarc/ui-toolkit';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { CommonModule } from '@angular/common';
import { BusinessProcessWizardHeaderComponent } from './business-process-wizard-header.component';
import { TagsComponent } from '../tags/tags.component';
import { NotesAttachmentsComponent } from '../notes-attachments/notes-attachments.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BaseRecordFileUploadModule } from 'src/app/shared/components/base-record-file-upload/base-record-file-upload.module';
import { TagsSelectorModule } from 'src/app/shared/components/tags-selector/tags-selector.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    BusinessProcessWizardHeaderComponent,
    TagsComponent,
    NotesAttachmentsComponent
  ],
  exports: [
    BusinessProcessWizardHeaderComponent,
    TagsComponent,
    NotesAttachmentsComponent
  ],
  imports: [
    CommonModule,
    TaSvgIconModule,
    TaBadgeModule,
    DropdownFieldModule,
    TaDropdownModule,
    TaTooltipModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    BaseRecordFileUploadModule,
    TaBadgeModule,
    TagsSelectorModule,
    HttpClientModule,
    TaButtonsModule,
    FormsModule
  ],
  entryComponents: [TagsComponent, NotesAttachmentsComponent]
})
export class BusinessProcessWizardHeaderModule {}
