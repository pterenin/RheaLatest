import { TestBed } from '@angular/core/testing';

import { RevalidationNotificationControllerService } from './revalidation-notification-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RevalidationNotificationControllerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: RevalidationNotificationControllerService = TestBed.get(
      RevalidationNotificationControllerService
    );
    expect(service).toBeTruthy();
  });
});
