import { TestBed } from '@angular/core/testing';

import { ExportService } from './export.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataInventoryInterface } from '../../models/bp-data-model';
import { DataInventoryType } from 'src/app/data-inventory/my-inventory/my-inventory.component';

describe('ExportService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ExportService = TestBed.get(ExportService);
    expect(service).toBeTruthy();
  });

  it('should call the correct get all endpoint', () => {
    const service: ExportService = TestBed.get(ExportService);

    const httpClient: HttpClient = TestBed.get(HttpClient);
    const getSpy = spyOn(httpClient, 'get');
    service.exportAll();
    expect(getSpy).toHaveBeenCalledWith(`/api/hub/exports/async/all`, {
      observe: 'response',
      responseType: 'blob'
    });
  });

  it('should call zip endpoint if multiple types are selected', () => {
    const service: ExportService = TestBed.get(ExportService);

    const httpClient: HttpClient = TestBed.get(HttpClient);
    const getSpy = spyOn(httpClient, 'get');
    const items: DataInventoryInterface[] = [
      { id: 'test1', entityType: 'PARTNER' } as DataInventoryInterface,
      { id: 'test2', entityType: 'IT_SYSTEM' } as DataInventoryInterface
    ];
    const params = new HttpParams().append(
      'ids',
      items.map(item => item.id).toString()
    );
    service.exportSelected(items);
    expect(getSpy).toHaveBeenCalledWith(`/api/hub/exports/async`, {
      observe: 'response',
      responseType: 'blob',
      params: params
    });
  });

  it('should call same endpoint for COMPANY_AFFILIATE type record selected', () => {
    testTypeSpecificCall('COMPANY_AFFILIATE', '/api/hub/exports/async');
  });

  it('should call same endpoint for IT_SYSTEM type record selected', () => {
    testTypeSpecificCall('IT_SYSTEM', '/api/hub/exports/async');
  });

  it('should call same endpoint for PARTNER type record selected', () => {
    testTypeSpecificCall('PARTNER', '/api/hub/exports/async');
  });

  it('should call same endpoint for PRIMARY_ENTITY type record selected', () => {
    testTypeSpecificCall('PRIMARY_ENTITY', '/api/hub/exports/async');
  });

  it('should call same endpoint for VENDOR type record selected', () => {
    testTypeSpecificCall('VENDOR', '/api/hub/exports/async');
  });

  function testTypeSpecificCall(type: DataInventoryType, url: string) {
    const service: ExportService = TestBed.get(ExportService);

    const httpClient: HttpClient = TestBed.get(HttpClient);
    const getSpy = spyOn(httpClient, 'get');
    const items: DataInventoryInterface[] = [
      { id: 'test1', entityType: type } as DataInventoryInterface,
      { id: 'test2', entityType: type } as DataInventoryInterface
    ];
    const params = new HttpParams().append(
      'ids',
      items.map(item => item.id).toString()
    );
    service.exportSelected(items);
    expect(getSpy).toHaveBeenCalledWith(url, {
      observe: 'response',
      responseType: 'blob',
      params: params
    });
  }
});
