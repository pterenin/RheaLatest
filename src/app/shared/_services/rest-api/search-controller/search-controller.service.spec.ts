import { TestBed } from '@angular/core/testing';

import { SearchControllerService } from './search-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SearchControllerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: SearchControllerService = TestBed.get(
      SearchControllerService
    );
    expect(service).toBeTruthy();
  });
});
