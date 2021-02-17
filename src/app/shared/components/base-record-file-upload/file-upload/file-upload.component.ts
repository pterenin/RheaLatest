import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileUploadService } from './file-upload.validation.service';
import { ToastService } from '@trustarc/ui-toolkit';

@Component({
  selector: 'ta-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {
  @ViewChild('fileUploadInput') fileUploadInput: ElementRef;
  @Output() fileSelected = new EventEmitter();
  @Input() text: string;
  @Input() linkText: string;
  @Input() id = 'file_upload';
  @Input() fileRestriction = '';
  /**
   * Max file size can be upload. Default value is "16000000" bytes(16MB)
   */
  @Input() maxFileSize = 16000000;
  draggingOver: Boolean = false;
  files: any;

  public get maxFileSizeAllowed(): string {
    return `${this.maxFileSize / 1000000} MB`;
  }

  propagateChange: Function = (files: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched() {}

  writeValue(value: any) {
    if (value) {
      this.files = value;
    }
  }

  constructor(
    private fileUploadService: FileUploadService,
    private toastService: ToastService
  ) {}

  onDragOver(e) {
    e.preventDefault();
    this.draggingOver = true;
  }
  onDragLeave(e) {
    e.preventDefault();
    this.draggingOver = false;
  }
  selectFiles(files) {
    // this method is emitting fileSelected event for each file
    // files is not array, but array-like object that's why we use Array.from()
    this.propagateChange(files);
    const invalids = [];
    const arrayOfFiles = Array.from(files);
    arrayOfFiles.forEach((file, index) => {
      // check file valid extension and file size
      if (
        this.fileUploadService.isValidExtension(file) &&
        this.fileUploadService.isValidFileSize(file, this.maxFileSize)
      ) {
        this.fileSelected.emit(file);
      } else {
        if (!this.fileUploadService.isValidFileSize(file, this.maxFileSize)) {
          this.toastService.error(
            `Error: Files larger than ${this.maxFileSizeAllowed} cannot be uploaded`
          );
        }
        if (!this.fileUploadService.isValidExtension(file)) {
          this.toastService.error('Error: Invalid file type');
        }
        // remove invalid file from list
        invalids.push(files[index]);
        arrayOfFiles.splice(index, 1);
      }
    });
    // add invalid files to service
    this.fileUploadService.addInvalidFiles(invalids);
  }

  restrictFileTypeUpload(files, onSuccess, onFailure) {
    let countFailures = 0;
    Object.keys(files).map(key => {
      const condition = file => {
        const MS_EXCEL_CSV_TYPE = 'application/vnd.ms-excel';
        if (file.type) {
          return [this.fileRestriction, MS_EXCEL_CSV_TYPE].includes(file.type);
        } else {
          const type = file.name.split('.')[1];
          const restriction = this.fileRestriction.split('/')[1];
          return type.toLowerCase() === restriction.toLowerCase();
        }
      };

      if (!condition(files[key])) {
        countFailures++;
        onFailure();
      }
    });
    if (countFailures < Object.keys(files).length) {
      onSuccess();
    }
  }

  onDrop(event) {
    // onDrop fires when user drops file or files
    const { files } = event.dataTransfer;
    event.preventDefault();
    this.onDragLeave(event);

    const onFailure: Function = () =>
      this.toastService.error(
        'Error: Import functionality only supports .csv file format.'
      );
    const onSuccess: Function = () => this.selectFiles(files);
    this.fileRestriction
      ? this.restrictFileTypeUpload(files, onSuccess, onFailure)
      : this.selectFiles(files);
  }

  onFileSelected(event) {
    // File Selected fires when user select file by browsing files system
    // Fix for making non-configurable array configurable
    const files = Array.from(event.target.files);

    const onFailure: Function = () => {
      this.fileUploadInput.nativeElement.value = '';
      this.toastService.error(
        'Error: Import functionality only supports .csv file format.'
      );
    };
    const onSuccess: Function = () => this.selectFiles(files);
    this.fileRestriction
      ? this.restrictFileTypeUpload(files, onSuccess, onFailure)
      : this.selectFiles(files);
  }
}
