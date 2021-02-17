import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ItSystemDetailsFormService } from './it-system-details.service';
import { ToastService, TaToastModule } from '@trustarc/ui-toolkit';

describe('ItSystemDetailsFormService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TaToastModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [ItSystemDetailsFormService, ToastService]
    })
  );

  it('should be created', () => {
    const service: ItSystemDetailsFormService = TestBed.get(
      ItSystemDetailsFormService
    );
    expect(service).toBeTruthy();
  });
});
