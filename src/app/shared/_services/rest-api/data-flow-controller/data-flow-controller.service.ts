import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { HttpUtilsService } from '../utils/utils.service';
import {
  GetItSystemEntityInterface,
  FindItSystemNodesRequestInterface,
  ItSystemNode,
  ItSystemNodeFilters,
  SendsDataTransfersInterface,
  ReceivesDataTransfersInterface,
  ItSystemDetailsNode,
  DataSubjectNode,
  DataRecipientNode,
  DataTransferNode,
  ProcessingPurposeItemResponseRawInterface,
  DataElementItemResponseRawInterface
} from 'src/app/shared/_interfaces';
import { CountryInterface } from 'src/app/shared/models/location.model';
import { DataFlowChartInterface } from 'projects/rhea-ui-library/src/lib/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataFlowControllerService {
  public allDataNodes: {
    locations: CountryInterface[];
    dataElements: DataElementItemResponseRawInterface[];
    processingPurposes: ProcessingPurposeItemResponseRawInterface[];
  };

  constructor(
    private httpClient: HttpClient,
    private httpUtilsService: HttpUtilsService
  ) {
    this.allDataNodes = {
      locations: [],
      dataElements: [],
      processingPurposes: []
    };
  }

  public getItSystems(
    businessProcessId: string,
    itSystemId: string
  ): Observable<GetItSystemEntityInterface> {
    return this.httpClient
      .get(
        `/api/hub/data-flows/it-system-entities/business-process-id/${businessProcessId}/entity-id/${itSystemId}`
      )
      .pipe(
        map(this.mapGetItSystems),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public addNewItSystemEntityToItSystem(
    businessProcessId: string,
    itSystemId: string
  ): Observable<GetItSystemEntityInterface> {
    return this.httpClient
      .post(
        `/api/hub/data-flows/it-system-entities/business-process-id/${businessProcessId}/entity-id/${itSystemId}`,
        ''
      )
      .pipe(
        map(this.mapGetItSystems),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public updateItSystemEntityFromDataFlow(
    businessProcessId: string,
    itSystemId: string,
    payload: GetItSystemEntityInterface
  ): Observable<GetItSystemEntityInterface> {
    return this.httpClient
      .put(
        `/api/hub/data-flows/it-system-entities/business-process-id/${businessProcessId}/entity-id/${itSystemId}`,
        payload
      )
      .pipe(
        map(this.mapGetItSystems),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public deleteItSystemEntityFromDataFlow(
    businessProcessId: string,
    itSystemId: string
  ): Observable<GetItSystemEntityInterface> {
    return this.httpClient
      .delete(
        `/api/hub/data-flows/it-system-entities/business-process-id/${businessProcessId}/entity-id/${itSystemId}`
      )
      .pipe(
        map(this.mapGetItSystems),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public findItSystemNodes(
    businessProcessId: string,
    body: FindItSystemNodesRequestInterface
  ): Observable<ItSystemNode[]> {
    return this.httpClient
      .post(
        `/api/hub/data-flows/it-system-nodes/business-process-id/${businessProcessId}`,
        body
      )
      .pipe(
        map(this.mapFindItSystemNodes),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public getItSystemNodeFilters(
    businessProcessId: string
  ): Observable<ItSystemNodeFilters> {
    return this.httpClient
      .get<any>(
        `api/hub/data-flows/it-system-nodes/business-process-id/${businessProcessId}/filters`
      )
      .pipe(
        map(this.mapGetItSystemNodeFilters),
        catchError(this.httpUtilsService.handleError),
        shareReplay(1)
      );
  }

  public getDataFlowMap(
    businessProcessId: string
  ): Observable<DataFlowChartInterface> {
    return this.httpClient
      .get<any>(
        `api/hub/data-flows/data-transfers-map/business-process-id/${businessProcessId}`
      )
      .pipe(
        map(this.mapGetDataFlowMap),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapGetItSystems(
    response: GetItSystemEntityInterface
  ): GetItSystemEntityInterface {
    return response;
  }

  private mapFindItSystemNodes(response: ItSystemNode[]): ItSystemNode[] {
    return response;
  }

  private mapGetItSystemNodeFilters(
    response: ItSystemNodeFilters
  ): ItSystemNodeFilters {
    return response;
  }

  public getTransfersSendingToSystem(
    businessProcessId: string,
    itSystemNodeId: string
  ) {
    return this.httpClient
      .get(
        `api/hub/data-flows/data-transfers-map/business-process-id/${businessProcessId}/it-system-node-id/${itSystemNodeId}/sends`
      )
      .pipe(
        map(this.mapTransfersSendingToSystem),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapTransfersSendingToSystem(
    response: SendsDataTransfersInterface
  ): SendsDataTransfersInterface {
    return response;
  }

  public getTransfersReceivingFromSystem(
    businessProcessId: string,
    itSystemNodeId: string
  ) {
    return this.httpClient
      .get(
        `api/hub/data-flows/data-transfers-map/business-process-id/${businessProcessId}/it-system-node-id/${itSystemNodeId}/receives`
      )
      .pipe(
        map(this.mapTransfersReceivingFromSystem),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public getItSystemNodeDetails(
    businessProcessId: string,
    blockId: string
  ): Observable<ItSystemDetailsNode> {
    return this.httpClient
      .get(
        `/api/hub/data-flows/data-transfers-map/business-process-id/${businessProcessId}/it-system-block-id/${blockId}`
      )
      .pipe(
        map(this.mapGetItSystemNodeDetails),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapGetItSystemNodeDetails(
    response: ItSystemDetailsNode
  ): ItSystemDetailsNode {
    return response;
  }

  public getDataSubjectNodeDetails(
    businessProcessId: string,
    blockId: string
  ): Observable<DataSubjectNode> {
    return this.httpClient
      .get(
        `/api/hub/data-flows/data-transfers-map/business-process-id/${businessProcessId}/data-subject-block-id/${blockId}`
      )
      .pipe(
        map(this.mapGetDataSubjectNodeDetails),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapGetDataSubjectNodeDetails(
    response: DataSubjectNode
  ): DataSubjectNode {
    return response;
  }

  public getDataRecipientNodeDetails(
    businessProcessId: string,
    blockId: string
  ): Observable<DataRecipientNode> {
    return this.httpClient
      .get(
        `/api/hub/data-flows/data-transfers-map/business-process-id/${businessProcessId}/data-recipient-block-id/${blockId}`
      )
      .pipe(
        map(this.mapGetDataRecipientNodeDetails),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapGetDataRecipientNodeDetails(
    response: DataRecipientNode
  ): DataRecipientNode {
    return response;
  }

  public getDataTransferDetails(
    businessProcessId: string,
    blockId: string
  ): Observable<DataTransferNode> {
    return this.httpClient
      .get(
        `/api/hub/data-flows/data-transfers-map/business-process-id/${businessProcessId}/edge-id/${blockId}`
      )
      .pipe(
        map(this.mapGetDataTransferDetails),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapGetDataTransferDetails(
    response: DataTransferNode
  ): DataTransferNode {
    return response;
  }

  private mapTransfersReceivingFromSystem(
    response: ReceivesDataTransfersInterface
  ): ReceivesDataTransfersInterface {
    return response;
  }

  public saveTransfersSendingToSystem(
    businessProcessId: string,
    itSystemNodeId: string,
    sendsDataTransfers: SendsDataTransfersInterface
  ) {
    return this.httpClient
      .put(
        `api/hub/data-flows/data-transfers-map/business-process-id/${businessProcessId}/it-system-node-id/${itSystemNodeId}/sends`,
        sendsDataTransfers
      )
      .pipe(
        map(this.mapTransfersSendingToSystem),
        catchError(this.httpUtilsService.handleError)
      );
  }

  public saveTransfersReceivingToSystem(
    businessProcessId: string,
    itSystemNodeId: string,
    receivesDataTransfers: ReceivesDataTransfersInterface
  ) {
    return this.httpClient
      .put(
        `api/hub/data-flows/data-transfers-map/business-process-id/${businessProcessId}/it-system-node-id/${itSystemNodeId}/receives`,
        receivesDataTransfers
      )
      .pipe(
        map(this.mapTransfersReceivingFromSystem),
        catchError(this.httpUtilsService.handleError)
      );
  }

  private mapGetDataFlowMap(
    response: DataFlowChartInterface
  ): DataFlowChartInterface {
    return response;
  }
}
