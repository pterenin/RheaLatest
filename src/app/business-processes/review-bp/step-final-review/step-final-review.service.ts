import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BusinessProcessService } from 'src/app/shared/services/business-process/business-process.service';
import { BusinessProcessInterface } from '../../create-bp/create-business-processes.model';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';
import { multicastInProgressState } from 'src/app/shared/utils/rxjs-utils';
import { ReviewTableRowInterface } from './review-table/review-table.component';
import {
  AssociationInterface,
  ProcessingPurposeInterface,
  BusinessProcessApprovalUpdateResponseInterface,
  BusinessProcessApprovalUpdateInterface
} from 'src/app/shared/_interfaces';

import {
  LegalBasisInterface,
  ReviewTableLegalBasisResponse,
  ReviewTableRowResponseInterface
} from './review-models';

import { BusinessProcessControllerService } from 'src/app/shared/_services/rest-api';

declare const _: any;

@Injectable({
  providedIn: 'root'
})
export class StepFinalReviewService {
  // TODO: TIMF-4601 generalize this feature to track any process status.
  private isUpdatingSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public getIsUpdatingSubject(): BehaviorSubject<boolean> {
    return this.isUpdatingSubject;
  }

  constructor(
    private httpClient: HttpClient,
    private businessProcessService: BusinessProcessService,
    private businessProcessControllerService: BusinessProcessControllerService
  ) {}

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

  public getApproval(
    businessProcessId: string
  ): Observable<ReviewTableRowResponseInterface> {
    const approvals$ = this.businessProcessControllerService.getApprovalById(
      businessProcessId
    );

    const legalBasis$ = this.httpClient.get<LegalBasisInterface[]>(
      '/api/hub/legal-bases'
    );

    return approvals$.pipe(
      withLatestFrom(legalBasis$),
      map(([approval, legalBasisArray]) => {
        return {
          id: approval.id,
          version: approval.version,
          name: approval.name,
          identifier: approval.identifier,
          status: approval.status,
          dataRows: this.mapReviewTableRowInterfaceArray(
            approval.processingPurposes,
            legalBasisArray,
            approval.associations
          ),
          legalBasisRows: legalBasisArray
        };
      })
    );
  }

  public getLegalBasisOptions(): Observable<
    Array<ReviewTableLegalBasisResponse>
  > {
    return this.httpClient.get<Array<ReviewTableLegalBasisResponse>>(
      '/api/hub/legal-bases'
    );
  }

  mapReviewTableRowInterfaceArray(
    processingPurposeArray: ProcessingPurposeInterface[],
    legalBasisArray: LegalBasisInterface[],
    associationArray: AssociationInterface[]
  ): Array<ReviewTableRowInterface> {
    const ppMappedAssociatedArray = processingPurposeArray.map(pp => {
      const ppMapped: ReviewTableRowInterface = {
        category: pp.category.replace(/([a-z])([A-Z])/g, '$1 $2'),
        processingPurpose: pp.name,
        processingPurposeId: pp.id,
        isCustom: pp.isCustom,
        isCategoryCustom: pp.isCategoryCustom,
        legalBasis: {
          label: null,
          id: null
        }
      };

      const isAssociation = associationArray.find(
        asc => asc.processingPurposeId === pp.id
      );
      if (isAssociation) {
        const isLegalBasis = legalBasisArray.find(
          lb => lb.id === isAssociation.legalBasisId
        );
        if (isLegalBasis) {
          ppMapped.legalBasis.id = isLegalBasis.id;
          ppMapped.legalBasis.label = isLegalBasis.shortName;
        }
      }
      return ppMapped;
    });
    return ppMappedAssociatedArray;
  }

  /**
   * Mapped legal basis and processing purposes into object of association for PUT requests
   */
  mapProcessingPurposesAssociations(
    rows: ReviewTableRowInterface[]
  ): AssociationInterface[] | null {
    return rows
      .map(pp => {
        return {
          legalBasisId: pp.legalBasis.id,
          processingPurposeId: pp.processingPurposeId
        };
      })
      .filter(association => association.legalBasisId !== null);
  }

  public saveBusinessProcessApproval(
    ProcessingPurposesWithLegalBasis: ReviewTableRowInterface[],
    recordStatus: string,
    id: string,
    version: number,
    businessProcessId: string
  ): Observable<BusinessProcessApprovalUpdateResponseInterface> {
    const payload: BusinessProcessApprovalUpdateInterface = {
      associations: this.mapProcessingPurposesAssociations(
        ProcessingPurposesWithLegalBasis
      ),
      id: id,
      status: recordStatus,
      version: version
    };

    return this.businessProcessControllerService.updateApproval(
      payload,
      businessProcessId
    );
  }
}
