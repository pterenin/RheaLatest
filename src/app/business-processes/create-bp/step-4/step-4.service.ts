import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, forkJoin, Observable, throwError } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { CreateBusinessProcessesService } from '../create-business-processes.service';
import { LocationService } from 'src/app/shared/services/location/location.service';

import {
  ItSystemDataFlowSaveRequest,
  DataFlowItSystemResponse
} from './step-4.model';

import { LocationInterface } from 'src/app/shared/models/location.model';

import { ItSystemInterface } from '../create-business-processes.model';

import { exists, isIdParameterInvalid } from 'src/app/shared/utils/basic-utils';

export interface ItSystemDataFlow {
  dataElementIds: string[];
  processingPurposeIds: [];
  saleOfData: true;
  sourceEntityId: string;
  sourceLocationId: string;
  targetEntityId: string;
  targetLocationId: string;
}

export interface ItSystemDataFlowRequest {
  locationIds?: string[];
  locations?: LocationInterface[];
  businessProcessId: string;
  category: string;
  dataElementIds: string[];
  description: string;
  entityId: string;
  dataSubjectTypeToItSystemDataTransfers: ItSystemDataFlow[];
  itSystemToDataRecipientTypeDataTransfers: ItSystemDataFlow[];
  itSystemToItSystemDataTransfers: ItSystemDataFlow[];
  locationId: string;
  name: string;
  notes: string;
  processingPurposeIds: string[];
  role: string;
  nodeId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Step4Service {
  private locations: LocationInterface[];

  constructor(
    private httpClient: HttpClient,
    private createBusinessProcessesService: CreateBusinessProcessesService,
    private locationService: LocationService
  ) {}

  public getSavedItSystemNodes(businessProcessId: string) {
    if (isIdParameterInvalid(businessProcessId)) {
      return throwError(`Invalid ID: ${businessProcessId}`);
    }

    const url = `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}/all`;
    return this.httpClient.get(url).pipe(
      flatMap(
        (response: DataFlowItSystemResponse<ItSystemDataFlowRequest[]>) => {
          const items = response.dataFlowNodes.map(node =>
            this.convertToDSDRItem(node)
          );
          return of(items);
        }
      )
    );
  }

  public getSavedItSystemNode(businessProcessId: string, itSystemId: string) {
    if (isIdParameterInvalid(businessProcessId)) {
      return throwError(`Invalid ID: ${businessProcessId}`);
    }
    if (isIdParameterInvalid(itSystemId)) {
      return throwError(`Invalid ID: ${itSystemId}`);
    }

    return this.httpClient.get<any[]>(
      `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}/it-system-id/${itSystemId}`
    );
  }

  public generateLocations(
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

  private convertToDSDRItem(item) {
    return {
      entityId: item.entityId,
      hidden: false,
      id: item.entityId,
      isCustom: undefined,
      isDsOrDr: true,
      isItSystem: true,
      label: item.name,
      location: item.locationIds.length.toString(),
      locationId: item.locationId,
      locationIds: item.locationIds,
      locations: item.locations ? item.locations : [],
      nodeId: item.nodeId,
      receiverId: null,
      selected: false,
      senderId: null,
      subItem: null,
      tag: item.category,
      unReselectable: null
    };
  }

  public setLocations(locations) {
    this.locations = locations;
  }

  public getLocations() {
    return this.locations;
  }

  public getItSystemLocationData(
    itSystemData: ItSystemInterface
  ): Observable<any> {
    const propertiesObservable = this.createBusinessProcessesService.getItSystemProperties(
      itSystemData.id,
      this.locations
    );

    const countryListObservable = this.locationService.getFullCountryList();

    return forkJoin([propertiesObservable, countryListObservable]).pipe(
      flatMap(([properties, regions]) => {
        const selectableCountries = itSystemData['locationId']
          ? properties.locations.filter(
              location => location.id === itSystemData['locationId']
            )
          : properties.locations;

        const selectableCountryIds = selectableCountries.map(
          location => location.countryId
        );

        const getSelectablesOf = region => {
          const regionCountryIds = region.countries.map(country => country.id);

          return regionCountryIds.filter(id =>
            selectableCountryIds.includes(id)
          );
        };

        const categorizedSelectables = !exists(regions)
          ? []
          : regions
              .filter(region => {
                return 0 < getSelectablesOf(region).length;
              })
              .map(region => {
                const selectables = getSelectablesOf(region);
                const countries = region.countries.filter(country =>
                  selectables.includes(country.id)
                );

                return {
                  ...region,
                  countries: countries.map(country => ({
                    ...country,
                    selected: true
                  }))
                };
              });

        return of([properties, categorizedSelectables]);
      })
    );
  }

  public updateItSystemNode(
    businessProcessId: string,
    itSystemNode: ItSystemDataFlowRequest
  ) {
    if (isIdParameterInvalid(businessProcessId)) {
      return throwError(`Invalid ID: ${businessProcessId}`);
    }

    return this.httpClient.put(
      `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}/v2`,
      itSystemNode
    );
  }

  public saveItSystemNode(
    businessProcessId: string,
    itSystemNode: ItSystemDataFlowSaveRequest[]
  ): Observable<any> {
    if (isIdParameterInvalid(businessProcessId)) {
      return throwError(`Invalid ID: ${businessProcessId}`);
    }

    const saveRequest = this.httpClient.post(
      `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}`,
      itSystemNode
    );

    return saveRequest.pipe(
      flatMap((response: ItSystemDataFlowRequest[]) => {
        const items = response.map(node => {
          node.locations = node.locations || [];

          node.locationIds.forEach(id => {
            this.locations.forEach(location => {
              if (location.id === id) {
                node.locations.push(location);
              }
            });
          });

          return this.convertToDSDRItem(node);
        });

        return of(items);
      })
    );
  }

  public findAllDataTransfersByBPIdAndNodeId(
    businessProcessId: string,
    nodeId: string
  ) {
    if (isIdParameterInvalid(businessProcessId)) {
      return throwError(`Invalid ID: ${businessProcessId}`);
    }
    if (isIdParameterInvalid(nodeId)) {
      return throwError(`Invalid ID: ${nodeId}`);
    }

    return this.httpClient.get(
      `/api/hub/data-flows/data-transfers/business-process-id/${businessProcessId}/it-system-node-id/${nodeId}`,
      {}
    );
  }

  public deleteNode(
    businessProcessId: string,
    nodeId: string
  ): Observable<any> {
    if (isIdParameterInvalid(businessProcessId)) {
      return throwError(`Invalid ID: ${businessProcessId}`);
    }
    if (isIdParameterInvalid(nodeId)) {
      return throwError(`Invalid ID: ${nodeId}`);
    }

    return this.httpClient.delete(
      `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}/node-id/${nodeId}`,
      {}
    );
  }

  public deleteAllNodes(businessProcessId: string): Observable<any> {
    if (isIdParameterInvalid(businessProcessId)) {
      return throwError(`Invalid ID: ${businessProcessId}`);
    }

    return this.httpClient.delete(
      `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}`,
      {}
    );
  }
}
