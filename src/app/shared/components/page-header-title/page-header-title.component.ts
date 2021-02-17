import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RoutingStateService } from 'src/app/global-services/routing-state.service';

@Component({
  selector: 'ta-page-header-title',
  templateUrl: './page-header-title.component.html',
  styleUrls: ['./page-header-title.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageHeaderTitleComponent implements OnInit {
  public _isUploading: boolean;

  @Input() navPath: String;
  constructor(
    private router: Router,
    private routingStateService: RoutingStateService
  ) {}

  ngOnInit() {}

  closeView() {
    if (!this._isUploading) {
      const lastRoute = this.routingStateService.getLatestReplayableHistory();
      if (lastRoute && lastRoute.url) {
        this.router.navigate([lastRoute.url]);
      } else {
        this.router.navigate([this.navPath]);
      }
    }
  }

  @Input()
  set isUploading(isUploading: boolean) {
    this._isUploading = isUploading;
  }
}
