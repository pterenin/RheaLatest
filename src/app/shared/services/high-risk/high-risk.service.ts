import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HighRiskFactorsCategoryInterface } from '../../models/high-risk.model';

@Injectable({
  providedIn: 'root'
})
export class HighRiskService {
  constructor(private httpClient: HttpClient) {}

  public getAllHighRiskFactorCategories(): Observable<
    HighRiskFactorsCategoryInterface[]
  > {
    return this.httpClient.get<HighRiskFactorsCategoryInterface[]>(
      `api/hub/high-risk-factor-categories`
    );
  }
}
