import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesComponent } from './categories.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import {
  TaBadgeModule,
  TaPaginationModule,
  TaSvgIconModule,
  TaTableModule,
  TaToastModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CustomCategoryTagModule } from '../custom-category-tag/custom-category-tag.module';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesComponent],
      imports: [
        CommonModule,
        PageWrapperModule,
        TaTableModule,
        TaTooltipModule,
        RouterModule,
        RouterTestingModule,
        TaSvgIconModule,
        TaBadgeModule,
        TaPaginationModule,
        HttpClientTestingModule,
        TaToastModule,
        CustomCategoryTagModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
