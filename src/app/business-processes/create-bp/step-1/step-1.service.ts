import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BusinessProcessInterface } from '../create-business-processes.model';
import { multicastInProgressState } from 'src/app/shared/utils/rxjs-utils';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { TagGroupInterface } from 'src/app/shared/models/tags.model';
import { BusinessProcessService } from 'src/app/shared/services/business-process/business-process.service';
import { DataSubjectVolumeInterface } from './step-1.model';

declare const _: any;

@Injectable()
export class Step1Service {
  // TODO: TIMF-4601 generalize this feature to track any process status.
  private isUpdatingSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public getIsUpdatingSubject(): BehaviorSubject<boolean> {
    return this.isUpdatingSubject;
  }

  constructor(
    private httpClient: HttpClient,
    private businessProcessService: BusinessProcessService
  ) {}

  public getBusinessProcess(id: string): Observable<BusinessProcessInterface> {
    return this.businessProcessService.getBackground(id);
  }
  public getAllBusinessProcessTags(): Observable<TagGroupInterface[]> {
    return this.httpClient.get<TagGroupInterface[]>(
      `/api/hub/tags/business-processes`,
      {}
    );
  }

  public getDataSubjectVolumes(): Observable<DataSubjectVolumeInterface[]> {
    return this.httpClient.get<DataSubjectVolumeInterface[]>(
      `/api/hub/data-subject-volumes`,
      {}
    );
  }

  public updateBusinessProcess(
    businessProcess: BusinessProcessInterface
  ): Observable<BaseDomainInterface> {
    const id = businessProcess.id;
    businessProcess.name = businessProcess.name
      ? businessProcess.name.trim()
      : '';

    return multicastInProgressState(
      this.businessProcessService.updateBackground(businessProcess),
      this.isUpdatingSubject
    );
  }
}
