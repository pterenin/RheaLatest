import { TestBed } from '@angular/core/testing';

import { PrimaryEntityControllerService } from './primary-entity-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PrimaryEntityControllerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: PrimaryEntityControllerService = TestBed.get(
      PrimaryEntityControllerService
    );
    expect(service).toBeTruthy();
  });
});
