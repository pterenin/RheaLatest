import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReviewComponent } from './review.component';
import {
  BusinessProcessWizardHeaderComponent,
  BusinessProcessWizardFooterComponent
} from '../shared';
import {
  TaSvgIconModule,
  TaTableModule,
  TaTooltipModule,
  TaToastModule,
  ToastService,
  TaCheckboxModule,
  TaBadgeModule,
  TaDropdownModule,
  TaPaginationModule,
  TableService
} from '@trustarc/ui-toolkit';
import { RouterTestingModule } from '@angular/router/testing';
import { BusinessProcessDetailComponent } from '../shared/components/business-process-detail/business-process-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';
import { HttpClientModule } from '@angular/common/http';
import { BusinessProcessWizardService } from '../business-process-wizard.service';
import {
  BusinessProcessControllerService,
  FeatureFlagControllerService
} from 'src/app/shared/_services/rest-api';
// tslint:disable-next-line:max-line-length
import { CategoryFormSearchFilterPipeModule } from 'src/app/shared/_pipes/category-form-search-filter/category-form-search-filter.pipe.module';
import { TableSearchFilterPipeModule } from 'src/app/shared/_pipes/table-search-filter/table-search-filter.pipe.module';
import { FilterByArrayPipeModule } from 'src/app/shared/_pipes/filter-by-array-pipe/filter-by-array-pipe.module';
import { CollectionPipeModule } from 'src/app/shared/pipes/collection/collection.module';
import { LegalBasesControllerService } from 'src/app/shared/_services/rest-api/legal-bases-controller/legal-bases-controller.service';
import { ClipboardService } from 'ngx-clipboard';
import { CreateBusinessProcessesService } from 'src/app/business-processes/create-bp/create-business-processes.service';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReviewComponent,
        BusinessProcessWizardHeaderComponent,
        BusinessProcessWizardFooterComponent,
        BusinessProcessDetailComponent
      ],
      imports: [
        TaToastModule,
        TaSvgIconModule,
        HttpClientModule,
        DropdownFieldModule,
        RouterTestingModule,
        TaTableModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TaTooltipModule,
        TaCheckboxModule,
        TaBadgeModule,
        TaDropdownModule,
        CategoryFormSearchFilterPipeModule,
        TableSearchFilterPipeModule,
        FilterByArrayPipeModule,
        CollectionPipeModule,
        TaPaginationModule
      ],
      providers: [
        ToastService,
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of(convertToParamMap({ id: 'business-process-Id-123' }))
            }
          }
        },
        BusinessProcessControllerService,
        BusinessProcessWizardService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should call ngOnInit() correctly', () => {
      const tableService = TestBed.get(TableService);

      const fakeReq = {
        sortType: 'sortType',
        columnSort: 'columnSort'
      };

      const initDataSpy = spyOn(component, 'initData');
      const verifyLicenseSpy = spyOn(component, 'verifyLicense');

      const gridID = 'review-bp-table';

      const listenRequestEventsSpy = spyOn(
        tableService,
        'listenRequestEvents'
      ).and.returnValue(of(fakeReq));

      const sortRowsSpy = spyOn(component, 'sortRows');

      component.ngOnInit();
      fixture.detectChanges();

      expect(initDataSpy).toHaveBeenCalledTimes(1);
      expect(verifyLicenseSpy).toHaveBeenCalledTimes(1);
      expect(listenRequestEventsSpy).toHaveBeenCalledWith(gridID);
      expect(sortRowsSpy).toHaveBeenCalledWith('columnSort', 'sortType');
    });
  });

  describe('initData()', () => {
    it('should call initData() correctly', () => {
      const businessProcessControllerService = TestBed.get(
        BusinessProcessControllerService
      );
      const legalBasesControllerService = TestBed.get(
        LegalBasesControllerService
      );

      const fakeApproval = {
        id: 'id',
        version: 1,
        name: 'name',
        identifier: 'identifier',
        status: 'status',
        associations: [
          {
            processingPurposeId: 'processingPurposeId',
            legalBasisId: 'legalBasisId'
          }
        ],
        processingPurposes: [
          {
            id: 'id',
            version: 1,
            category: 'category',
            name: 'name',
            isCustom: true,
            isCategoryCustom: true
          }
        ]
      };

      const fakeLegalBases = {
        id: 'id1',
        category: 'STANDARD',
        description: 'description',
        displayOrder: 1,
        legalBasis: 'legalBasis',
        shortName: 'shortName',
        version: 1
      };

      component.businessProcessId = 'businessProcessId';

      const businessProcessControllerServiceSpy = spyOn(
        businessProcessControllerService,
        'getApprovalById'
      ).and.returnValue(of(fakeApproval));
      const legalBasesControllerServiceSpy = spyOn(
        legalBasesControllerService,
        'findAll'
      ).and.returnValue(of(fakeLegalBases));

      const mapLegalBasesToApprovalDataSpy = spyOn(
        component,
        'mapLegalBasesToApprovalData'
      );
      const renderDataSpy = spyOn(component, 'renderData');

      component.initData();
      fixture.detectChanges();

      expect(component.isLoading).toEqual(false);
      expect(component.version).toEqual(1);
      expect(component.businessProcessApproval).toEqual(
        jasmine.objectContaining(fakeApproval)
      );
      expect(component.legalBases).toEqual(
        jasmine.objectContaining(fakeLegalBases)
      );
      expect(component.status).toEqual('status');

      expect(businessProcessControllerServiceSpy).toHaveBeenCalledTimes(1);
      expect(legalBasesControllerServiceSpy).toHaveBeenCalledTimes(1);
      expect(mapLegalBasesToApprovalDataSpy).toHaveBeenCalledTimes(1);
      expect(renderDataSpy).toHaveBeenCalledTimes(1);
    });
    it('should call initData() error', () => {
      const businessProcessControllerService = TestBed.get(
        BusinessProcessControllerService
      );
      const legalBasesControllerService = TestBed.get(
        LegalBasesControllerService
      );
      const toastService = TestBed.get(ToastService);

      const fakeApproval = {
        id: 'id',
        version: 1,
        name: 'name',
        identifier: 'identifier',
        status: 'status',
        associations: [
          {
            processingPurposeId: 'processingPurposeId',
            legalBasisId: 'legalBasisId'
          }
        ],
        processingPurposes: [
          {
            id: 'id',
            version: 1,
            category: 'category',
            name: 'name',
            isCustom: true,
            isCategoryCustom: true
          }
        ]
      };

      const fakeLegalBases = {
        id: 'id1',
        category: 'STANDARD',
        description: 'description',
        displayOrder: 1,
        legalBasis: 'legalBasis',
        shortName: 'shortName',
        version: 1
      };

      component.businessProcessApproval = fakeApproval;

      component.businessProcessId = 'businessProcessId';

      const businessProcessControllerServiceSpy = spyOn(
        businessProcessControllerService,
        'getApprovalById'
      ).and.returnValue(throwError('fakeErr'));
      const legalBasesControllerServiceSpy = spyOn(
        legalBasesControllerService,
        'findAll'
      ).and.returnValue(of(fakeLegalBases));
      const toastServiceSpy = spyOn(toastService, 'error');

      const mapLegalBasesToApprovalDataSpy = spyOn(
        component,
        'mapLegalBasesToApprovalData'
      );
      const renderDataSpy = spyOn(component, 'renderData');

      const error = 'Error retrieving business processes and legal bases';

      component.initData();
      fixture.detectChanges();

      expect(component.isLoading).toEqual(false);
      expect(businessProcessControllerServiceSpy).toHaveBeenCalledTimes(1);
      expect(legalBasesControllerServiceSpy).toHaveBeenCalledTimes(1);
      expect(mapLegalBasesToApprovalDataSpy).toHaveBeenCalledTimes(0);
      expect(renderDataSpy).toHaveBeenCalledTimes(0);
      expect(toastServiceSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('onSearch()', () => {
    it('should call onSearch(event) correctly', () => {
      const event = 'event';

      component.onSearch(event);
      fixture.detectChanges();

      expect(component.searchString).toEqual('event');
    });
  });

  describe('mapLegalBasesToApprovalData()', () => {
    it('should call mapLegalBasesToApprovalData() correctly', () => {
      const fakeApproval = {
        id: 'id',
        version: 1,
        name: 'name',
        identifier: 'identifier',
        status: 'status',
        associations: [
          {
            processingPurposeId: 'id1',
            legalBasisId: 'id1'
          }
        ],
        processingPurposes: [
          {
            id: 'id1',
            version: 1,
            category: 'category',
            name: 'name1',
            isCustom: true,
            isCategoryCustom: true
          },
          {
            id: 'id2',
            version: 1,
            category: 'category',
            name: 'name2',
            isCustom: true,
            isCategoryCustom: true
          }
        ]
      };
      const fakeLegalBases = [
        {
          id: 'id1',
          category: 'STANDARD',
          description: 'description',
          displayOrder: 1,
          legalBasis: 'legalBasis',
          shortName: 'shortName',
          version: 1
        }
      ];

      component.mapLegalBasesToApprovalData(fakeApproval, fakeLegalBases);
      fixture.detectChanges();

      console.log(fakeApproval, fakeLegalBases);
    });
  });

  describe('copyLinkToClipboard()', () => {
    it('should call copyLinkToClipboard() correctly', () => {
      const clipboardService = TestBed.get(ClipboardService);
      const toastService = TestBed.get(ToastService);
      const copyFromContentSpy = spyOn(clipboardService, 'copyFromContent');
      const successSpy = spyOn(toastService, 'success');

      component.copyLinkToClipboard();
      fixture.detectChanges();

      expect(copyFromContentSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onChangePage()', () => {
    it('should call onChangePage(event) correctly', () => {
      const event = 5;
      const renderDataSpy = spyOn(component, 'renderData');

      component.onChangePage(event);
      fixture.detectChanges();

      expect(component.page).toEqual(5);
      expect(renderDataSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onChangeMax()', () => {
    it('should call onChangeMax(event) correctly', () => {
      const event = 5;
      const renderDataSpy = spyOn(component, 'renderData');

      component.onChangeMax(event);
      fixture.detectChanges();

      expect(component.pageSize).toEqual(5);
      expect(component.page).toEqual(1);
      expect(renderDataSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('renderData()', () => {
    it('should call renderData() correctly', () => {
      component.businessProcessApproval = {
        id: 'id',
        version: 1,
        name: 'name',
        identifier: 'identifier',
        status: 'status',
        associations: [
          {
            processingPurposeId: 'processingPurposeId',
            legalBasisId: 'legalBasisId'
          }
        ],
        processingPurposes: [
          {
            id: 'id',
            version: 1,
            category: 'category',
            name: 'name',
            isCustom: true,
            isCategoryCustom: true
          }
        ]
      };

      component.page = 1;
      component.pageSize = 10;

      component.renderData();
      fixture.detectChanges();

      expect(component.data).toEqual(
        jasmine.objectContaining([
          {
            id: 'id',
            version: 1,
            category: 'category',
            name: 'name',
            isCustom: true,
            isCategoryCustom: true
          }
        ])
      );
    });
  });

  describe('getPaginatedItems()', () => {
    it('should call getPaginatedItems()  correctly', () => {
      const processingPurposes = [
        {
          id: 'id1',
          version: 1,
          category: 'category1',
          name: 'name1',
          isCustom: true,
          isCategoryCustom: true
        },
        {
          id: 'id2',
          version: 1,
          category: 'category2',
          name: 'name2',
          isCustom: true,
          isCategoryCustom: true
        },
        {
          id: 'id3',
          version: 1,
          category: 'category3',
          name: 'name3',
          isCustom: true,
          isCategoryCustom: true
        },
        {
          id: 'id4',
          version: 1,
          category: 'category4',
          name: 'name4',
          isCustom: true,
          isCategoryCustom: true
        }
      ];
      const page = 1;
      const pageSize = 2;

      const paginated = component.getPaginatedItems(
        processingPurposes,
        page,
        pageSize
      );
      fixture.detectChanges();

      expect(paginated).toEqual(
        jasmine.arrayContaining([
          {
            id: 'id1',
            version: 1,
            category: 'category1',
            name: 'name1',
            isCustom: true,
            isCategoryCustom: true
          },
          {
            id: 'id2',
            version: 1,
            category: 'category2',
            name: 'name2',
            isCustom: true,
            isCategoryCustom: true
          }
        ])
      );
    });
    it('should call getPaginatedItems()  correctly - default pagination', () => {
      const processingPurposes = [
        {
          id: 'id1',
          version: 1,
          category: 'category1',
          name: 'name1',
          isCustom: true,
          isCategoryCustom: true
        },
        {
          id: 'id2',
          version: 1,
          category: 'category2',
          name: 'name2',
          isCustom: true,
          isCategoryCustom: true
        },
        {
          id: 'id3',
          version: 1,
          category: 'category3',
          name: 'name3',
          isCustom: true,
          isCategoryCustom: true
        },
        {
          id: 'id4',
          version: 1,
          category: 'category4',
          name: 'name4',
          isCustom: true,
          isCategoryCustom: true
        }
      ];
      const page = undefined;
      const pageSize = undefined;

      const paginated = component.getPaginatedItems(
        processingPurposes,
        page,
        pageSize
      );
      fixture.detectChanges();

      expect(paginated).toEqual(
        jasmine.arrayContaining([
          {
            id: 'id1',
            version: 1,
            category: 'category1',
            name: 'name1',
            isCustom: true,
            isCategoryCustom: true
          },
          {
            id: 'id2',
            version: 1,
            category: 'category2',
            name: 'name2',
            isCustom: true,
            isCategoryCustom: true
          }
        ])
      );
    });
  });

  describe('verifyLicense()', () => {
    it('should call verifyLicense() correctly', () => {
      const featureFlagControllerService = TestBed.get(
        FeatureFlagControllerService
      );

      const router = TestBed.get(Router);

      const fakeAllLicenses = {
        RHEA_NEW_UI_STEPS_12_LICENSE: false
      };

      const getAllFeatureFlagsSpy = spyOn(
        featureFlagControllerService,
        'getAllFeatureFlags'
      ).and.returnValue(of(fakeAllLicenses));

      const navigateSpy = spyOn(router, 'navigate');

      component.verifyLicense();
      fixture.detectChanges();

      expect(getAllFeatureFlagsSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledTimes(1);
    });
    it('should call verifyLicense() err', () => {
      const featureFlagControllerService = TestBed.get(
        FeatureFlagControllerService
      );

      const router = TestBed.get(Router);

      const fakeError = 'fakeError';

      const getAllFeatureFlagsSpy = spyOn(
        featureFlagControllerService,
        'getAllFeatureFlags'
      ).and.returnValue(throwError(fakeError));

      const navigateSpy = spyOn(router, 'navigate');

      component.verifyLicense();
      fixture.detectChanges();

      expect(getAllFeatureFlagsSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('setLegalBasisForProcessingPurpose()', () => {
    it('should call setLegalBasisForProcessingPurpose(id, basis) correctly', () => {
      component.businessProcessApproval = {
        id: 'id',
        version: 1,
        name: 'name',
        identifier: 'identifier',
        status: 'status',
        associations: [
          {
            processingPurposeId: 'processingPurposeId',
            legalBasisId: 'legalBasisId'
          }
        ],
        processingPurposes: [
          {
            id: 'id1',
            version: 1,
            category: 'category1',
            name: 'name1',
            isCustom: true,
            isCategoryCustom: true
          },
          {
            id: 'id2',
            version: 1,
            category: 'category2',
            name: 'name2',
            isCustom: true,
            isCategoryCustom: true
          }
        ]
      };

      const renderDataSpy = spyOn(component, 'renderData');

      component.setLegalBasisForProcessingPurpose('id1', {
        shortName: 'shortName'
      });
      fixture.detectChanges();

      expect(renderDataSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('sortRows()', () => {
    it('should call sortRows() correctly - asc', () => {
      component.businessProcessApproval = {
        id: 'id',
        version: 1,
        name: 'name',
        identifier: 'identifier',
        status: 'status',
        associations: [
          {
            processingPurposeId: 'processingPurposeId',
            legalBasisId: 'legalBasisId'
          }
        ],
        processingPurposes: [
          {
            id: 'id1',
            version: 1,
            category: 'category1',
            name: 'name1',
            isCustom: true,
            isCategoryCustom: true
          },
          {
            id: 'id2',
            version: 1,
            category: 'category2',
            name: 'name2',
            isCustom: true,
            isCategoryCustom: true
          }
        ]
      };

      const renderDataSpy = spyOn(component, 'renderData');

      component.sortRows('name', 'asc');
      fixture.detectChanges();

      expect(renderDataSpy).toHaveBeenCalledTimes(1);
    });
    it('should call sortRows() correctly - desc', () => {
      component.businessProcessApproval = {
        id: 'id',
        version: 1,
        name: 'name',
        identifier: 'identifier',
        status: 'status',
        associations: [
          {
            processingPurposeId: 'processingPurposeId',
            legalBasisId: 'legalBasisId'
          }
        ],
        processingPurposes: [
          {
            id: 'id1',
            version: 1,
            category: 'category1',
            name: 'name1',
            isCustom: true,
            isCategoryCustom: true
          },
          {
            id: 'id2',
            version: 1,
            category: 'category2',
            name: 'name2',
            isCustom: true,
            isCategoryCustom: true
          }
        ]
      };

      const renderDataSpy = spyOn(component, 'renderData');

      component.sortRows('name', 'desc');
      fixture.detectChanges();

      expect(renderDataSpy).toHaveBeenCalledTimes(1);
    });
    it('should call sortRows() correctly - empty', () => {
      component.businessProcessApproval = {
        id: 'id',
        version: 1,
        name: 'name',
        identifier: 'identifier',
        status: 'status',
        associations: [
          {
            processingPurposeId: 'processingPurposeId',
            legalBasisId: 'legalBasisId'
          }
        ],
        processingPurposes: [
          {
            id: 'id1',
            version: 1,
            category: 'category1',
            name: 'name1',
            isCustom: true,
            isCategoryCustom: true
          },
          {
            id: 'id2',
            version: 1,
            category: 'category2',
            name: 'name2',
            isCustom: true,
            isCategoryCustom: true
          }
        ]
      };

      const renderDataSpy = spyOn(component, 'renderData');

      component.sortRows('name', '');
      fixture.detectChanges();

      expect(renderDataSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('buildPutRequest()', () => {
    it('should  call buildPutRequest() correctly', () => {
      component.businessProcessApproval = {
        id: 'id',
        version: 1,
        name: 'name',
        identifier: 'identifier',
        status: 'status',
        associations: [
          {
            processingPurposeId: 'processingPurposeId',
            legalBasisId: 'legalBasisId'
          }
        ],
        processingPurposes: [
          {
            id: 'id1',
            version: 1,
            category: 'category1',
            name: 'name1',
            isCustom: true,
            isCategoryCustom: true
          },
          {
            id: 'id2',
            version: 1,
            category: 'category2',
            name: 'name2',
            isCustom: true,
            isCategoryCustom: true
          }
        ]
      };

      const basis = {
        id: 'id1',
        category: 'STANDARD',
        description: 'description',
        displayOrder: 'displayOrder',
        legalBasis: 'legalBasis',
        shortName: 'shortName',
        version: 1
      };

      component.businessProcessId = 'businessProcessId';
      component.version = 1;
      component.status = 'status';

      component.setLegalBasisForProcessingPurpose('id1', basis);
      const request = component.buildPutRequest();
      fixture.detectChanges();

      expect(request).toEqual(
        jasmine.objectContaining({
          id: 'businessProcessId',
          version: 1,
          status: 'status',
          associations: [
            {
              legalBasisId: 'id1',
              processingPurposeId: 'id1'
            }
          ]
        })
      );
    });
  });

  describe('isDisabledNextBtn()', () => {
    it('should call isDisabledNextBtn()  correctly', () => {
      const isDisabled = component.isDisabledNextBtn();
      fixture.detectChanges();

      expect(isDisabled).toEqual(false);
    });
  });

  describe('navigate()', () => {
    it('should call navigate() correctly -  save false and cancel', () => {
      const router = TestBed.get(Router);
      const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

      component.navigate({ save: false, step: 'cancel' });
      fixture.detectChanges();

      expect(navigateByUrlSpy).toHaveBeenCalledWith('/business-process');
    });
    it('should call navigate() correctly -  save false and home', () => {
      const router = TestBed.get(Router);
      const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

      component.navigate({ save: false, step: 'home' });
      fixture.detectChanges();

      expect(navigateByUrlSpy).toHaveBeenCalledWith('/business-process');
    });
    it('should call navigate() correctly -  save false and other', () => {
      const createBusinessProcessesService = TestBed.get(
        CreateBusinessProcessesService
      );
      spyOn(createBusinessProcessesService, 'setSelectedStep');
      const router = TestBed.get(Router);
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(
        Promise.resolve(null)
      );

      component.navigate({ save: false, step: 'other' });
      fixture.detectChanges();

      expect(navigateSpy).toHaveBeenCalledTimes(1);
    });
    it('should call navigate() correctly -  save true and home', () => {
      const fakePayload = 'fakePayload';
      const fakeBusinessProcessId = 'businessProcessId';

      const router = TestBed.get(Router);
      const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

      spyOn(component, 'buildPutRequest').and.returnValue(fakePayload);
      component.businessProcessId = fakeBusinessProcessId;
      const businessProcessControllerService = TestBed.get(
        BusinessProcessControllerService
      );
      const updateApprovalSpy = spyOn(
        businessProcessControllerService,
        'updateApproval'
      ).and.returnValue(of(null));

      component.navigate({ save: true, step: 'home' });
      fixture.detectChanges();

      expect(updateApprovalSpy).toHaveBeenCalledWith(
        fakePayload,
        fakeBusinessProcessId
      );
      expect(navigateByUrlSpy).toHaveBeenCalledWith('/business-process');
    });
    it('should call navigate() correctly -  save true and other', () => {
      const fakePayload = 'fakePayload';
      const fakeBusinessProcessId = 'businessProcessId';

      const router = TestBed.get(Router);
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(
        Promise.resolve(null)
      );

      spyOn(component, 'buildPutRequest').and.returnValue(fakePayload);
      component.businessProcessId = fakeBusinessProcessId;
      const businessProcessControllerService = TestBed.get(
        BusinessProcessControllerService
      );
      const updateApprovalSpy = spyOn(
        businessProcessControllerService,
        'updateApproval'
      ).and.returnValue(of(null));

      component.navigate({ save: true, step: 'other' });
      fixture.detectChanges();

      expect(updateApprovalSpy).toHaveBeenCalledWith(
        fakePayload,
        fakeBusinessProcessId
      );
      expect(navigateSpy).toHaveBeenCalledTimes(1);
    });
    it('should call navigate() correctly -  save true and error', () => {
      const fakePayload = 'fakePayload';
      const fakeBusinessProcessId = 'businessProcessId';

      const router = TestBed.get(Router);
      const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

      spyOn(component, 'buildPutRequest').and.returnValue(fakePayload);
      component.businessProcessId = fakeBusinessProcessId;
      const businessProcessControllerService = TestBed.get(
        BusinessProcessControllerService
      );
      const updateApprovalSpy = spyOn(
        businessProcessControllerService,
        'updateApproval'
      ).and.returnValue(throwError('fakeError'));

      component.navigate({ save: true, step: 'other' });
      fixture.detectChanges();

      expect(updateApprovalSpy).toHaveBeenCalledWith(
        fakePayload,
        fakeBusinessProcessId
      );
      expect(navigateByUrlSpy).toHaveBeenCalledTimes(0);
    });
    it('should call navigate() correctly -  save true and other - unsubscribe', () => {
      const fakePayload = 'fakePayload';
      const fakeBusinessProcessId = 'businessProcessId';

      const router = TestBed.get(Router);
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(
        Promise.resolve(null)
      );

      spyOn(component, 'buildPutRequest').and.returnValue(fakePayload);
      component.businessProcessId = fakeBusinessProcessId;
      const businessProcessControllerService = TestBed.get(
        BusinessProcessControllerService
      );
      const updateApprovalSpy = spyOn(
        businessProcessControllerService,
        'updateApproval'
      ).and.returnValue(of(null));

      component.navigate({ save: true, step: 'other' });
      component.navigate({ save: true, step: 'other' });
      fixture.detectChanges();

      expect(updateApprovalSpy).toHaveBeenCalledWith(
        fakePayload,
        fakeBusinessProcessId
      );
      expect(navigateSpy).toHaveBeenCalledTimes(2);
    });
  });
});
