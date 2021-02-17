import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteContentComponent } from './confirm-delete-content.component';
import {
  TaActiveModal,
  TableService,
  TaButtonsModule,
  ToastService
} from '@trustarc/ui-toolkit';
import { FormBuilder } from '@angular/forms';
import { DatagridHeaderService } from 'src/app/shared/services/record-listing/datagrid-header.service';
import { MockDatagridHeaderService } from 'src/mocks/mock-datagrid-header.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Observable, of, throwError } from 'rxjs';
import { DatatableService } from 'src/app/shared/services/record-listing/datatable.service';
import { MockDatatableService } from 'src/mocks/mock-datatable.service';
import { BaseRecordService } from 'src/app/shared/services/base-record/base-record.service';
import { BaseRecordFileUploadService } from '../../base-record-file-upload/base-record-file-upload.service';
import { ProcessingPurposesService } from '../../../services/processing-purposes/processing-purposes.service';
import { ProcessingPurposeCategoriesService } from '../../../services/processing-purpose-categories/processing-purpose-categories.service';
import { DataElementCategoriesService } from '../../../services/data-element-categories/data-element-categories.service';
import { DataElementsService } from '../../../services/data-elements/data-elements.service';
import { DataSubjectsService } from '../../../services/data-subjects/data-subjects.service';
import { DataSubjectCategoriesService } from '../../../services/data-subject-categories/data-subject-categories.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('ConfirmDeleteContentComponent', () => {
  let component: ConfirmDeleteContentComponent;
  let fixture: ComponentFixture<ConfirmDeleteContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDeleteContentComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TaButtonsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        ToastService,
        TaActiveModal,
        TableService,
        BaseRecordFileUploadService,
        FormBuilder,
        TranslateService,
        {
          provide: BaseRecordService,
          useValue: jasmine.createSpyObj(BaseRecordService.prototype)
        },
        {
          provide: DatagridHeaderService,
          useClass: MockDatagridHeaderService
        },
        {
          provide: DatatableService,
          useClass: MockDatatableService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process input with "isCategoryModal" true', () => {
    component.isCategoryModal = true;
    component.ngOnInit();
    expect(component.isCategoryModal).toBeTruthy();
  });

  it('should assign items if get selected', () => {
    const tableService = TestBed.get(TableService);
    spyOn(tableService, 'getSelected').and.returnValue(true);
    fixture = TestBed.createComponent(ConfirmDeleteContentComponent);
    component = fixture.componentInstance;
    component.gridId = 'gridId';
    component.ngOnInit();
    expect(component.items).toBeTruthy();
  });

  const setupNetworkRequest = (result: 'Success' | 'Failure') => {
    const recordListingService = TestBed.get(BaseRecordService);

    const returnValue =
      result === 'Failure'
        ? new Observable(sub => sub.error('Testing Error'))
        : of([]);

    recordListingService.deleteRecordsByIdList.and.returnValue(returnValue);
  };

  const verifyDeleteButtonEnabled = () => {
    const onDeleteSpy = spyOn(component, 'onDelete').and.callThrough();

    const deleteButton = fixture.debugElement.query(
      By.css('#confirm-delete-button')
    );

    deleteButton.triggerEventHandler('click', null);
    expect(onDeleteSpy).toHaveBeenCalled();
    expect(component.disabled).toBeFalsy();
  };

  it('should disable delete button during network traffic', () => {
    const recordListingService = TestBed.get(BaseRecordService);

    const deleteButton = fixture.debugElement.query(
      By.css('#confirm-delete-button')
    );

    setupNetworkRequest('Success');

    recordListingService.deleteRecordsByIdList.and.callFake(() => {
      expect(component.disabled).toBeTruthy();
      return of({});
    });

    deleteButton.triggerEventHandler('click', null);

    expect(recordListingService.deleteRecordsByIdList).toHaveBeenCalled();
  });

  it('should enable delete button after successful network request', () => {
    setupNetworkRequest('Success');
    verifyDeleteButtonEnabled();
  });

  it('should enable delete button after failed network request', () => {
    setupNetworkRequest('Failure');
    verifyDeleteButtonEnabled();
  });

  it('should call getItemIdentifiers() correctly - map', () => {
    component.items = [{ identifier: 'id1' }, { identifier: 'id2' }];
    const items = component.getItemIdentifiers();
    expect(items).toEqual(['id1', 'id2']);
  });

  it('should call getItemIdentifiers() correctly - and return null', () => {
    component.items = null;
    const items = component.getItemIdentifiers();
    expect(items).toEqual(null);
  });

  it('should call getCategories() correctly - map category', () => {
    component.items = [{ category: 'category1' }, { category: 'category2' }];
    fixture.detectChanges();
    const categories = component.getCategories();
    expect(categories).toEqual('category1, category2');
  });

  it('should call getCategories() correctly - map name', () => {
    component.items = [{ name: 'name1' }, { name: 'name2' }];
    fixture.detectChanges();
    const categories = component.getCategories();
    expect(categories).toEqual('name1, name2');
  });

  it('should call getFileName() correctly - return filename', () => {
    component.fileValue = { fileName: 'fileName' };
    fixture.detectChanges();
    const fileName = component.getFileName();
    expect(fileName).toEqual('fileName');
  });

  it('should call getItemIdentifiers() correctly - return null', () => {
    component.fileValue = null;
    fixture.detectChanges();
    const fileName = component.getFileName();
    expect(fileName).toEqual(null);
  });

  it('should call onCancel() correctly - not disabled', () => {
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(activeModal, 'dismiss');
    fixture = TestBed.createComponent(ConfirmDeleteContentComponent);
    component = fixture.componentInstance;
    component.disabled = false;
    fixture.detectChanges();
    component.onCancel();
    expect(activeModal.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel() correctly - disabled', () => {
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(activeModal, 'dismiss');
    fixture = TestBed.createComponent(ConfirmDeleteContentComponent);
    component = fixture.componentInstance;
    component.disabled = true;
    fixture.detectChanges();
    component.onCancel();
    expect(activeModal.dismiss).toHaveBeenCalledTimes(0);
  });

  it('should call onDelete() correctly - fileValue', () => {
    const baseRecordFileUploadService = TestBed.get(
      BaseRecordFileUploadService
    );
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(baseRecordFileUploadService, 'removeFile');
    spyOn(activeModal, 'close');
    component.fileValue = { index: 0, fileName: 'fileName' };
    component.items = null;
    fixture.detectChanges();
    component.onDelete();
    expect(baseRecordFileUploadService.removeFile).toHaveBeenCalledTimes(1);
    expect(activeModal.close).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete() correctly - deleteItems', () => {
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(activeModal, 'close');
    const baseRecordService = TestBed.get(BaseRecordService);
    baseRecordService.deleteRecordsByIdList.and.returnValue(of([]));
    component.items = ['item1', 'item2'];
    fixture.detectChanges();
    component.onDelete();
    expect(baseRecordService.deleteRecordsByIdList).toHaveBeenCalledTimes(1);
    expect(activeModal.close).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete() correctly - deleteProcessingPurposesCategories', () => {
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(activeModal, 'close');
    const processingPurposeCategoriesService = TestBed.get(
      ProcessingPurposeCategoriesService
    );
    spyOn(
      processingPurposeCategoriesService,
      'deleteProcessingPurposesCategories'
    ).and.returnValue(of({}));
    component.items = [{ category: 'category1' }, { category: 'category2' }];
    component.isCategoryModal = true;
    component.dataType = 'PP';
    fixture.detectChanges();
    component.onDelete();
    expect(
      processingPurposeCategoriesService.deleteProcessingPurposesCategories
    ).toHaveBeenCalledTimes(1);
    expect(activeModal.close).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete() correctly - deleteProcessingPurposesCategories and handle error', () => {
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(activeModal, 'close');
    const processingPurposeCategoriesService = TestBed.get(
      ProcessingPurposeCategoriesService
    );
    spyOn(
      processingPurposeCategoriesService,
      'deleteProcessingPurposesCategories'
    ).and.returnValue(throwError(new Error('error')));
    component.items = [{ category: 'category1' }, { category: 'category2' }];
    component.isCategoryModal = true;
    component.dataType = 'PP';
    fixture.detectChanges();
    component.onDelete();
    expect(
      processingPurposeCategoriesService.deleteProcessingPurposesCategories
    ).toHaveBeenCalledTimes(1);
    expect(activeModal.close).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete() correctly - deleteDataElementCategories', () => {
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(activeModal, 'close');
    const dataElementCategoriesService = TestBed.get(
      DataElementCategoriesService
    );
    spyOn(
      dataElementCategoriesService,
      'deleteDataElementCategories'
    ).and.returnValue(of({}));
    component.items = [{ category: 'category1' }, { category: 'category2' }];
    component.isCategoryModal = true;
    component.dataType = 'DE';
    fixture.detectChanges();
    component.onDelete();
    expect(
      dataElementCategoriesService.deleteDataElementCategories
    ).toHaveBeenCalledTimes(1);
    expect(activeModal.close).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete() correctly - deleteDataElementCategories and handle error', () => {
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(activeModal, 'close');
    const dataElementCategoriesService = TestBed.get(
      DataElementCategoriesService
    );
    spyOn(
      dataElementCategoriesService,
      'deleteDataElementCategories'
    ).and.returnValue(throwError(new Error('error')));
    component.items = [{ category: 'category1' }, { category: 'category2' }];
    component.isCategoryModal = true;
    component.dataType = 'DE';
    fixture.detectChanges();
    component.onDelete();
    expect(
      dataElementCategoriesService.deleteDataElementCategories
    ).toHaveBeenCalledTimes(1);
    expect(activeModal.close).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete() correctly - deleteDataElements', () => {
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(activeModal, 'close');
    const dataElementsService = TestBed.get(DataElementsService);
    spyOn(dataElementsService, 'deleteDataElements').and.returnValue(of({}));
    component.items = [{ id: 'id1' }, { id: 'id2' }];
    component.isCategoryModal = true;
    component.dataType = 'DE';
    fixture.detectChanges();
    component.onDelete();
    expect(dataElementsService.deleteDataElements).toHaveBeenCalledTimes(1);
    expect(activeModal.close).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete() correctly - deleteDataElements and handle error', () => {
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(activeModal, 'close');
    const dataElementsService = TestBed.get(DataElementsService);
    spyOn(dataElementsService, 'deleteDataElements').and.returnValue(
      throwError(new Error('error'))
    );
    component.items = [{ id: 'id1' }, { id: 'id2' }];
    component.isCategoryModal = true;
    component.dataType = 'DE';
    fixture.detectChanges();
    component.onDelete();
    expect(dataElementsService.deleteDataElements).toHaveBeenCalledTimes(1);
    expect(activeModal.close).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete() correctly - deleteProcessingPurposes', () => {
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(activeModal, 'close');
    const processingPurposesService = TestBed.get(ProcessingPurposesService);
    spyOn(
      processingPurposesService,
      'deleteProcessingPurposes'
    ).and.returnValue(of({}));
    component.items = [{ id: 'id1' }, { id: 'id2' }];
    component.isCategoryModal = true;
    component.dataType = 'PP';
    fixture.detectChanges();
    component.onDelete();
    expect(
      processingPurposesService.deleteProcessingPurposes
    ).toHaveBeenCalledTimes(1);
    expect(activeModal.close).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete() correctly - deleteProcessingPurposes and handle error', () => {
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(activeModal, 'close');
    const processingPurposesService = TestBed.get(ProcessingPurposesService);
    spyOn(
      processingPurposesService,
      'deleteProcessingPurposes'
    ).and.returnValue(throwError(new Error('error')));
    component.items = [{ id: 'id1' }, { id: 'id2' }];
    component.isCategoryModal = true;
    component.dataType = 'PP';
    fixture.detectChanges();
    component.onDelete();
    expect(
      processingPurposesService.deleteProcessingPurposes
    ).toHaveBeenCalledTimes(1);
    expect(activeModal.close).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete() correctly - deleteDataSubjects', () => {
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(activeModal, 'close');
    const dataSubjectService = TestBed.get(DataSubjectsService);
    spyOn(dataSubjectService, 'deleteDataSubjects').and.returnValue(of({}));
    component.items = [{ id: 'id1' }, { id: 'id2' }];
    component.isCategoryModal = true;
    component.dataType = 'DS';
    fixture.detectChanges();
    component.onDelete();
    expect(dataSubjectService.deleteDataSubjects).toHaveBeenCalledTimes(1);
    expect(activeModal.close).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete() correctly - deleteDataSubjects and handle error', () => {
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(activeModal, 'close');
    const dataSubjectService = TestBed.get(DataSubjectsService);
    spyOn(dataSubjectService, 'deleteDataSubjects').and.returnValue(
      throwError(new Error('error'))
    );
    component.items = [{ id: 'id1' }, { id: 'id2' }];
    component.isCategoryModal = true;
    component.dataType = 'DS';
    fixture.detectChanges();
    component.onDelete();
    expect(dataSubjectService.deleteDataSubjects).toHaveBeenCalledTimes(1);
    expect(activeModal.close).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete() correctly - deleteDataSubjectCategories', () => {
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(activeModal, 'close');
    const dataSubjectCategoriesService = TestBed.get(
      DataSubjectCategoriesService
    );
    spyOn(
      dataSubjectCategoriesService,
      'deleteDataSubjectCategories'
    ).and.returnValue(of({}));
    component.items = [{ category: 'category1' }, { category: 'category2' }];
    component.isCategoryModal = true;
    component.dataType = 'DS';
    fixture.detectChanges();
    component.onDelete();
    expect(
      dataSubjectCategoriesService.deleteDataSubjectCategories
    ).toHaveBeenCalledTimes(1);
    expect(activeModal.close).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete() correctly - deleteDataSubjectCategories and handle error', () => {
    const activeModal = TestBed.get(TaActiveModal);
    spyOn(activeModal, 'close');
    const dataSubjectCategoriesService = TestBed.get(
      DataSubjectCategoriesService
    );
    spyOn(
      dataSubjectCategoriesService,
      'deleteDataSubjectCategories'
    ).and.returnValue(throwError(new Error('error')));
    component.items = [{ category: 'category1' }, { category: 'category2' }];
    component.isCategoryModal = true;
    component.dataType = 'DS';
    fixture.detectChanges();
    component.onDelete();
    expect(
      dataSubjectCategoriesService.deleteDataSubjectCategories
    ).toHaveBeenCalledTimes(1);
    expect(activeModal.close).toHaveBeenCalledTimes(1);
  });
});
