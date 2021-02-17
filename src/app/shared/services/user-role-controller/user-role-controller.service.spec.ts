/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { UserRoleControllerService } from './user-role-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: UserRoleController', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserRoleControllerService]
    });
  });

  it('should ...', inject(
    [UserRoleControllerService],
    (service: UserRoleControllerService) => {
      expect(service).toBeTruthy();
    }
  ));
});
