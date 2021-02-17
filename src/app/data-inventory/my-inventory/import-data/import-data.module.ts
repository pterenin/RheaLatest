import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ImportDataComponent } from './import-data.component';
import { TaModalModule, TaButtonsModule } from '@trustarc/ui-toolkit';
import { CategoricalViewModule } from 'src/app/shared/components/categorical-view/categorical-view.module';
import { SimpleFileUploadModule } from 'src/app/shared/components/base-record-file-upload/simple-file-upload/simple-file-upload.module';
import { LocationModule } from 'src/app/shared/components/location/location.module';

@NgModule({
  declarations: [ImportDataComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TaModalModule,
    TaButtonsModule,
    CategoricalViewModule,
    LocationModule,
    SimpleFileUploadModule
  ],
  entryComponents: [ImportDataComponent]
})
export class ImportDataModule {}
