import { TestBed } from '@angular/core/testing';

import { ItSystemControllerService } from './it-system-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ItSystemControllerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ItSystemControllerService = TestBed.get(
      ItSystemControllerService
    );
    expect(service).toBeTruthy();
  });
});
