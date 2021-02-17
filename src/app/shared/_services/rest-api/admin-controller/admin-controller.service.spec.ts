import { TestBed } from '@angular/core/testing';

import { AdminControllerService } from './admin-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminControllerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: AdminControllerService = TestBed.get(AdminControllerService);
    expect(service).toBeTruthy();
  });
});
