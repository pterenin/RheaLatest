import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';
import { BaseRecordFileUploadService } from '../base-record-file-upload.service';
import { AttachmentLink } from '../file-upload/attachment.model';
import { ToastService } from '@trustarc/ui-toolkit';

declare const _: any;

@Component({
  selector: 'ta-simple-file-upload',
  templateUrl: './simple-file-upload.component.html',
  styleUrls: ['./simple-file-upload.component.scss']
})
export class SimpleFileUploadComponent implements OnInit {
  public fileUploadFormGroup: FormGroup;
  public fileForms: FormArray;
  @Input() public text: string;
  @Input() public fileRestriction: string;
  // Size in KB
  @Input() public maxFileSize = 16000000;

  constructor(
    private controlContainer: ControlContainer,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    public baseRecordFileUploadService: BaseRecordFileUploadService
  ) {
    this.text = 'Drag & drop your files to attach or';
    this.fileForms = this.formBuilder.array([]);
    baseRecordFileUploadService.setFileUploadFormArray(this.fileForms);
  }

  ngOnInit() {
    this.fileUploadFormGroup = <FormGroup>this.controlContainer.control;
    this.fileUploadFormGroup.registerControl('fileForms', this.fileForms);
  }

  public get maxFileSizeAllowed(): string {
    return `${this.maxFileSize / 1000000} MB`;
  }

  public addFileForm(file) {
    this.baseRecordFileUploadService.addFileFormWithoutSave(file);
  }

  public downloadFileFrom(fileControl: FormControl) {
    const fileId = fileControl.get('id').value;
    const fileName = fileControl.get('fileName').value;

    this.baseRecordFileUploadService
      .downloadFile(fileId)
      .subscribe(this.downloadSuccess, error => {
        this.downloadFailed(fileName);
      });
  }

  public downloadFailed(fileName: string) {
    this.toastService.error(
      `Error retrieving file with filename "${fileName}"`
    );
  }
  public getFileControl() {
    return this.fileUploadFormGroup.get('fileForms')['controls'];
  }

  public downloadSuccess(fileLink: AttachmentLink) {
    window.open(fileLink.fileUrl, '_blank');
  }

  public isFileStatusError(fileControl: FormControl) {
    return this.baseRecordFileUploadService.isFileStatusError(fileControl);
  }

  public removeFile(index) {
    this.baseRecordFileUploadService.removeFileWithoutSave(index);
  }
}
