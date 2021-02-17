import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { PlatformNavigation } from '../../_types/platform-navigation';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private _isReady = false;
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthService
  ) {}
  init() {
    this._isReady = true;
    window.trustArcPlatformNavigation.on(
      'menuSelected',
      this.handleMenuSelected.bind(this)
    );
    window.trustArcPlatformNavigation.on(
      'menuToggled',
      this.handleMenuToggled.bind(this)
    );
  }
  handleMenuSelected(data: PlatformNavigation.MenuSelectedEventData) {
    // Apply route change logic here
    this.ngZone.run(() => {
      if (data.parent && data.parent.text === 'Integrations') {
        window.location.href =
          this.authService.getSeleneClientUrl + data.item.url;
      } else {
        this.router.navigateByUrl(data.item.url);
      }
    });
  }
  handleMenuToggled(data: PlatformNavigation.MenuToggledEventData) {
    // Apply logic here when menu is toggled
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }

  selectMenu() {
    const currentRoute = Array.from(this.router.url.split('/'));
    currentRoute.shift();

    if (this._isReady) {
      setTimeout(() => {
        if (currentRoute[0] === 'business-process') {
          window.trustArcPlatformNavigation.selectMenu(['Business Processes']);
        } else if (currentRoute[0] === 'data-inventory') {
          window.trustArcPlatformNavigation.selectMenu(['Data Inventory']);
        } else {
          window.trustArcPlatformNavigation.selectMenu([
            this.capitalizeWords(currentRoute[0]),
            this.capitalizeWords(currentRoute[1])
          ]);
        }
      });
    }
  }

  capitalizeWords(str) {
    return str.replace(/-/g, ' ').replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}
