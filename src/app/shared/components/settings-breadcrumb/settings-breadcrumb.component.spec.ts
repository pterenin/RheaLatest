import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsBreadcrumbComponent } from './settings-breadcrumb.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TaBadgeModule } from '@trustarc/ui-toolkit';
import { CustomCategoryTagModule } from '../custom-category-tag/custom-category-tag.module';

describe('SettingsBreadcrumbComponent', () => {
  let component: SettingsBreadcrumbComponent;
  let fixture: ComponentFixture<SettingsBreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsBreadcrumbComponent],
      imports: [
        RouterModule,
        RouterTestingModule,
        TaBadgeModule,
        CustomCategoryTagModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
