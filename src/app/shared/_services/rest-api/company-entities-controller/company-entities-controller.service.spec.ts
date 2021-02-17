import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CompanyEntitiesControllerService } from './company-entities-controller.service';

describe('CompanyEntitiesControllerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: CompanyEntitiesControllerService = TestBed.get(
      CompanyEntitiesControllerService
    );
    expect(service).toBeTruthy();
  });
});
