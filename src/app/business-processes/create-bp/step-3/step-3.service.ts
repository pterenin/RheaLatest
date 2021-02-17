import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { multicastInProgressState } from 'src/app/shared/utils/rxjs-utils';
import { isIdParameterInvalid } from 'src/app/shared/utils/basic-utils';
import { flatMap } from 'rxjs/operators';
import { LocationService } from 'src/app/shared/services/location/location.service';
import { Item } from 'src/app/shared/components/categorical-view/item-model';
import { DataSubjectsRecipientsService } from 'src/app/shared/services/data-subjects-recipients/data-subjects-recipients.service';
import { LocationInterface } from 'src/app/shared/models/location.model';
import {
  DataElementsInterface,
  DataFlowNode,
  DataFlowResponse,
  DataNodeInterface,
  DataRecipientNode,
  DataSubjectNode,
  DataSubjectRecipentPayload,
  dataType,
  RequestConfig
} from './step-3.model';

declare const _: any;

@Injectable({
  providedIn: 'root'
})
export class Step3Service {
  private isUpdatingSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  private locations: LocationInterface[];

  constructor(
    private httpClient: HttpClient,
    private locationService: LocationService,
    private dataSubjectRecipientService: DataSubjectsRecipientsService
  ) {}

  public setLocations(locations) {
    this.locations = locations;
  }

  private makeItemWithLocationId(item, locations, type: dataType) {
    const mappedCountries = item.locationIds.map(id => {
      const record = locations.find(location => location.id === id);
      if (record) {
        return record.country;
      } else {
        // This will prevent exception if record is undefined
        console.error('No location record found');
        return '';
      }
    });

    return {
      ...item,
      type,
      mappedCountries
    };
  }

  public getIsUpdatingSubject(): BehaviorSubject<boolean> {
    return this.isUpdatingSubject;
  }

  public getSavedNodes(businessProcessId: string) {
    if (isIdParameterInvalid(businessProcessId)) {
      return throwError(`Invalid ID: ${businessProcessId}`);
    }

    return forkJoin([
      this.httpClient.get(
        `/api/hub/data-flows/data-subject-types/business-process-id/${businessProcessId}/all`,
        {}
      ),
      this.httpClient.get(
        `/api/hub/data-flows/data-recipient-types/business-process-id/${businessProcessId}/all`,
        {}
      )
    ]).pipe(
      flatMap(
        ([dataSubjectNodes, dataRecipientNodes]: [
          DataFlowResponse<DataSubjectNode>,
          DataFlowResponse<DataRecipientNode>
        ]) => {
          const dataRecipientData = dataRecipientNodes.dataFlowNodes.map(
            recipient =>
              this.makeItemWithLocationId(
                recipient,
                this.locations,
                'Data Recipient'
              )
          );

          const dataSubjectData = dataSubjectNodes.dataFlowNodes.map(subject =>
            this.makeItemWithLocationId(subject, this.locations, 'Data Subject')
          );
          return of([dataSubjectData, dataRecipientData]);
        }
      )
    );
  }

  public updateNodes(
    dsDrSelectedItems: DataNodeInterface[],
    businessProcessId: string,
    type: dataType,
    nodeInfo: Item[],
    selectedDataElements: DataElementsInterface[],
    isEdit: boolean
  ) {
    const dataElementIds: string[] = [];
    selectedDataElements.forEach(dataElement =>
      dataElement.items.forEach(item => dataElementIds.push(item.id))
    );

    const endpointPart =
      type === 'Data Subject' ? 'data-subject-types' : 'data-recipient-types';
    if (isIdParameterInvalid(businessProcessId)) {
      return throwError(`Invalid ID: ${businessProcessId}`);
    }

    const threeLetterCodes = nodeInfo.map(item => item.location);

    const fullSaveObservable = this.generateLocations(threeLetterCodes).pipe(
      flatMap(countryLocations => {
        const nodeId = nodeInfo[0].id;
        let nodeUpdate = null;
        // Update locationIds when edit or add new same Subject
        dsDrSelectedItems.map(subject => {
          const isSameDsDrNode =
            isEdit && subject.nodeId === nodeId && subject.subItem === type;

          if (isSameDsDrNode) {
            nodeUpdate = subject;
          }
        });

        // Update Data Element ID in the case add same Subject
        if (nodeUpdate && type === 'Data Subject') {
          dataElementIds.map(dataElementId => {
            const dataElementExists = nodeUpdate.dataElementIds.includes(
              dataElementId
            );
            if (!dataElementExists) {
              nodeUpdate.dataElementIds.push(dataElementId);
            }
          });
        }

        const request = this.generatePayload(
          businessProcessId,
          type,
          nodeInfo,
          countryLocations,
          dataElementIds
        );

        if (nodeUpdate && isEdit) {
          request[0].nodeId = nodeUpdate.nodeId;
        }

        return request;
      }),
      flatMap(request => {
        if (request.nodeId) {
          return this.httpClient
            .put(
              `/api/hub/data-flows/${endpointPart}/business-process-id/${businessProcessId}/v2`,
              request
            )
            .pipe(flatMap(res => of([request])));
        } else {
          return this.httpClient.post(
            `/api/hub/data-flows/${endpointPart}/business-process-id/${businessProcessId}`,
            [request]
          );
        }
      }),
      flatMap((response: DataFlowNode[]) => {
        if (response) {
          const items = response.map(node =>
            this.makeItemWithLocationId(node, this.locations, type)
          );
          return of(items);
        } else {
          return of([true]);
        }
      })
    );

    return multicastInProgressState(fullSaveObservable, this.isUpdatingSubject);
  }

