import { Injectable } from '@angular/core';
import { ClientApp } from './header.model';

declare const _: any;

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private clientApps: any;

  constructor() {}

  setLinkActive(routerEvent: any) {
    // AAA Header hook
    document.querySelectorAll('.te-nav li').forEach(nav => {
      nav.classList.remove('active'); // Removing active link
      const navId = nav.id.toString();
      const newNavId = navId.replace('te-menu-', '');
      const aaNavLink = routerEvent.aaaNavLink
        ? routerEvent.aaaNavLink.toLowerCase()
        : null;
      if (aaNavLink && aaNavLink.search(newNavId) > -1) {
        nav.classList.add('active');
      }
    });
  }

  public setClientApps(clientApps: ClientApp[]) {
    this.clientApps = clientApps;
  }

  public getClientApp(clientId) {
    let app: ClientApp;
    if (!this.clientApps) {
      const clientApps = _.get(
        window,
        'window.truste.aaa.topHeader.client_apps'
      );
      this.setClientApps(clientApps);
    }
    if (this.clientApps) {
      app = this.clientApps.find(clientApp => {
        return clientApp.clientId === clientId;
      });
    }
    return app;
  }
}
