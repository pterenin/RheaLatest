import { TestBed } from '@angular/core/testing';

import { LegalBasesControllerService } from './legal-bases-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LegalBasesControllerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: LegalBasesControllerService = TestBed.get(
      LegalBasesControllerService
    );
    expect(service).toBeTruthy();
  });
});
