import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Events } from '../../../app.constants';
import { AAA_HEADER_CONFIG } from './header.constant';
import { AuthService } from '../../services/auth/auth.service';
import { AuthInterface } from '../../services/auth/auth.model';
import { LoadingEventService } from '../../services/loading/loading-event.service';
import { Router } from '@angular/router';
import { UserRoleControllerService } from '../../services/user-role-controller/user-role-controller.service';
import { Subscription } from 'rxjs';
import { ToastService } from '@trustarc/ui-toolkit';
import { HeaderService } from './header.service';
import { ClientApp } from './header.model';

declare const _: any;

@Component({
  selector: 'ta-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public displayMenu = false;
  private teNav: any;

  @Output()
  public rendered = new EventEmitter();

  private _getCurrentUserAuthoritiesInMemory$: Subscription;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private loadingEventService: LoadingEventService,
    private userRoleControllerService: UserRoleControllerService,
    private toastService: ToastService,
    private router: Router,
    private headerService: HeaderService
  ) {}

  ngOnInit() {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = window['AAA_URL'];
    // Inject Script
    this.renderer.appendChild(this.document.body, script);
    // Create headerConfig window callback
    // This is also have reference in meta in index.html
    window['staticHeaderConfig'] = AAA_HEADER_CONFIG;
    // Create success sign in window callback
    // This is also have reference in meta in index.html
    window['onSignInCallback'] = this.signInCallback.bind(this);
    // Listens on the top header is loaded
    this.processHeaderIsLoaded();
    this.document.addEventListener(
      Events.AAA_TOP_HEADER_LOADED,
      this.headerIsLoaded.bind(this)
    );
  }

  signInCallback(authResult: AuthInterface) {
    this.authService.setToken = authResult.token.token;
    this.authService.setTimezone = authResult.tokenInfo.zoneInfo || undefined;
    this.authService.setLocale =
      authResult.tokenInfo.locale || AuthService.DEFAULT_LANGUAGE;

    this.rendered.emit({
      headerIsReady: true
    });

    this.getCurrentUserAuthoritiesInMemory();
  }

  headerIsLoaded() {
    // Emitting "AAATopheaderLoaded" event to all subscribers
    this.loadingEventService.emitLoaded({ type: Events.AAA_TOP_HEADER_LOADED });
  }

  // This method check if the header DOM tree is mutated by provider.js
  processHeaderIsLoaded() {
    this.loadingEventService.getData().subscribe(event => {
      const { type } = event;
      if (type === Events.AAA_TOP_HEADER_LOADED) {
        this.teNav = document.querySelectorAll('.te-nav li a');
        if (!this.displayMenu) {
          const clientApps = _.get(
            window,
            'window.truste.aaa.topHeader.client_apps'
          );

          const headerLinks = document.querySelector('.te-header-links');
          if (headerLinks) {
            headerLinks.innerHTML =
              '<a href=' +
              '"https://support.trustarc.com/wp-content/uploads/2020/03/Data-Inventory-Hub-User-Guide-v1.5.pdf"' +
              'target="_blank">User Guide</a>';
          }

          this.headerService.setClientApps(clientApps);

          let clioAccess: ClientApp;
          if (clientApps) {
            clioAccess = clientApps.find((app: ClientApp) => {
              if (app.clientId) {
                return app.clientId === 'clio-client';
              } else {
                return app.name === 'Dashboard Reporting';
              }
            });
          }

          // Display AAA header
          this.displayMenu = true;

          // As well stopping the default event.
          this.teNav.forEach(async (item: HTMLLinkElement) => {
            if (item.attributes['href'].value === '/dashboard' && clioAccess) {
              document.querySelector('#te-menu-dashboard a')['href'] =
                clioAccess.url + '?app=dfm';
            } else {
              item.addEventListener('click', ($event: MouseEvent) => {
                if (item.innerText.toLowerCase().search('nymity') > -1) {
                  return false;
                }
                $event.preventDefault();
                this.router.navigate([
                  `${$event.target['pathname'].replace('/', '')}`
                ]);
              });
            }
          });

          this.mymityToolLink();
        }
      }
    });
  }

  getCurrentUserAuthoritiesInMemory() {
    this._getCurrentUserAuthoritiesInMemory$ = this.userRoleControllerService
      .getCurrentUserAuthoritiesInMemory()
      .subscribe(
        response => {
          if (_.includes(response, 'rhea_no_access')) {
            this.userRoleControllerService.setNoAppAccess = true;
            this.router.navigate(['no-access']);
          } else {
            // Do something below if needed for specific users
            this.userRoleControllerService.setNoAppAccess = false;
          }
        },
        error => {
          if (error.status === 403) {
            this.userRoleControllerService.setNoAppAccess = true;
            this.router.navigate(['no-access']);
          } else {
            this.toastService.error('error fetching user access.');
          }
        }
      );
  }

  private mymityToolLink() {
    const headerLinks = Array.from(document.querySelectorAll('.te-nav li'));
    headerLinks.forEach(link => {
      if (link.innerHTML.search('nymity') > -1) {
        link.querySelector('a').setAttribute('target', '_blank');
      }
    });
  }

  ngOnDestroy(): void {
    if (this._getCurrentUserAuthoritiesInMemory$) {
      this._getCurrentUserAuthoritiesInMemory$.unsubscribe();
    }
  }
}
