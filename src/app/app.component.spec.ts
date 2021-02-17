import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeftNavComponent } from './shared/components/left-nav/left-nav.component';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  UrlTree
} from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  TaBreadcrumbModule,
  TaProgressbarModule,
  TaToastModule
} from '@trustarc/ui-toolkit';
import { TranslateModule } from '@ngx-translate/core';
import { UserRoleControllerService } from './shared/services/user-role-controller/user-role-controller.service';
import { of } from 'rxjs';
import { FooterModule } from './shared/components/footer/footer.module';
import { AdminControllerService } from './shared/_services/rest-api';
// tslint:disable-next-line:max-line-length
import { DownloadReportFakeProgressBarComponent } from './shared/components/download-report-fake-progress-bar/download-report-fake-progress-bar.component';

const routerStub = {
  // Router
  events: of(new NavigationEnd(0, '/', '/test')),
  createUrlTree: (commands, navExtras = {}) => {},
  serializeUrl: (url: UrlTree) => '',
  navigate: jasmine.createSpy('navigate')
};

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TaBreadcrumbModule,
        TaProgressbarModule,
        TaToastModule,
        FooterModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        LeftNavComponent,
        DownloadReportFakeProgressBarComponent
      ],
      providers: [
        { provide: Router, useValue: routerStub },
        {
          provide: ActivatedRoute,
          useValue: {
            root: {
              children: [{ path: '', data: { breadcrumb: 'test' } }]
            },
            firstChild: {
              outlet: 'primary',
              data: of({
                title: 'Settings',
                breadcrumb: 'Settings',
                showLeftNav: true,
                leftNavType: 'SETTINGS',
                showBreadCrumb: true,
                footer: true,
                header: true
              })
            }
          }
        },
        UserRoleControllerService,
        AdminControllerService
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  }));
});
