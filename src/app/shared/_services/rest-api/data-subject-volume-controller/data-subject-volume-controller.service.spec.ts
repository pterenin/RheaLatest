import { TestBed } from '@angular/core/testing';

import { DataSubjectVolumeControllerService } from './data-subject-volume-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DataSubjectVolumeControllerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: DataSubjectVolumeControllerService = TestBed.get(
      DataSubjectVolumeControllerService
    );
    expect(service).toBeTruthy();
  });
});
