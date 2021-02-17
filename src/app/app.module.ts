import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import {
  TaBreadcrumbModule,
  TaProgressbarModule,
  TaToastModule,
  ToastService,
  TaModule
} from '@trustarc/ui-toolkit';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthInterceptorService } from './shared/services/auth/auth-interceptor.service';
import { DomWatchModule } from './shared/directives/dom-watch/dom-watch.module';
import { LeftNavModule } from './shared/components/left-nav/left-nav.module';
import { RecordDatagridModule } from './shared/components/record-datagrid/record-datagrid.module';
import { PageWrapperModule } from './shared/components/page-wrapper/page-wrapper.module';
import { InfoModalModule } from './shared/components/info-modal/info-modal.module';
import { NoAccessComponent } from './no-access/no-access.component';
import { AsyncCategoricalDropdownModule } from './shared/components/async-categorical-dropdown/async-categorical-dropdown.module';
import { LocationModalContentModule } from 'src/app/shared/components/location-modal-content/location-modal-content.module';
import { LocationModule } from 'src/app/shared/components/location/location.module';
import { CountrySelectorModule } from './shared/components/country-selector/country-selector.module';
import { FooterModule } from './shared/components/footer/footer.module';
import { ComponentRegistryModule } from './component-registry/component-registry.module';
import { StateModule } from './shared/components/state/state.module';
// tslint:disable-next-line:max-line-length
import { DownloadReportFakeProgressBarComponent } from './shared/components/download-report-fake-progress-bar/download-report-fake-progress-bar.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NoAccessComponent,
    DownloadReportFakeProgressBarComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CountrySelectorModule,
    DomWatchModule,
    TaBreadcrumbModule,
    TaToastModule,
    TaProgressbarModule,
    LeftNavModule,
    LocationModule,
    LocationModalContentModule,
    PageWrapperModule,
    AsyncCategoricalDropdownModule,
    HttpClientModule,
    InfoModalModule,
    LocationModule,
    StateModule,
    TaModule,
    FooterModule,
    ComponentRegistryModule,
    StateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RecordDatagridModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    ToastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
