import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryComponent } from './category.component';
import { CommonModule } from '@angular/common';
import { PageWrapperModule } from '../../page-wrapper/page-wrapper.module';
import {
  TaBadgeModule,
  TaPaginationModule,
  TaSvgIconModule,
  TaTableModule,
  TaToastModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CustomCategoryTagModule } from '../../custom-category-tag/custom-category-tag.module';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryComponent],
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
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
