import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DetailsFormService } from './details-form.service';
import { TaToastModule, ToastService } from '@trustarc/ui-toolkit';

describe('DetailsFormService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TaToastModule, RouterTestingModule],
      providers: [DetailsFormService, ToastService]
    })
  );

  it('should be created', () => {
    const service: DetailsFormService = TestBed.get(DetailsFormService);
    expect(service).toBeTruthy();
  });
});
