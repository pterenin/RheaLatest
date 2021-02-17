import { Component, OnInit, Renderer2, Inject, NgZone } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { filter, map, mergeMap } from 'rxjs/operators';
import { LeftNavRoutesInterface, getLeftNavRoutes } from './app-routing.model';
import { HeaderService } from './shared/components/header/header.service';

import { UserRoleControllerService } from './shared/services/user-role-controller/user-role-controller.service';
import { FeatureFlagService } from './shared/services/feature-flag/feature-flag.service';
import { AdminControllerService } from './shared/_services/rest-api';
import { NavigationService } from './shared/_services/navigation/navigation.service';
import { AuthService } from './shared/services/auth/auth.service';
import { DOCUMENT } from '@angular/common';
import { AuthInterface } from './shared/services/auth/auth.model';
import { Subscription } from 'rxjs';
import { ToastService, TaModalConfig } from '@trustarc/ui-toolkit';
import { NotificationService } from './shared/services/notification/notification.service';
import { DownloadReportEvent } from './app.constants';

declare const _: any;

/**
 * Component Decorator TA Root
 */
@Component({
  selector: 'ta-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  /**
   * Notified the app if ready,
   * appReady has a DOM dependecy on AAA Header
   */
  appReady: boolean;
  showHeader: boolean;
  showFooter: boolean;
  showDownloadingReport: boolean;

  /**
   * Displays left nav based on data leftnav property.
   * Please check routes object.
   */
  showLeftNav: boolean;
  showBreadCrumb: boolean;

  /**
   * leftNavLinks uses the LeftNavRoutesInterface
   */
  leftNavLinks: LeftNavRoutesInterface[];

  /**
   * Page title that disply in UI
   */
  pageTitle: string;

  /**
   * Subscription for Authorities
   */
  _getCurrentUserAuthoritiesInMemory$: Subscription;
  _notificationSubscription$: Subscription;
  headerWhite: boolean;
  headerTitle: any;

  /**
   * Constructor
   * @param Router provides the navigation and url manipulation capabilities.
   * @param ActivatedRoute an `ActivatedRoute` can also be used to traverse the router state tree.
   * @param Title a service that can be used to get and set the title of a current HTML document.
   */
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private headerService: HeaderService,
    private userRoleControllerService: UserRoleControllerService,
    private featureFlagService: FeatureFlagService,
    private adminControllerService: AdminControllerService,
    private navigationService: NavigationService,
    private authService: AuthService,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private toastService: ToastService,
    private modalConfig: TaModalConfig,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.modalConfig.backdrop = 'static';
    this.modalConfig.keyboard = true;
    this.appReady = false; // Revert back to false if header is ready should be false
    this.showHeader = true;
    this.showFooter = true;
    this.showDownloadingReport = false;

    window.platformNavConfig = {
      appContainerId: 'main-container',
      onReady: () => {
        this.ngZone.run(() => {
          this.navigationService.init();
          this.setSeleneClientUrlToAuthService();
        });
      }
    };
    window.onSignInCallback = event => {
      console.log(event);
      this.ngZone.run(() => {
        this.signInCallback(event);
      });
    };

    this.injectProviderJS();
  }

  /**
   * Init routerSubscription
   */
  ngOnInit() {
    this.routerSubscription();
    this.downloadReportSubscription();
  }

  private downloadReportSubscription(): void {
    this._notificationSubscription$ = this.notificationService
      .getData()
      .subscribe(value => {
        const { action } = value;
        if (action === DownloadReportEvent.Start) {
          this.showDownloadingReport = true;
        }
        if (action === DownloadReportEvent.End) {
          this.showDownloadingReport = false;
        }
      });
  }

  private injectProviderJS() {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = window['AAA_URL'];

    // Inject Script
    this.renderer.appendChild(this.document.body, script);
  }

  /**
   * Subscribe for router change
   * this will modify the Native Element of the app page
   * it will show/hide leftNav and
   * it will update page title
   */
  routerSubscription(): void {
    // Subscribe on router change
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(event => {
        this.titleService.setTitle(`${event.title} | TrustArc Compliance`); // [i18n-tobeinternationalized]
        this.pageTitle = event.title;
        this.showLeftNav = event.showLeftNav;
        this.showBreadCrumb = event.showBreadCrumb;
        this.leftNavLinks = getLeftNavRoutes(event.leftNavType);
        this.showHeader = event.header;
        this.showFooter = event.footer;
        this.headerWhite = event.headerWhite;
        this.headerTitle = event.headerTitle;
        this.headerService.setLinkActive(event);
        this.configureLeftMenuByFeature(event.leftNavType);

        if (this.userRoleControllerService.getNoAppAccess) {
          this.router.navigate(['no-access']);
        }

        if (this.appReady) {
          this.navigationService.selectMenu();
        }
      });
  }

  configureLeftMenuByFeature(moduleName) {
    if (!moduleName) {
      return;
    }
    const features = this.featureFlagService.getFeaturesList(moduleName);

    if (features.length > 0) {
      const labels = getLeftNavRoutes(moduleName);
      features.map(f => {
        const index = labels.findIndex(
          x =>
            x.label.toLowerCase() === f.menuLabel.toLowerCase() &&
            f.isEnabled === false
        );
        if (index > -1) {
          labels.splice(index, 1);
        }
      });
      this.leftNavLinks = labels;
    }
  }

  private signInCallback(authResult: AuthInterface) {
    this.authService.setToken = authResult.token.token;
    this.authService.setTimezone = authResult.tokenInfo.zoneInfo || undefined;
    this.authService.setLocale =
      authResult.tokenInfo.locale || AuthService.DEFAULT_LANGUAGE;

    this.getCurrentUserAuthoritiesInMemory();
  }

  private getCurrentUserAuthoritiesInMemory() {
    this._getCurrentUserAuthoritiesInMemory$ = this.userRoleControllerService
      .getCurrentUserAuthoritiesInMemory()
      .subscribe(
        response => {
          this.appReady = true;
          this.navigationService.selectMenu();

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

  private setSeleneClientUrlToAuthService(): void {
    const seleneClientUrl = window.trustArcPlatformNavigation.userInfo.client_apps.find(
      app => app.clientId === 'selene-client'
    );
    if (seleneClientUrl) {
      this.authService.setSeleneClientUrl = seleneClientUrl.url;
    } else {
      this.authService.setSeleneClientUrl = '';
    }
  }
}
