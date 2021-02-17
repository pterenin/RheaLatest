import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

declare const _: any;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private subject = new Subject<[]>();
  constructor() {}

  public addInvalidFiles(files) {
    this.subject.next(files);
  }

  public getInvalidFiles(): Observable<[]> {
    return this.subject.pipe();
  }
  /**
   * Check file size. Return true if valid
   */
  public isValidFileSize(file, maxFileSize) {
    return file.size < maxFileSize;
  }
  /**
   * Check file mime or extension. Return true if valid
   */
  public isValidExtension(file) {
    return (
      this.isJpgFile(file) ||
      this.isPngFile(file) ||
      this.isGifFile(file) ||
      this.isCsvFile(file) ||
      this.isZipFile(file) ||
      this.isTxtFile(file) ||
      this.isMicroSoftFile(file) ||
      this.isRtfFile(file) ||
      this.isPdfFile(file) ||
      this.isCssFile(file) ||
      this.isJsFile(file) ||
      this.isHtmlFile(file) ||
      this.isCodeFile(file)
    );
  }

  private checkFileWith(mimeTypes: string[], validExts: string[], file) {
    const fileExt = file.name
      .split('.')
      .pop()
      .toLowerCase();

    const isValidExt =
      (file.type === '' || mimeTypes.length === 0) &&
      validExts.includes(fileExt);

    const isValidMime = file.type && mimeTypes.includes(file.type);

    return isValidExt || isValidMime;
  }

  private isJpgFile(file) {
    const exts = ['jpg', 'jpeg'];
    const mime = [
      'image/jpeg',
      'image/jpg',
      'image/jp_',
      'application/jpg',
      'application/x-jpg',
      'image/pjpeg',
      'image/pipeg',
      'image/vnd.swiftview-jpeg',
      'image/x-xbitmap'
    ];

    return this.checkFileWith(mime, exts, file);
  }

  private isPngFile(file) {
    const exts = ['png'];
    const mime = ['image/png', 'application/png', 'application/x-png'];

    return this.checkFileWith(mime, exts, file);
  }

  private isGifFile(file) {
    const exts = ['gif'];
    const mime = ['image/gif', 'image/x-xbitmap', 'image/gi_'];

    return this.checkFileWith(mime, exts, file);
  }

  private isCsvFile(file) {
    const exts = ['csv'];
    const mime = [
      'text/comma-separated-values',
      'text/csv',
      'application/csv',
      'application/excel',
      'application/vnd.ms-excel',
      'application/vnd.msexcel',
      'text/anytext'
    ];

    return this.checkFileWith(mime, exts, file);
  }

  private isZipFile(file) {
    const exts = ['zip'];
    const mime = [
      'application/zip',
      'application/x-zip',
      'application/x-zip-compressed',
      'application/octet-stream',
      'application/x-compress',
      'application/x-compressed',
      'multipart/x-zip'
    ];

    return this.checkFileWith(mime, exts, file);
  }

  private isTxtFile(file) {
    const exts = ['txt'];
    const mime = [
      'text/plain',
      'application/txt',
      'browser/internal',
      'text/anytext',
      'widetext/plain',
      'widetext/paragraph'
    ];

    return this.checkFileWith(mime, exts, file);
  }
  private isMicroSoftFile(file) {
    const exts = ['xsl', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pub', 'xps'];
    const mime = [
      'application/vnd.ms-excel [official]',
      'application/msexcel',
      'application/x-msexcel',
      'application/x-ms-excel',
      'application/vnd.ms-excel',
      'application/x-excel',
      'application/x-dos_ms_excel',
      'application/xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword [official]',
      'application/doc',
      'appl/text',
      'application/vnd.msword',
      'application/vnd.ms-word',
      'application/winword',
      'application/word',
      'application/x-msw6',
      'application/x-msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint [official]',
      'application/mspowerpoint',
      'application/ms-powerpoint',
      'application/mspowerpnt',
      'application/vnd-mspowerpoint',
      'application/powerpoint',
      'application/x-powerpoint',
      'application/x-m',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/x-mspublisher'
    ];

    return this.checkFileWith(mime, exts, file);
  }

  private isRtfFile(file) {
    const exts = ['rtf'];
    const mime = [
      'application/rtf',
      'application/x-rtf',
      'text/rtf',
      'text/richtext',
      'application/msword',
      'application/doc',
      'application/x-soffice'
    ];

    return this.checkFileWith(mime, exts, file);
  }

  private isPdfFile(file) {
    const exts = ['pdf'];
    const mime = [
      'application/pdf',
      'application/x-pdf',
      'application/acrobat',
      'applications/vnd.pdf',
      'text/pdf',
      'text/x-pdf'
    ];

    return this.checkFileWith(mime, exts, file);
  }

  private isCssFile(file) {
    const exts = ['css'];
    const mime = ['text/css', 'application/css-stylesheet'];

    return this.checkFileWith(mime, exts, file);
  }

  private isJsFile(file) {
    const exts = ['js'];
    const mime = ['application/x-javascript', 'text/javascript'];

    return this.checkFileWith(mime, exts, file);
  }

  private isHtmlFile(file) {
    const exts = ['html'];
    const mime = ['text/html', 'text/plain'];

    return this.checkFileWith(mime, exts, file);
  }

  private isCodeFile(file) {
    // Example only php, ts. This extension files will be change in future
    const exts = ['php', 'ts'];

    return this.checkFileWith([], exts, file);
  }
}
