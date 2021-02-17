import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Step4Service } from './step-4.service';
import { TaToastModule } from '@trustarc/ui-toolkit';
import { LocationService } from '../../../shared/services/location/location.service';
import { CreateBusinessProcessesService } from '../create-business-processes.service';
import { of } from 'rxjs';

describe('Step4Service', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([{ path: '**', redirectTo: '' }]),
        TaToastModule
      ]
    })
  );

  it('should be created', () => {
    const service: Step4Service = TestBed.get(Step4Service);
    expect(service).toBeTruthy();
  });

  describe('getSavedItSystemNode()', () => {
    it('should call - no errors', inject(
      [HttpTestingController, Step4Service],
      (httpMock: HttpTestingController, service: Step4Service) => {
        const businessProcessId = '00000000-0000-0000-0000-000000000000';
        const itSystemId = '00000000-0000-0000-0000-000000000001';
        service.getSavedItSystemNode(businessProcessId, itSystemId).subscribe(
          data => {
            expect(Array.isArray(data)).toBeTruthy();
            expect(data.length).toEqual(1);
          },
          err => {
            expect(err).toBeNull();
          }
        );
        const expectedUrl = `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}/it-system-id/${itSystemId}`;
        const req = httpMock.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        expect(req.request.urlWithParams).toEqual(expectedUrl);
        expect(req.request.responseType).toEqual('json');
        expect(req.request.body).toEqual(null);
        req.flush([{ data: 'data' }]);
      }
    ));
    it('should call and throw error if invalid parameter "businessProcessId"', inject(
      [HttpTestingController, Step4Service],
      (httpMock: HttpTestingController, service: Step4Service) => {
        const businessProcessId = '00000000-0000-0000-0000_000000000000';
        const itSystemId = '00000000-0000-0000-0000-000000000001';
        service.getSavedItSystemNode(businessProcessId, itSystemId).subscribe(
          data => {
            expect(data).toBeNull();
          },
          err => {
            expect(err).toContain(`Invalid ID: ${businessProcessId}`);
          }
        );
        const expectedUrl = `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}/it-system-id/${itSystemId}`;
        httpMock.expectNone(expectedUrl);
      }
    ));
    it('should call and throw error if invalid parameter "itSystemId"', inject(
      [HttpTestingController, Step4Service],
      (httpMock: HttpTestingController, service: Step4Service) => {
        const businessProcessId = '00000000-0000-0000-0000-000000000000';
        const itSystemId = '00000000-0000-0000-0000_000000000001';
        service.getSavedItSystemNode(businessProcessId, itSystemId).subscribe(
          data => {
            expect(data).toBeNull();
          },
          err => {
            expect(err).toContain(`Invalid ID: ${itSystemId}`);
          }
        );
        const expectedUrl = `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}/it-system-id/${itSystemId}`;
        httpMock.expectNone(expectedUrl);
      }
    ));

    afterEach(inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        httpMock.verify();
      }
    ));
  });

  describe('getSavedItSystemNodes()', () => {
    it('should call - no errors', inject(
      [HttpTestingController, Step4Service],
      (httpMock: HttpTestingController, service: Step4Service) => {
        const businessProcessId = '00000000-0000-0000-0000-000000000000';
        service.getSavedItSystemNodes(businessProcessId).subscribe(
          data => {
            expect(Array.isArray(data)).toBeTruthy();
            expect(data.length).toEqual(1);
          },
          err => {
            expect(err).toBeNull();
          }
        );
        const expectedUrlOne = `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}/all`;

        const reqOne = httpMock.expectOne(expectedUrlOne);

        expect(reqOne.request.method).toEqual('GET');
        expect(reqOne.request.urlWithParams).toEqual(expectedUrlOne);
        expect(reqOne.request.responseType).toEqual('json');
        expect(reqOne.request.body).toEqual(null);

        reqOne.flush({
          dataFlowNodes: [
            {
              entityId: 'entityId',
              name: 'name',
              locationIds: [],
              locationId: 'locationId',
              locations: 'locations',
              nodeId: 'nodeId',
              category: 'category'
            }
          ]
        });
      }
    ));
    it('should call and throw error if invalid parameter "businessProcessId"', inject(
      [HttpTestingController, Step4Service],
      (httpMock: HttpTestingController, service: Step4Service) => {
        const businessProcessId = '00000000-0000-0000-0000_000000000000';
        service.getSavedItSystemNodes(businessProcessId).subscribe(
          data => {
            expect(data).toBeNull();
          },
          err => {
            expect(err).toContain(`Invalid ID: ${businessProcessId}`);
          }
        );
        const expectedUrlOne = `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}/all`;
        const expectedUrlTwo = '/api/hub/locations';

        httpMock.expectNone(expectedUrlOne);
        httpMock.expectNone(expectedUrlTwo);
      }
    ));

    afterEach(inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        httpMock.verify();
      }
    ));
  });

  describe('generateLocations()', () => {
    it('should call - no errors', inject(
      [Step4Service, LocationService],
      (service: Step4Service, locationService: LocationService) => {
        const countryCodes = ['CODE1', 'CODE2'];
        const locations = [
          {
            id: 'CODE1',
            country: {
              id: 'CODE1',
              threeLetterCode: 'CO1'
            },
            globalRegionId: null,
            stateOrProvinceId: null,
            version: 0
          },
          {
            id: 'CODE2',
            country: {
              id: 'CODE2',
              threeLetterCode: 'CO2'
            },
            globalRegionId: null,
            stateOrProvinceId: null,
            version: 0
          }
        ];
        spyOn(locationService, 'getCountryIdByThreeLetterCode').and.returnValue(
          'CODE1'
        );
        service.setLocations(locations);
        service.generateLocations(countryCodes).subscribe(
          data => {
            const [first] = data;
            expect(Array.isArray(data)).toBeTruthy();
            expect(data.length).toEqual(1);
            expect(typeof first).toBe('object');
            expect(first).toEqual(
              jasmine.objectContaining({
                locationId: 'CODE1',
                countryCode: 'CO1'
              })
            );
          },
          err => {
            expect(err).toBeNull();
          }
        );
      }
    ));
  });

  describe('getItSystemLocationData()', () => {
    it('should call - no errors', inject(
      [Step4Service, LocationService, CreateBusinessProcessesService],
      (
        service: Step4Service,
        locationService: LocationService,
        createBusinessProcessesService: CreateBusinessProcessesService
      ) => {
        const itSystemData = {
          id: 'id',
          label: 'label',
          tag: 'tag',
          version: 0,
          isSelected: false,
          locations: [],
          unReselectable: false,
          nodeId: 'nodeId'
        };
        const properties = {
          locations: [
            { id: 'id1', countryId: 'countryId1' },
            { id: 'id2', countryId: 'countryId2' }
          ]
        };
        const regions = [
          {
            countries: [{ id: 'id1' }, { id: 'id2' }]
          }
        ];
        spyOn(
          createBusinessProcessesService,
          'getItSystemProperties'
        ).and.returnValue(of(properties));
        spyOn(locationService, 'getFullCountryList').and.returnValue(
          of(regions)
        );
        service.getItSystemLocationData(itSystemData).subscribe(
          data => {
            const [resProperties, resCategorizedSelectables] = data;
            expect(resProperties).toEqual(
              jasmine.objectContaining({
                locations: [
                  {
                    id: 'id1',
                    countryId: 'countryId1'
                  },
                  {
                    id: 'id2',
                    countryId: 'countryId2'
                  }
                ]
              })
            );
            expect(resCategorizedSelectables).toEqual(
              jasmine.objectContaining([])
            );
          },
          err => {
            expect(err).toBeNull();
          }
        );
      }
    ));
  });

  describe('updateItSystemNode()', () => {
    it('should call - no errors', inject(
      [HttpTestingController, Step4Service],
      (httpMock: HttpTestingController, service: Step4Service) => {
        const businessProcessId = '00000000-0000-0000-0000-000000000000';
        const itSystemNode = {
          dataElementIds: [],
          locationId: 'locationId',
          locationIds: ['id1', 'id2'],
          processingPurposeIds: [],
          entityId: 'entityId',
          name: 'name',
          businessProcessId: 'businessProcessId',
          notes: 'notes',
          description: 'description',
          dataSubjectTypeToItSystemDataTransfers: [],
          itSystemToDataRecipientTypeDataTransfers: [],
          itSystemToItSystemDataTransfers: [],
          role: 'role',
          category: 'category',
          nodeId: 'nodeId'
        };
        service.updateItSystemNode(businessProcessId, itSystemNode).subscribe(
          data => {
            expect(data).toEqual(itSystemNode);
          },
          err => {
            expect(err).toBeNull();
          }
        );
        const expectedUrl = `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}/v2`;
        const req = httpMock.expectOne(expectedUrl);

        expect(req.request.method).toEqual('PUT');
        expect(req.request.urlWithParams).toEqual(expectedUrl);
        expect(req.request.responseType).toEqual('json');
        expect(req.request.body).toEqual(itSystemNode);

        req.flush(itSystemNode);
      }
    ));
    it('should call and throw error if invalid parameter "businessProcessId"', inject(
      [HttpTestingController, Step4Service],
      (httpMock: HttpTestingController, service: Step4Service) => {
        const businessProcessId = '00000000-0000-0000-0000_000000000000';
        const itSystemNode = {
          dataElementIds: [],
          locationId: 'locationId',
          locationIds: ['id1', 'id2'],
          processingPurposeIds: [],
          entityId: 'entityId',
          name: 'name',
          businessProcessId: 'businessProcessId',
          notes: 'notes',
          description: 'description',
          dataSubjectTypeToItSystemDataTransfers: [],
          itSystemToDataRecipientTypeDataTransfers: [],
          itSystemToItSystemDataTransfers: [],
          role: 'role',
          category: 'category',
          nodeId: 'nodeId'
        };
        service.updateItSystemNode(businessProcessId, itSystemNode).subscribe(
          data => {
            expect(data).toBeNull();
          },
          err => {
            expect(err).toContain(`Invalid ID: ${businessProcessId}`);
          }
        );
        const expectedUrl = `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}/v2`;
        httpMock.expectNone(expectedUrl);
      }
    ));

    afterEach(inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        httpMock.verify();
      }
    ));
  });

  describe('saveItSystemNode()', () => {
    it('should call - no errors', inject(
      [HttpTestingController, Step4Service],
      (httpMock: HttpTestingController, service: Step4Service) => {
        const businessProcessId = '00000000-0000-0000-0000-000000000000';
        const itSystemNode = [
          {
            dataElementIds: [],
            locationId: 'locationId',
            locationIds: ['id1', 'id2'],
            processingPurposeIds: [],
            entityId: 'entityId',
            name: 'name',
            businessProcessId: 'businessProcessId',
            notes: 'notes',
            description: 'description',
            dataSubjectTypeToItSystemDataTransfers: [],
            itSystemToDataRecipientTypeDataTransfers: [],
            itSystemToItSystemDataTransfers: [],
            role: 'role',
            category: 'category',
            nodeId: 'nodeId'
          }
        ];
        const locations = [
          {
            id: 'id1',
            country: {
              id: 'id1',
              threeLetterCode: 'CO1'
            },
            globalRegionId: null,
            stateOrProvinceId: null,
            version: 0
          },
          {
            id: 'id2',
            country: {
              id: 'id2',
              threeLetterCode: 'CO2'
            },
            globalRegionId: null,
            stateOrProvinceId: null,
            version: 0
          }
        ];
        service.setLocations(locations);
        service.saveItSystemNode(businessProcessId, itSystemNode).subscribe(
          data => {
            expect(data).toEqual(
              jasmine.objectContaining([
                {
                  entityId: 'entityId',
                  hidden: false,
                  id: 'entityId',
                  isCustom: undefined,
                  isDsOrDr: true,
                  isItSystem: true,
                  label: 'name',
                  location: '2',
                  locationId: 'locationId',
                  locationIds: ['id1', 'id2'],
                  locations: [
                    {
                      id: 'id1',
                      country: {
                        id: 'id1',
                        threeLetterCode: 'CO1'
                      },
                      globalRegionId: null,
                      stateOrProvinceId: null,
                      version: 0
                    },
                    {
                      id: 'id2',
                      country: {
                        id: 'id2',
                        threeLetterCode: 'CO2'
                      },
                      globalRegionId: null,
                      stateOrProvinceId: null,
                      version: 0
                    }
                  ],
                  nodeId: 'nodeId',
                  receiverId: null,
                  selected: false,
                  senderId: null,
                  subItem: null,
                  tag: 'category',
                  unReselectable: null
                }
              ])
            );
          },
          err => {
            expect(err).toBeNull();
          }
        );
        const expectedUrlOne = `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}`;
        const reqOne = httpMock.expectOne(expectedUrlOne);

        expect(reqOne.request.method).toEqual('POST');
        expect(reqOne.request.urlWithParams).toEqual(expectedUrlOne);
        expect(reqOne.request.responseType).toEqual('json');
        expect(reqOne.request.body).toEqual(itSystemNode);

        reqOne.flush(itSystemNode);
      }
    ));
    it('should call and throw error if invalid parameter "businessProcessId"', inject(
      [HttpTestingController, Step4Service],
      (httpMock: HttpTestingController, service: Step4Service) => {
        const businessProcessId = '00000000-0000-0000-0000_000000000000';
        const itSystemNode = [
          {
            dataElementIds: [],
            locationId: 'locationId',
            locationIds: ['id1', 'id2'],
            processingPurposeIds: [],
            entityId: 'entityId',
            name: 'name',
            businessProcessId: 'businessProcessId',
            notes: 'notes',
            description: 'description',
            dataSubjectTypeToItSystemDataTransfers: [],
            itSystemToDataRecipientTypeDataTransfers: [],
            itSystemToItSystemDataTransfers: [],
            role: 'role',
            category: 'category',
            nodeId: 'nodeId'
          }
        ];
        service.saveItSystemNode(businessProcessId, itSystemNode).subscribe(
          data => {
            expect(data).toBeNull();
          },
          err => {
            expect(err).toContain(`Invalid ID: ${businessProcessId}`);
          }
        );
        const expectedUrlOne = `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}`;
        httpMock.expectNone(expectedUrlOne);
      }
    ));

    afterEach(inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        httpMock.verify();
      }
    ));
  });

  describe('deleteNode()', () => {
    it('should call - no errors', inject(
      [HttpTestingController, Step4Service],
      (httpMock: HttpTestingController, service: Step4Service) => {
        const businessProcessId = '00000000-0000-0000-0000-000000000000';
        const nodeId = '00000000-0000-0000-0000-000000000001';
        service.deleteNode(businessProcessId, nodeId).subscribe(
          data => {
            expect(data).toBeNull();
          },
          err => {
            expect(err).toBeNull();
          }
        );
        const expectedUrl = `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}/node-id/${nodeId}`;
        const req = httpMock.expectOne(expectedUrl);

        expect(req.request.method).toEqual('DELETE');
        expect(req.request.urlWithParams).toEqual(expectedUrl);
        expect(req.request.responseType).toEqual('json');

        req.flush(null);
      }
    ));
    it('should call and throw error if invalid parameter "businessProcessId"', inject(
      [HttpTestingController, Step4Service],
      (httpMock: HttpTestingController, service: Step4Service) => {
        const businessProcessId = '00000000-0000-0000-0000_000000000000';
        const nodeId = '00000000-0000-0000-0000-000000000001';
        service.deleteNode(businessProcessId, nodeId).subscribe(
          data => {
            expect(data).toBeNull();
          },
          err => {
            expect(err).toContain(`Invalid ID: ${businessProcessId}`);
          }
        );
        const expectedUrl = `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}/node-id/${nodeId}`;
        httpMock.expectNone(expectedUrl);
      }
    ));
    it('should call and throw error if invalid parameter "nodeId"', inject(
      [HttpTestingController, Step4Service],
      (httpMock: HttpTestingController, service: Step4Service) => {
        const businessProcessId = '00000000-0000-0000-0000-000000000000';
        const nodeId = '00000000-0000-0000-0000_000000000001';
        service.deleteNode(businessProcessId, nodeId).subscribe(
          data => {
            expect(data).toBeNull();
          },
          err => {
            expect(err).toContain(`Invalid ID: ${nodeId}`);
          }
        );
        const expectedUrl = `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}/node-id/${nodeId}`;
        httpMock.expectNone(expectedUrl);
      }
    ));

    afterEach(inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        httpMock.verify();
      }
    ));
  });

  describe('deleteAllNodes()', () => {
    it('should call - no errors', inject(
      [HttpTestingController, Step4Service],
      (httpMock: HttpTestingController, service: Step4Service) => {
        const businessProcessId = '00000000-0000-0000-0000-000000000000';
        service.deleteAllNodes(businessProcessId).subscribe(
          data => {
            expect(data).toBeNull();
          },
          err => {
            expect(err).toBeNull();
          }
        );
        const expectedUrl = `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}`;
        const req = httpMock.expectOne(expectedUrl);

        expect(req.request.method).toEqual('DELETE');
        expect(req.request.urlWithParams).toEqual(expectedUrl);
        expect(req.request.responseType).toEqual('json');

        req.flush(null);
      }
    ));
    it('should call and throw error if invalid parameter "businessProcessId"', inject(
      [HttpTestingController, Step4Service],
      (httpMock: HttpTestingController, service: Step4Service) => {
        const businessProcessId = '00000000-0000-0000-0000_000000000000';
        service.deleteAllNodes(businessProcessId).subscribe(
          data => {
            expect(data).toBeNull();
          },
          err => {
            expect(err).toContain(`Invalid ID: ${businessProcessId}`);
          }
        );
        const expectedUrl = `/api/hub/data-flows/it-systems/business-process-id/${businessProcessId}`;
        httpMock.expectNone(expectedUrl);
      }
    ));

    afterEach(inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        httpMock.verify();
      }
    ));
  });
});
