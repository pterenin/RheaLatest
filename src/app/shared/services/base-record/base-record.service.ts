import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import {
  BaseRecordDeletionResponse,
  DeletionItemInterface
} from '../../models/base-record-model';
import { ToastService } from '@trustarc/ui-toolkit';
import { AuditCollectionInterface } from '../../models/audit.model';

@Injectable({
  providedIn: 'root'
})
export class BaseRecordService {
  private recordsDeleted = new BehaviorSubject([]);

  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService
  ) {}

  public deleteRecordsByIdList(
    idList: DeletionItemInterface[]
  ): Observable<any> {
    return this.httpClient
      .request('DELETE', `/api/hub/base-records/records`, {
        body: {
          records: idList.map(item => ({
            id: item.id,
            entityType: item.entityType
          }))
        }
      })
      .pipe(
        // Give time for ElasticSearch BE to catch up; choose 1 second because old DFM used it
        delay(1000),
        tap((res: BaseRecordDeletionResponse) => {
          if (res.hasErrors) {
            this.toastService.error(
              this.constructDeleteToastMessage(res),
              null,
              5000
            );
          } else {
            idList.length > 1
              ? this.toastService.success(`${idList.length} records deleted`)
              : this.toastService.success(
                  `${idList[0].name} successfully deleted`
                );
          }
          this.recordsDeleted.next([]);
        }),
        catchError(res => {
          // [i18n-tobeinternationalized]
          const message =
            res.statusText === 'Forbidden'
              ? 'You do not have the access permissions needed to edit this record'
              : 'Error deleting selected records';

          this.toastService.error(message);
          return throwError(res);
        })
      );
  }

  private constructDeleteToastMessage(
    response: BaseRecordDeletionResponse
  ): string {
    let message: string;
    switch (response.dbConflicts.length) {
      case 0:
        // [i18n-tobeinternationalized]
        message = response.errors[0].message
          ? response.errors[0].message
          : 'There was an error deleting the records';
        break;
      case 1:
        message = this.getSingleRecordConflictMessage(response);
        break;
      default:
        message = this.getMultiRecordConflictMessage(response);
    }
    return message;
  }

  private getMultiRecordConflictMessage(response: BaseRecordDeletionResponse) {
    // [i18n-tobeinternationalized]
    let message = `These records are currently in use and can't be deleted. <br />`;
    response.dbConflicts.forEach(conflict => {
      const itSystemConflicts: string[] = [];
      const businessProcessConflicts: string[] = [];
      conflict.conflictingRecords.forEach(record => {
        const parsedRecordName = `${record.name} (${record.identifier})`;
        if (record.recordType === 'BusinessProcess') {
          businessProcessConflicts.push(parsedRecordName);
        } else {
          itSystemConflicts.push(parsedRecordName);
        }
      });
      if (itSystemConflicts.length > 0) {
        message += this.getMultiConflictToastSection(
          conflict.record.name,
          'IT Systems', // [i18n-tobeinternationalized]
          itSystemConflicts
        );
      }
      if (businessProcessConflicts.length > 0) {
        message += this.getMultiConflictToastSection(
          conflict.record.name,
          'Business Processes', // [i18n-tobeinternationalized]
          businessProcessConflicts
        );
      }
    });
    return message;
  }

  private getSingleRecordConflictMessage(response: BaseRecordDeletionResponse) {
    const itSystemConflicts: string[] = [];
    const businessProcessConflicts: string[] = [];
    response.dbConflicts[0].conflictingRecords.forEach(record => {
      const parsedRecordName = `${record.name} (${record.identifier})`;
      if (record.recordType === 'BusinessProcess') {
        businessProcessConflicts.push(parsedRecordName);
      } else {
        itSystemConflicts.push(parsedRecordName);
      }
    });
    return `<div>${response.dbConflicts[0].message}</div>
    ${
      businessProcessConflicts.length > 0
        ? this.getSingleConflictToastSection(
            'Business Processes', // [i18n-tobeinternationalized]
            businessProcessConflicts
          )
        : ''
    }
    ${
      itSystemConflicts.length > 0
        ? this.getSingleConflictToastSection(
            'IT Systems', // [i18n-tobeinternationalized]
            itSystemConflicts
          )
        : ''
    }`;
  }

  private getSingleConflictToastSection(header: string, conflicts: string[]) {
    return `
    <br />
    <div class='delete-toast-header'>
    ${header}
    </div>
    <div class='delete-toast-text'>
    ${this.parseConflictList(conflicts)}
    </div>`;
  }

  private getMultiConflictToastSection(
    recordName: string,
    recordType: string,
    conflicts: string[]
  ) {
    return `
    <br />
    <div class='delete-toast-header'>
    Remove ${recordName} from the following ${recordType}
    </div>
    <div class='delete-toast-text'>
    ${this.parseConflictList(conflicts)}
    </div>`;
  }

  private parseConflictList(conflictList: string[]): string {
    const maxLength = 3;
    const shortenedConflictList = conflictList.slice(0, maxLength);
    const resultListString = shortenedConflictList.join(', ');
    const hiddenNum = conflictList.length - shortenedConflictList.length;
    const endText = hiddenNum > 0 ? `, and ${hiddenNum} more records...` : '';
    return resultListString + endText;
  }

  public getAuditsById(
    id: string,
    size: number,
    page: number,
    sort: string
  ): Observable<AuditCollectionInterface> {
    return this.httpClient.get<AuditCollectionInterface>(
      `/api/hub/base-records/${id}/audits?size=${size}&page=${page}&sort=${sort}`
    );
  }

  public getRecordsDeleted() {
    // Give time for Elastic search BE to catch up
    return this.recordsDeleted.asObservable().pipe(delay(1000));
  }
}
