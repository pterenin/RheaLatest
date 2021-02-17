import { TestBed } from '@angular/core/testing';

import { PrimaryCompanyDetailsService } from './primary-company-details.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RiskIndicatorModule } from 'src/app/shared/components/risk-indicator/risk-indicator.module';

describe('PrimaryCompanyDetailsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RiskIndicatorModule]
    })
  );

  it('should be created', () => {
    const service: PrimaryCompanyDetailsService = TestBed.get(
      PrimaryCompanyDetailsService
    );
    expect(service).toBeTruthy();
  });
});
