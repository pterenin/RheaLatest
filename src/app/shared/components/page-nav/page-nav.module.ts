import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNavComponent } from './page-nav.component';
import { PageNavDefaultComponent } from './page-nav-default/page-nav-default.component';
import { PageNavMinimalComponent } from './page-nav-minimal/page-nav-minimal.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PageNavComponent,
    PageNavDefaultComponent,
    PageNavMinimalComponent
  ],
  imports: [CommonModule, RouterModule],
  exports: [PageNavComponent, PageNavDefaultComponent]
})
export class PageNavModule {}
