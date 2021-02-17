import { Component, OnInit } from '@angular/core';
import { TaActiveModal, ToastService } from '@trustarc/ui-toolkit';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  Validators
} from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ImportService } from 'src/app/shared/services/import/import.service';
import { file } from '@rxweb/reactive-form-validators';

declare const _: any;

@Component({
  selector: 'ta-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent implements OnInit {
  isProcessing = false;
  fileFormsGroup: FormGroup;
  constructor(
    public activeModal: TaActiveModal,
    private formBuilder: FormBuilder,
    private importService: ImportService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  public initForm() {
    this.fileFormsGroup = this.formBuilder.group({ placeholder: '' });
  }

  public closeModal() {
    this.activeModal.dismiss('Cross click');
  }

  public onSubmit() {
    const formData = new FormData();
    this.fileFormsGroup.value.fileForms.forEach(element => {
      formData.append('file', element.file);
      this.isProcessing = true;
    });

    this.importService.uploadCsvs(formData).subscribe(
      success => {
        if (success.body.fileErrors.length === 0) {
          this.toastService.info(
            // [i18n-tobeinternationalized]
            'Your data inventory records are being generated. Check your email shortly for an update.'
          );
        } else {
          this.toastService.error(
            // [i18n-tobeinternationalized]
            `<div>` +
              `We're in the process of adding ${success.body.recordCount} records to your data inventory,
              but the files listed below contain errors and will require revisions.
              Check your email shortly for an update on the population of your data inventory records and
              a detailed report of necessary revisions.` +
              `</div>` +
              `<div>` +
              `${success.body.fileErrors.map(
                fileError => `<br />${fileError.fileName}`
              )}` +
              `</div>`
          );
        }
        this.activeModal.close();
      },
      error => {
        let errorMessage = 'There was an error importing records.'; // [i18n-tobeinternationalized]
        switch (error.status) {
          case 413:
            errorMessage += ' File(s) are too large for upload.'; // [i18n-tobeinternationalized]
            break;
          case 504:
            errorMessage =
              'Uploading files taking longer than anticipated. Please check your network connection'; // [i18n-tobeinternationalized]
            break;
          case 502 || 503:
            errorMessage = ' Please contact support.'; // [i18n-tobeinternationalized]
            break;
          default:
            errorMessage = error.error
              ? error.error.message
              : 'Please check all files are valid CSV files.';
          // [i18n-tobeinternationalized]
        }
        this.toastService.error(errorMessage);
        this.isProcessing = false;
      },
      () => {
        this.isProcessing = false;
      }
    );
  }

  public downloadTemplates(path: String) {
    this.importService.downloadTemplates(path).subscribe(
      response => {
        this.downloadReturnedFile(response);
      },
      error => {
        // [i18n-tobeinternationalized]
        const errorMessage = 'There was an error retrieving the CSV templates';
        this.toastService.error(errorMessage);
      }
    );
  }

  private downloadReturnedFile(response: HttpResponse<Blob>) {
    const downloadElement = document.createElement('a');
    const contentDisposition = response.headers.get('Content-Disposition');
    const filenameStart = contentDisposition.indexOf('=') + 1;
    const filename = contentDisposition.substr(filenameStart);
    const blob = new Blob([response.body], {
      type: 'application/octet-stream'
    });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      downloadElement.href = window.URL.createObjectURL(blob);
      downloadElement.download = filename;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      // Potential race condtion could occur as descirbed in RHEA-1036, currently has not been confrimed
      window.URL.revokeObjectURL(downloadElement.href);
    }
  }
}
