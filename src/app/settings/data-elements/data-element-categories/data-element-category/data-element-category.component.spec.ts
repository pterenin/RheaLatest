import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataElementCategoryComponent } from './data-element-category.component';
import { CategoriesModule } from '../../../../shared/components/categories/categories.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaToastModule } from '@trustarc/ui-toolkit';
import { TranslateModule } from '@ngx-translate/core';

describe('DataElementCategoryComponent', () => {
  let component: DataElementCategoryComponent;
  let fixture: ComponentFixture<DataElementCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataElementCategoryComponent],
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
    fixture = TestBed.createComponent(DataElementCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
