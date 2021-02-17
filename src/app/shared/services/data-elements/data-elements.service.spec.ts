import { TestBed } from '@angular/core/testing';

import { DataElementsService } from './data-elements.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('DataElementsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: DataElementsService = TestBed.get(DataElementsService);
    expect(service).toBeTruthy();
  });

  it('should call the correct get all classifications endpoint', () => {
    const service: DataElementsService = TestBed.get(DataElementsService);

    const httpClient: HttpClient = TestBed.get(HttpClient);
    const getSpy = spyOn(httpClient, 'get');
    service.getAllClassificationLevel();
    expect(getSpy).toHaveBeenCalledWith(
      `api/hub/data-elements/data-element-types`
    );
  });
});
