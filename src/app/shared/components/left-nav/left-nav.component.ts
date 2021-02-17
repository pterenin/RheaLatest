import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  QueryList,
  ViewChildren
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { LeftNavRoutesInterface } from '../../../app-routing.model';

import { LoadingEventService } from '../../services/loading/loading-event.service';
import { Events } from '../../../app.constants';

declare const _: any;

@Component({
  selector: 'ta-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements AfterViewInit {
  public displayMenu = false;

  @Input() public leftNav: LeftNavRoutesInterface[];

  @ViewChildren('sideNavLinks') refs: QueryList<any>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private loadingEventService: LoadingEventService
  ) {}

  ngAfterViewInit() {
    this.processHeaderIsLoaded();
  }

  // This method check if the header DOM tree is mutated by provider.js
  processHeaderIsLoaded() {
    this.loadingEventService.getData().subscribe(event => {
      const { type } = event;
      if (type === Events.AAA_TOP_HEADER_LOADED && !this.displayMenu) {
        const clientApps = _.get(
          window,
          'window.truste.aaa.topHeader.client_apps'
        );

        let clioAccess: any;
        if (clientApps) {
          clioAccess = clientApps.find((app: any) => {
            if (app.clientId) {
              return app.clientId === 'clio-client';
            } else {
              return app.name === 'Dashboard Reporting';
            }
          });
        }
        this.displayMenu = true;
        this.refs.forEach(ref => {
          if (ref.nativeElement.pathname === '/dashboard' && clioAccess) {
            ref.nativeElement.href = clioAccess.url + '?app=dfm';
            ref.nativeElement.addEventListener(
              'click',
              ($event: MouseEvent) => {
                $event.preventDefault();
                window.open(ref.nativeElement.href, '_self');
              }
            );
          }
        });
      }
    });
  }
}
