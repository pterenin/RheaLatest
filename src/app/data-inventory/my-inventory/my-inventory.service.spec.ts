import { TestBed } from '@angular/core/testing';
import { MyInventoryService } from './my-inventory.service';

describe('MyInventoryService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [],
      providers: [MyInventoryService]
    })
  );

  it('should be created', () => {
    const service: MyInventoryService = TestBed.get(MyInventoryService);
    expect(service).toBeTruthy();
  });
});
