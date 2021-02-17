import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import {
  AddAttachmentResponse,
  AttachmentInterface,
  AttachmentLink
} from './attachment.model';
import { isIdParameterInvalid } from 'src/app/shared/utils/basic-utils';

declare const _: any;

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  constructor(private httpClient: HttpClient) {}

  public getAttachments(id: string): Observable<AttachmentInterface[]> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    return this.httpClient.get<AttachmentInterface[]>(
      `/api/hub/records/${id}/attachments`,
      {}
    );
  }

  /**
   * Upload an attachment to a record.
   * @param id the record id
   * @param file the file reference
   * @param comment optional comment for the file
   */
  public addAttachment(
    id: string,
    file: File,
    comment: string
  ): Observable<AddAttachmentResponse> {
    const body = new FormData();
    body.append('comment', comment);
    body.append('file', file);
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    return this.httpClient.post<AddAttachmentResponse>(
      `/api/hub/records/${id}/attachments`,
      body,
      {
        headers: new HttpHeaders({ Accept: 'application/json' })
      }
    );
  }

  /**
   * Update the comment on an attachment.
   *
   * @param id the record id
   * @param attachmentId the id of the target attachment
   * @param comment optional comment for the file
   * @returns the id and version of the attachment.
   */
  public updateComment(
    id: string,
    attachmentId: string,
    comment: string
  ): Observable<BaseDomainInterface> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    if (isIdParameterInvalid(attachmentId)) {
      return throwError(`Invalid ID: ${attachmentId}`);
    }
    return this.httpClient.put<BaseDomainInterface>(
      `/api/hub/records/${id}/attachments/${attachmentId}`,
      { comment }
    );
  }

  /**
   * Delete an attachment from a record.
   * @param id the record id
   * @param attachmentId the file reference
   */
  public deleteAttachment(
    id: string,
    attachmentId: string
  ): Observable<BaseDomainInterface> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    return this.httpClient.delete<BaseDomainInterface>(
      `/api/hub/records/${id}/attachments/${attachmentId}`
    );
  }

  public downloadAttachment(
    id: string,
    attachmentId: string
  ): Observable<AttachmentLink> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    if (isIdParameterInvalid(attachmentId)) {
      return throwError(`Invalid ID: ${attachmentId}`);
    }
    return this.httpClient.get<AttachmentLink>(
      `/api/hub/records/${id}/attachments/${attachmentId}`
    );
  }
}
