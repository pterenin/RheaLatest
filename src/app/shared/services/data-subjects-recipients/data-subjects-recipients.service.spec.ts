import { TestBed } from '@angular/core/testing';

import { DataSubjectsRecipientsService } from './data-subjects-recipients.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DataSubjectsRecipientsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] })
  );

  it('should be created', () => {
    const service: DataSubjectsRecipientsService = TestBed.get(
      DataSubjectsRecipientsService
    );
    expect(service).toBeTruthy();
  });
});
