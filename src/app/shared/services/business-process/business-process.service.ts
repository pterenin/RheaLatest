import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseDomainInterface } from '../../models/base-domain-model';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BusinessProcessInterface } from 'src/app/business-processes/create-bp/create-business-processes.model';
import { isIdParameterInvalid } from 'src/app/shared/utils/basic-utils';
// tslint:disable-next-line:max-line-length
import { BusinessProcessDataTransfersInterface } from '../../../../../projects/rhea-ui-library/src/lib/components/data-flow-chart/data-flow-chart.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessProcessService {
  private _disableCreateBusinessProcesses$ = new BehaviorSubject(false);

  /**
   * This stores the default names of newly craeted business processes so that they can be blanked
   * out in the UI.  These values are not persisted, so that if a user refreshes their page,
   * they will see the default name as if they had entered it themselves.
   */
  private defaultNamesForNewlyCreatedBusinessProcesses: Map<
    string,
    { initialDefaultName: string }
  >;

  constructor(private httpClient: HttpClient) {
    this.defaultNamesForNewlyCreatedBusinessProcesses = new Map<
      string,
      { initialDefaultName: string }
    >();
  }

  public getCreateBusinessProcessesDisabledObservable(): Observable<boolean> {
    return this._disableCreateBusinessProcesses$;
  }

  public cloneBusinessProcessRecord(form, record) {
    const body = {
      name: form.businessProcessName,
      copyTags: form.allTags,
      copyAttachments: form.allAttachments
    };

    const url = `/api/hub/business-processes/${record.id}/clone`;

    return this.httpClient.post(url, body);
  }
  /**
   * Returns the default business process name.  This is needed so that the UI can hide the
   * default name and show a blank for the very first time the business process is edited.
   *
   * @param id id of the business process.
   */
  public getDefaultName(id: string): string {
    const tranisentCreationData = this.defaultNamesForNewlyCreatedBusinessProcesses.get(
      id
    );
    if (tranisentCreationData && tranisentCreationData.initialDefaultName) {
      return tranisentCreationData.initialDefaultName;
    } else {
      return null;
    }
  }

  /**
   * Returns true if this id is for a newly created business id.  This can be used to
   * change the behavior of the UI.  For example: to show "Create" vs "Edit" in the
   * title, or to hide the default business process name.
   *
   * @param id id of the business process.
   */
  public isNewlyCreated(id: string): boolean {
    return this.defaultNamesForNewlyCreatedBusinessProcesses.has(id);
  }

  public get(id: string): Observable<BusinessProcessInterface> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    return this.httpClient.get<BusinessProcessInterface>(
      `/api/hub/business-processes/${id}`,
      {}
    );
  }

  public getBackground(id: string): Observable<BusinessProcessInterface> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    return this.httpClient.get<BusinessProcessInterface>(
      `/api/hub/business-processes/${id}/background`,
      {}
    );
  }

  public updateBackground(businessProcess: BusinessProcessInterface) {
    if (isIdParameterInvalid(businessProcess.id)) {
      return throwError(`Invalid ID: ${businessProcess.id}`);
    }
    return this.httpClient
      .put<BusinessProcessInterface>(
        `/api/hub/business-processes/${businessProcess.id}/background`,
        businessProcess
      )
      .pipe(
        // TODO: TIMF-4607 server should send a matching version response
        map(
          response =>
            ({
              id: response.id,
              version: response.version
            } as BaseDomainInterface)
        )
      );
  }

  public disableCreateBusinessProcesses(isCreating: boolean) {
    this._disableCreateBusinessProcesses$.next(isCreating);
  }

  public create(): Observable<BusinessProcessInterface> {
    this.disableCreateBusinessProcesses(true);
    return this.httpClient
      .post<BusinessProcessInterface>('/api/hub/business-processes', {})
      .pipe(
        tap(response => {
          this.defaultNamesForNewlyCreatedBusinessProcesses.set(response.id, {
            initialDefaultName: response.name
          });
          this.disableCreateBusinessProcesses(false);
        }),
        catchError(error => {
          this.disableCreateBusinessProcesses(false);
          return throwError(error);
        })
      );
  }

  public getContainsDataTransfers(
    entityIds: string[]
  ): Observable<BusinessProcessDataTransfersInterface[]> {
    if (!entityIds || 0 === entityIds.length) {
      return throwError(`entityIds are required`);
    }
    return this.httpClient.post<BusinessProcessDataTransfersInterface[]>(
      `/api/hub/business-processes/contains_data_transfers`,
      entityIds
    );
  }
}