  private generatePayload(
    businessProcessId: string,
    type: dataType,
    items: Item[],
    countryLocationMap: Array<{ locationId: string; countryCode: string }>,
    dataElementIds: string[]
  ) {
    const config = this.configureRequestBuilder(type);
    let payload: DataSubjectRecipentPayload[];

    const { label } = items[0];

    const filterParam = item =>
      item.dataSubjectType === label || item.dataRecipientType === label;

    const match = config.dataList.filter(cat => {
      return cat.items.filter(item => filterParam(item))[0];
    })[0];

    const entityId = match.items.filter(item => filterParam(item))[0].id;

    payload = [
      {
        businessProcessId,
        category: match.label,
        entityId,
        ...(type === 'Data Subject'
          ? { dataSubjectType: label }
          : { dataRecipientType: label }),
        locationIds: countryLocationMap.map(country => country.locationId),
        dataElementIds
      }
    ];

    return payload;
  }

  private generateLocations(
    countryCodes: string[]
  ): Observable<Array<{ locationId: string; countryCode: string }>> {
    const twoLetterCodes = countryCodes.map(code =>
      this.locationService.getCountryIdByThreeLetterCode(code)
    );

    const filteredLocations = this.locations.filter(item =>
      twoLetterCodes.includes(item.id)
    );

    return of(
      filteredLocations.map(item => ({
        locationId: item.id,
        countryCode: item.country.threeLetterCode
      }))
    );
  }

  private configureRequestBuilder(type: dataType): RequestConfig {
    return type === 'Data Subject'
      ? {
          accessor: 'dataSubjectType',
          dataList: this.dataSubjectRecipientService.fullDataSubjectList
        }
      : {
          accessor: 'dataRecipientType',
          dataList: this.dataSubjectRecipientService.fullDataRecipientList
        };
  }

  public deleteNode(
    businessProcessId: string,
    nodeId: string,
    type: dataType
  ): Observable<any> {
    const itemType =
      type === 'Data Subject' ? 'data-subject-type' : 'data-recipient-type';
    if (isIdParameterInvalid(businessProcessId)) {
      return throwError(`Invalid ID: ${businessProcessId}`);
    }
    const deletionObservable = this.httpClient.delete(
      `/api/hub/data-flows/${itemType}s/business-process-id/${businessProcessId}/node-id/${nodeId}`,
      {}
    );

    return multicastInProgressState(deletionObservable, this.isUpdatingSubject);
  }

  public deleteGroupNode(
    businessProcessId: string,
    nodeId: string,
    type: dataType
  ): Observable<any> {
    const itemType =
      type === 'Data Subject' ? 'data-subject-type' : 'data-recipient-type';
    if (isIdParameterInvalid(businessProcessId)) {
      return throwError(`Invalid ID: ${businessProcessId}`);
    }
    const deletionObservable = this.httpClient.delete(
      `/api/hub/data-flows/${itemType}s/business-process-id/${businessProcessId}/node-id/${nodeId}`,
      {}
    );

    return multicastInProgressState(deletionObservable, this.isUpdatingSubject);
  }

  public deleteAllNodes(
    businessProcessId: string,
    type: dataType
  ): Observable<any> {
    const itemType =
      type === 'Data Subject' ? 'data-subject-type' : 'data-recipient-type';
    if (isIdParameterInvalid(businessProcessId)) {
      return throwError(`Invalid ID: ${businessProcessId}`);
    }
    const deletionObservable = this.httpClient.delete(
      `/api/hub/data-flows/${itemType}s/business-process-id/${businessProcessId}`,
      {}
    );

    return multicastInProgressState(deletionObservable, this.isUpdatingSubject);
  }
}
