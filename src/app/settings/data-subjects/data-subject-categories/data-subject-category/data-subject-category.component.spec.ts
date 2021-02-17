import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubjectCategoryComponent } from './data-subject-category.component';
import { CategoriesModule } from '../../../../shared/components/categories/categories.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaToastModule } from '@trustarc/ui-toolkit';
import { TranslateModule } from '@ngx-translate/core';

describe('DataSubjectCategoryComponent', () => {
  let component: DataSubjectCategoryComponent;
  let fixture: ComponentFixture<DataSubjectCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataSubjectCategoryComponent],
      imports: [
        CategoriesModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TaToastModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubjectCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
