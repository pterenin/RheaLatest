import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AmIntegrationService } from './am-integration.service';
import { getRouteParamObservable } from 'src/app/shared/utils/route-utils';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ta-amintegration',
  templateUrl: './am-integration.component.html',
  styleUrls: ['./am-integration.component.scss']
})
export class AmintegrationComponent implements OnInit {
  private _paramMap$: Subscription;

  constructor(
    private amIntegrationService: AmIntegrationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this._paramMap$ = getRouteParamObservable(
      this.route.paramMap,
      'type'
    ).subscribe(recordType => {
      this.amIntegrationService.handleAmCreateAndRedirect(recordType);
    });
  }
}
