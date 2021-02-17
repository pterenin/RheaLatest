import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LocationInterface } from 'src/app/shared/models/location.model';
import { EdgeData } from './build-data-flow.model';
import { isIdParameterInvalid, exists } from 'src/app/shared/utils/basic-utils';

import { DataFlowSystemClass } from './data-flow-system.class';
declare const _: any;

@Injectable({
  providedIn: 'root'
})
export class DataFlowService implements OnDestroy {
  public locations: LocationInterface[];
  constructor(private httpClient: HttpClient) {}

  ngOnDestroy() {}

  public validateIdRequestParameter(id) {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
  }

  public handleError(error: Response | any) {
    return throwError(error);
  }

  public getDataFlow(bpId: string) {
    this.validateIdRequestParameter(bpId);
    return this.httpClient.get(`/api/hub/business-processes/${bpId}/data-flow`);
  }

  public getItSystemId(
    currentItSystemId: string,
    sendingOrReceivingEntityId: string,
    isSending: boolean,
    isItSystem: boolean
  ): string {
    if (isSending) {
      return currentItSystemId;
    } else {
      if (isItSystem) {
        return sendingOrReceivingEntityId;
      } else {
        return currentItSystemId;
      }
    }
  }

  public createEdge(
    bpId: string,
    currentItSystem,
    item,
    direction: 'sending' | 'receiving'
  ): Observable<any> {
    const request = {
      businessProcessId: bpId,
      sourceNodeId: direction === 'sending' ? currentItSystem.id : item.id,
      targetNodeId: direction === 'sending' ? item.id : currentItSystem.id,
      locationIds: item.locationIds,
      dataElementIds: item.dataElementIds,
      processingPurposeIds: item.processingPurposeIds,
      saleOfData: item.saleOfData
    };
    const sendingItsNodeId = this.getItSystemId(
      currentItSystem.id,
      item.id,
      direction === 'sending',
      item.isItSystem
    );
    if (item.isItSystem && direction === 'sending') {
      // if system to system transfer select location from source system
      request.locationIds = currentItSystem.locationIds;
    }

    this.validateIdRequestParameter(bpId);
    this.validateIdRequestParameter(sendingItsNodeId);

    return this.httpClient.post<EdgeData>(
      `/api/hub/data-flows/data-transfers/business-process-id/${bpId}/it-system-node-id/${sendingItsNodeId}`,
      request
    );
  }

  public updateEdge(
    bpId: string,
    item,
    newData: {
      locationIds: string[];
      dataElementIds: string[];
      processingPurposeIds: string[];
      saleOfData: boolean;
    },
    edge
  ) {
    const request = {
      businessProcessId: bpId,
      sourceNodeId: edge.sourceNodeId,
      targetNodeId: edge.targetNodeId,
      edgeId: item.edgeId,
      locationIds: newData.locationIds,
      dataElementIds: newData.dataElementIds,
      processingPurposeIds: newData.processingPurposeIds,
      saleOfData: newData.saleOfData
    };

    this.validateIdRequestParameter(bpId);
    return this.httpClient.put<EdgeData>(
      `/api/hub/data-flows/data-transfers/business-process-id/${bpId}`,
      request
    );
  }

  public getEdge(bpId: string, currentItSystemId: string, edgeId: string) {
    return this.httpClient.get(
      `/api/hub/data-flows/data-transfers/business-process-id/${bpId}/edge-id/${edgeId}`
    );
  }

  public deleteEdge(bpId: string, edgeId: string): Observable<any> {
    return this.httpClient.delete(
      `/api/hub/data-flows/data-transfers/business-process-id/` +
        `${bpId}/edge-id/${edgeId}`
    );
  }

  public deleteAllEdges(bpId: string, edgeIds: string[]): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: edgeIds
    };
    return this.httpClient.delete(
      `/api/hub/data-flows/data-transfers/business-process-id/${bpId}`,
      httpOptions
    );
  }

  private setTypeBooleans(response) {
    response.isNodes = response.isNodes.map(node => {
      node.isItSystem = true;
      return node;
    });

    response.dstNodes = response.dstNodes.map(node => {
      node.isDsOrDr = true;
      return node;
    });

    response.drtNodes = response.drtNodes.map(node => {
      node.isDsOrDr = true;
      return node;
    });
    return response;
  }

  public getCountryCode(id: string) {
    const locationFound = this.locations.find(
      (location: LocationInterface) => location.id === id
    );

    return exists(locationFound) ? locationFound.country.threeLetterCode : '';
  }

  public getTwoLetterCodeFromThreeLetterCode(threeLetterCode: string) {
    const locationFound = this.locations.find((location: LocationInterface) => {
      return (
        location &&
        location.country &&
        location.country.threeLetterCode &&
        threeLetterCode &&
        location.country.threeLetterCode === threeLetterCode
      );
    });

    return locationFound ? locationFound.country.twoLetterCode : '';
  }

  private addLocationCodes(nodes) {
    return nodes.map(node => ({
      ...node,
      location: this.getCountryCode(node.locationId)
    }));
  }

  public mapItSystemsForBp(dataFlow, newUI?): any[] {
    const hasNodes = dataFlow.isNodes && dataFlow.isNodes[0];
    const hasNoLocationIds =
      hasNodes &&
      (!dataFlow.isNodes[0].locationIds ||
        dataFlow.isNodes[0].locationIds.length === 0);

    if (hasNodes && hasNoLocationIds) {
      dataFlow.isNodes.map(node => {
        node.locationIds = [node.locationId];
        return node;
      });
    }

    dataFlow.drtNodes = this.addLocationCodes(dataFlow.drtNodes);
    dataFlow.dstNodes = this.addLocationCodes(dataFlow.dstNodes);
    dataFlow.isNodes = this.addLocationCodes(dataFlow.isNodes);
    this.setTypeBooleans(dataFlow);
    const drtNodes = newUI ? dataFlow.dataRecipients : dataFlow.drtNodes;
    const itSystems: any = dataFlow.isNodes.map(itSystem => {
      const dstNodes = newUI
        ? this.addLocationCodes(itSystem.dataSubjects)
        : dataFlow.dstNodes;
      if (newUI) {
        dataFlow.dstNodes.push(dstNodes);
      }
      const locations =
        itSystem.locationIds.map(location => this.getCountryCode(location)) ||
        [];

      return new DataFlowSystemClass(
        itSystem,
        dataFlow,
        drtNodes,
        dstNodes,
        this.locations
      );
    });

    return itSystems;
  }

  public setLocationsAndSyncMapState(locations: LocationInterface[]) {
    this.locations = locations;
  }
}
