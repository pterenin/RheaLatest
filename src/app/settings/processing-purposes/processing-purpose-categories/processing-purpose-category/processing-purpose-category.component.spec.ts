import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingPurposeCategoryComponent } from './processing-purpose-category.component';
import { CategoriesModule } from '../../../../shared/components/categories/categories.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaToastModule } from '@trustarc/ui-toolkit';
import { TranslateModule } from '@ngx-translate/core';

describe('ProcessingPurposeCategoryComponent', () => {
  let component: ProcessingPurposeCategoryComponent;
  let fixture: ComponentFixture<ProcessingPurposeCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessingPurposeCategoryComponent],
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
    fixture = TestBed.createComponent(ProcessingPurposeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
