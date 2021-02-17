import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsBreadcrumbComponent } from './settings-breadcrumb.component';
import { RouterModule } from '@angular/router';
import { TaBadgeModule } from '@trustarc/ui-toolkit';
import { CustomCategoryTagModule } from '../custom-category-tag/custom-category-tag.module';

@NgModule({
  declarations: [SettingsBreadcrumbComponent],
  imports: [CommonModule, RouterModule, TaBadgeModule, CustomCategoryTagModule],
  exports: [SettingsBreadcrumbComponent]
})
export class SettingsBreadcrumbModule {}
